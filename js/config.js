const config = (function () {
  function laymanConfig() {
    return {
      randomShuffle: true, // Set to true or false based on your requirement
      documentSource: "data/epikriser/epikriser.json", // Source URL for documents
    };
  }

  function expertConfig() {
    return {
      randomShuffle: true, // Whether to shuffle documents randomly
      numberOfDocuments: 10, // Number of documents to fetch
      documentSource: "data/epikriser/epikriser.json", // Source URL for documents
      includeMethods: ["epikriserMethod1", "epikriserMethod2"], // Methods to include in translated documents (adjust as needed)
    };
  }

  function applyDocumentStyling() {
    const documents = document.querySelectorAll(".document-content");
    documents.forEach((doc) => {
      doc.style.fontSize = "16px";
      doc.style.lineHeight = "1.5";
      doc.querySelectorAll("h1").forEach((h1) => (h1.style.fontSize = "24px"));
      doc.querySelectorAll("h2").forEach((h2) => (h2.style.fontSize = "20px"));
    });
  }

  return {
    laymanConfig,
    expertConfig,
    applyDocumentStyling,
  };
})();
