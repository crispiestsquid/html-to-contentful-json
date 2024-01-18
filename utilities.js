const path = require('path');
const mime = require('mime-types');

function mergeAdjacentBlockquotesInJson(content) {
  const mergedContent = [];
  let previousBlockquote = null;

  for (const node of content) {
    if (node.nodeType === 'blockquote') {
      if (previousBlockquote) {
        // Merge current blockquote content into the previous one
        previousBlockquote.content.push(...node.content);
      } else {
        // Start a new blockquote and keep a reference to it
        previousBlockquote = node;
        mergedContent.push(previousBlockquote);
      }
    } else {
      previousBlockquote = null;
      mergedContent.push(node);
    }
  }

  return mergedContent;
}

function getFileNameAndContentType(fileUrl) {
  const fileName = path.basename(fileUrl);
  const contentType = mime.lookup(fileName);

  return { fileName, contentType };
}

module.exports = {
  mergeAdjacentBlockquotesInJson,
  getFileNameAndContentType,
};
