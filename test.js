const htmlToContentfulRichText = require('./index');

const sampleHtml = `<p>Hello, World!</p>`;

const test = async () => {
  try {
    const result = await htmlToContentfulRichText(sampleHtml);
    console.log('Test successful. Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed. Error:', error);
  }
};

test();
