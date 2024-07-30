(async function () {
  let currentDocumentIndex = 0;
  let originalDocuments = [];
  let translatedDocuments = [];
  let startTime;
  let shuffledOriginalDocuments = [];
  let shuffledTranslatedDocuments = [];
  const expertConfig = config.expertConfig();

  let collectedData = [];

  async function fetchDocuments(source) {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const files = await response.json();
      return files; // Just return the file list
    } catch (error) {
      displayError("Failed to fetch document list. Please try again later.");
      console.error("Failed to fetch document list:", error);
    }
  }

  async function fetchDocumentContents(files, source) {
    const documents = [];
    for (const file of files) {
      const response = await fetch(`${source}${file}`);
      if (!response.ok) {
        console.error(`Failed to fetch document: ${file}`);
        continue;
      }
      const content = await response.text();
      documents.push({ id: file, content });
    }
    return documents;
  }

  async function fetchExpertDocuments() {
    try {
      const originalFiles = await fetchDocuments(
        expertConfig.originalSource + "epikriser.json"
      );
      const translated1Files = await fetchDocuments(
        expertConfig.translated1Source + "epikriser.json"
      );
      const translated2Files = await fetchDocuments(
        expertConfig.translated2Source + "epikriser.json"
      );

      const originalDocs = await fetchDocumentContents(
        originalFiles,
        expertConfig.originalSource
      );
      const translated1Docs = await fetchDocumentContents(
        translated1Files,
        expertConfig.translated1Source
      );
      const translated2Docs = await fetchDocumentContents(
        translated2Files,
        expertConfig.translated2Source
      );

      originalDocuments = originalDocs;
      translatedDocuments = [...translated1Docs, ...translated2Docs];
      if (expertConfig.randomShuffle) {
        shuffledOriginalDocuments = utils.shuffleArray(originalDocuments);
        shuffledTranslatedDocuments = utils.shuffleArray(translatedDocuments);
      } else {
        shuffledOriginalDocuments = originalDocuments;
        shuffledTranslatedDocuments = translatedDocuments;
      }
      startSurvey();
    } catch (error) {
      displayError("Failed to fetch documents. Please try again later.");
      console.error("Failed to fetch documents:", error);
    }
  }

  function startSurvey() {
    if (currentDocumentIndex < shuffledOriginalDocuments.length) {
      const originalDoc = shuffledOriginalDocuments[currentDocumentIndex];
      const translatedDoc = shuffledTranslatedDocuments[currentDocumentIndex];

      console.log(`Presenting original document: ${originalDoc.id}`);
      console.log(`Presenting translated document: ${translatedDoc.id}`);

      document.getElementById(
        "original-document-content"
      ).innerHTML = `<div class="document-content">${marked.parse(
        originalDoc.content
      )}</div>`;
      document.getElementById(
        "translated-document-content"
      ).innerHTML = `<div class="document-content">${marked.parse(
        translatedDoc.content
      )}</div>`;
      config.applyDocumentStyling();
      startTime = Date.now();
    } else {
      alert("Survey completed. Thank you!");
      console.log("Collected Data:", collectedData);
    }
  }

  function submitExpertScore() {
    const selectedScore = document.querySelector(
      'input[name="expert-score"]:checked'
    );
    if (!selectedScore) {
      displayError("Please select a score");
      return;
    }

    const score = selectedScore.value;
    const originalDocumentID =
      shuffledOriginalDocuments[currentDocumentIndex].id;
    const translatedDocumentID =
      shuffledTranslatedDocuments[currentDocumentIndex].id;
    const timeSpent = Date.now() - startTime;

    const dataEntry = {
      userID,
      originalDocumentID,
      translatedDocumentID,
      score,
      timeSpent,
    };
    collectedData.push(dataEntry);

    console.log(dataEntry);

    currentDocumentIndex++;
    startSurvey();
  }

  function displayError(message) {
    alert(message);
  }

  window.submitExpertScore = submitExpertScore;

  fetchExpertDocuments();
})();
