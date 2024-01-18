# HTML to Contentful Rich-Text Converter

This package provides a simple and efficient way to convert HTML strings into Contentful Rich-Text JSON format. It's designed to be easy to use and integrates seamlessly with Contentful, including an optional feature to automatically upload images to Contentful as assets.

## Features

- Converts HTML strings to Contentful's Rich-Text JSON format.
- Optional automatic image uploading to Contentful as assets.
- Configurable options to tailor the conversion process to your needs.

## Installation

Install the package using npm:

```bash
npm install [your-package-name]
```

## Usage

To use the converter, simply import the `htmlToContentfulRichText` function from the package and pass your HTML string to it.

```javascript
const htmlToContentfulRichText = require('[your-package-name]');

const htmlString = `<p>Hello, World!</p>`;
const richText = await htmlToContentfulRichText(htmlString);

console.log(richText);
```

### Advanced Configuration

The `htmlToContentfulRichText` function accepts an optional configuration object as the second parameter. This can be used for additional features like automatic image uploading.

**Configuration Object Properties:**

- `spaceId`: Your Contentful space ID.
- `environmentId`: The environment ID in your Contentful space.
- `accessToken`: Contentful access token for authentication.
- `locale`: Locale setting for your content.
- `ignoreImages`: Set to `true` to skip image processing.
- `mergeAdjacentBlockquotes`: Set to `true` to merge adjacent blockquotes.

**Example with Configuration:**

```javascript
const config = {
  spaceId: 'your-space-id',
  environmentId: 'your-environment-id',
  accessToken: 'your-access-token',
  locale: 'en-US',
  ignoreImages: false,
  mergeAdjacentBlockquotes: true,
};

const richTextWithConfig = await htmlToContentfulRichText(htmlString, config);

console.log(richTextWithConfig);
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.txt) file for details.
