const contentfulManagement = require('contentful-management');
const { getFileNameAndContentType } = require('./utilities');

async function createImageNode(imgElement, configuration) {
  const imageUrl = imgElement.attr('src');
  const altText = imgElement.attr('alt') || '';

  const asset = await uploadImageToContentful(imageUrl, altText, configuration);

  return {
    nodeType: 'embedded-asset-block',
    data: {
      target: {
        sys: {
          id: asset.sys.id,
          type: 'Link',
          linkType: 'Asset',
        },
      },
    },
    content: [],
  };
}

async function uploadImageToContentful(imageUrl, imageAltText, configuration) {
  const { spaceId, environmentId, accessToken, locale } = configuration;

  const { fileName, contentType } = getFileNameAndContentType(imageUrl);

  const client = contentfulManagement.createClient({
    accessToken: accessToken,
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  // Step 2: Create an Asset
  const asset = await environment.createAsset({
    fields: {
      title: {
        [locale]: fileName,
      },
      description: {
        [locale]: imageAltText,
      },
      file: {
        [locale]: {
          contentType: contentType,
          fileName: fileName,
          upload: imageUrl,
        },
      },
    },
  });

  // Step 3: Process the Asset
  await asset.processForAllLocales();

  // Step 4: Wait until processing is complete
  let assetProcessed = false;
  let retryCount = 0;
  const maxRetries = 10; // Maximum number of retries

  while (!assetProcessed && retryCount < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

    try {
      const updatedAsset = await environment.getAsset(asset.sys.id); // Fetch the asset again
      if (
        updatedAsset.fields.file &&
        updatedAsset.fields.file[locale] &&
        updatedAsset.fields.file[locale].url
      ) {
        assetProcessed = true;
      }
    } catch (error) {
      console.error('Error fetching updated asset:', error.message);
    }

    retryCount++;
  }

  if (!assetProcessed) {
    throw new Error('Asset processing timed out.');
  }

  // Step 5: Publish the Asset
  // Fetch the latest version of the asset after processing
  const processedAsset = await environment.getAsset(asset.sys.id);

  // Publish the processed asset
  const publishedAsset = await processedAsset.publish();

  return publishedAsset;
}

module.exports = {
  createImageNode,
};
