const config = (function () {
  function laymanConfig() {
    return {
      randomShuffle: true,
      originalSource: "data/originals/",
      translated1Source: "data/translated1/",
      translated2Source: "data/translated2/",
      documentCount: 10, // Adjust as needed
    };
  }

  function expertConfig() {
    return {
      randomShuffle: true,
      originalSource: "data/originals/",
      translated1Source: "data/translated1/",
      translated2Source: "data/translated2/",
      documentCount: 10, // Adjust as needed
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
