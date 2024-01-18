const cheerio = require('cheerio');
const { createImageNode } = require('./contentfulManagement');

async function htmlToContentfulRichText(html, configuration) {
  const $ = cheerio.load(html);
  let content = [];
  const elements = $('body').children().toArray();

  for (const element of elements) {
    switch (element.tagName) {
      case 'p':
        content.push(parseNode($, element, 'paragraph'));
        break;
      case 'h2':
        content.push(parseNode($, element, 'heading-2'));
        break;
      case 'ul':
        content.push(parseListNode($, element, 'unordered-list'));
        break;
      case 'ol':
        content.push(parseListNode($, element, 'ordered-list'));
        break;
      case 'hr':
        content.push({ nodeType: 'hr', data: {}, content: [] });
        break;
      case 'blockquote':
        content.push(parseBlockquote($, element));
        break;
      case 'img':
        if (configuration && !configuration.ignoreImages) {
          if (
            !configuration.spaceId ||
            !configuration.environmentId ||
            !configuration.accessToken ||
            !configuration.locale
          ) {
            throw new Error(
              'Missing configuration for uploading images to Contentful... Please provide spaceId, environmentId, accessToken, and locale.'
            );
          }
          const imageNode = await createImageNode($(element), configuration);
          content.push(imageNode);
        }
        break;
      // Add cases for other tags
      default:
        break;
    }
  }

  if (configuration && configuration.mergeAdjacentBlockquotes) {
    content = mergeAdjacentBlockquotesInJson(content);
  }

  return {
    nodeType: 'document',
    data: {},
    content: content,
  };
}

function parseNode($, node, nodeType) {
  const content = [];
  $(node)
    .contents()
    .each((index, child) => {
      if (child.type === 'text') {
        content.push(createTextNode(child.data));
      } else {
        content.push(...parseElement($, child));
      }
    });

  return {
    nodeType: nodeType,
    data: {},
    content: content,
  };
}

function parseBlockquote($, blockquoteNode) {
  const blockquoteContent = [];
  $(blockquoteNode)
    .children()
    .each((index, child) => {
      if (child.tagName === 'p') {
        blockquoteContent.push(parseNode($, child, 'paragraph'));
      }
    });

  return {
    nodeType: 'blockquote',
    data: {},
    content: blockquoteContent,
  };
}

function parseElement($, element) {
  const nodeType = element.tagName;
  switch (nodeType) {
    case 'strong':
      return parseNodeWithMark($, element, 'bold');
    case 'em':
      return parseNodeWithMark($, element, 'italic');
    case 'u':
      return parseNodeWithMark($, element, 'underline');
    case 'a':
      return [
        {
          nodeType: 'hyperlink',
          content: parseNodeContents($, element),
          data: {
            uri: $(element).attr('href'),
          },
        },
      ];
    // Handle other elements like 'li' inside 'parseListNode'
    default:
      return parseNodeContents($, element); // Handle nested content
  }
}

function parseNodeWithMark($, element, markType) {
  return parseNodeContents($, element).map((node) => ({
    ...node,
    marks: node.marks.concat([{ type: markType }]),
  }));
}

function parseNodeContents($, element) {
  const contents = [];
  $(element)
    .contents()
    .each((index, child) => {
      if (child.type === 'text') {
        contents.push(createTextNode(child.data));
      } else {
        contents.push(...parseElement($, child));
      }
    });
  return contents;
}

function createTextNode(text, markType = null) {
  const node = {
    nodeType: 'text',
    value: text,
    marks: [],
    data: {},
  };
  if (markType) {
    node.marks.push({ type: markType });
  }
  return node;
}

function parseListNode($, listNode, nodeType) {
  const items = [];
  $(listNode)
    .children('li')
    .each((index, child) => {
      const listItemContent = parseNodeContents($, child);
      // Wrap content in a paragraph node if it's not already a paragraph
      const wrappedContent = listItemContent.every(
        (node) => node.nodeType !== 'paragraph'
      )
        ? [{ nodeType: 'paragraph', content: listItemContent, data: {} }]
        : listItemContent;

      items.push({
        nodeType: 'list-item',
        content: wrappedContent,
        data: {},
      });
    });
  return {
    nodeType: nodeType,
    data: {},
    content: items,
  };
}

module.exports = {
  htmlToContentfulRichText,
};
