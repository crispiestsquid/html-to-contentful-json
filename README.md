# HTML to Contentful Rich-Text Converter

This package provides a simple and efficient way to convert HTML strings into Contentful Rich-Text JSON format. It's designed to be easy to use and integrates seamlessly with Contentful, including an optional feature to automatically upload images to Contentful as assets.

## Features

- Converts HTML strings to Contentful's Rich-Text JSON format.
- Optional automatic image uploading to Contentful as assets.
- Configurable options to tailor the conversion process to your needs.

## Supported Formatting Options

- `bold`
- `italics`
- `underline`
- `hyperlink`
- `blockquote`
- `p` (paragraph)
- `h2` (header 2)
- `ul` (unordered list)
- `ol` (ordered list)
- `hr` (horizontal rule)

More options will be added in future updates.

## Installation

Install the package using npm:

```bash
npm install html-to-contentful-json
```

## Usage (CommonJS)

To use the converter, simply import the `htmlToContentfulRichText` function from the package and pass your HTML string to it.

```javascript
const htmlToContentfulRichText = require('html-to-contentful-json');

const htmlString = `<p>Hello, World!</p>`;
const richText = await htmlToContentfulRichText(htmlString);

console.log(richText);
```

## Usage for ES6 Projects

If you are using this package in a project that utilizes ES6 (ECMAScript 2015) module imports, you should import the `htmlToContentfulRichText` function using the following syntax:

```typescript
import * as htmlToContentfulRichText from 'html-to-contentful-json';
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
