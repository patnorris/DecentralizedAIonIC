export const getResourceAsArray = async (pathToUploadedPdf) => {
  console.log("getResourceAsArray pathToUploadedPdf ", pathToUploadedPdf);
  let documentContent = await getDocumentContent(pathToUploadedPdf);
  console.log("getResourceAsArray documentContent ", documentContent);
  return documentContent;
};

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let { pdfjsLib } = globalThis;
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

const getDocumentContent = async (documentUrl) => {
  let documentContent = [];
  try {
    const pdf = await pdfjsLib.getDocument(documentUrl).promise;
    const numPages = pdf.numPages;
    const pageTextPromises = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const pagePromise = pdf.getPage(pageNum).then(page => {
        return page.getTextContent().then(textContent => {
          // Filter text items to remove those that contain only spaces or punctuation
          const filteredTextItems = textContent.items
              .map(item => item.str)
              .filter(str => str.trim().length > 0 && !/^\p{P}+$/u.test(str));

          // Concatenate and split text to ensure each entry is under the limit of characters (the LLM's context window size might otherwise not be able to handle it)
          const limitOfCharacters = 1300;
          let combinedText = '';
          const pageTexts = [];

          for (const text of filteredTextItems) {
            if (combinedText.length + text.length > limitOfCharacters) {
              pageTexts.push(combinedText);
              combinedText = text;
            } else {
              combinedText += (combinedText.length > 0 ? ' ' : '') + text;
            };
          };
          if (combinedText.length > 0) {
            pageTexts.push(combinedText);
          };
          return pageTexts.flat();
        });
      });
      pageTextPromises.push(pagePromise);
    };

    const pagesTextArrays = await Promise.all(pageTextPromises);
    // Flatten the array of arrays into a single array of strings
    documentContent = pagesTextArrays.flat();
    return documentContent;
  } catch (reason) {
    // PDF loading error
    console.error('Error loading PDF: ', reason);
    return documentContent;  // Return an empty array in case of an error
  };
};



