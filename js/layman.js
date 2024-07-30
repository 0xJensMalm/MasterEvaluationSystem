(async function () {
  let currentDocumentIndex = 0;
  let documents = [];
  let startTime;
  let shuffledDocuments = [];
  const laymanConfig = config.laymanConfig();

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

  async function fetchLaymanDocuments() {
    try {
      const originalFiles = await fetchDocuments(
        laymanConfig.originalSource + "epikriser.json"
      );
      const translated1Files = await fetchDocuments(
        laymanConfig.translated1Source + "epikriser.json"
      );
      const translated2Files = await fetchDocuments(
        laymanConfig.translated2Source + "epikriser.json"
      );

      const originalDocs = await fetchDocumentContents(
        originalFiles,
        laymanConfig.originalSource
      );
      const translated1Docs = await fetchDocumentContents(
        translated1Files,
        laymanConfig.translated1Source
      );
      const translated2Docs = await fetchDocumentContents(
        translated2Files,
        laymanConfig.translated2Source
      );

      documents = [...originalDocs, ...translated1Docs, ...translated2Docs];
      if (laymanConfig.randomShuffle) {
        shuffledDocuments = utils.shuffleArray(documents);
      } else {
        shuffledDocuments = documents;
      }
      startSurvey();
    } catch (error) {
      displayError("Failed to fetch documents. Please try again later.");
      console.error("Failed to fetch documents:", error);
    }
  }

  function startSurvey() {
    if (currentDocumentIndex < shuffledDocuments.length) {
      const doc = shuffledDocuments[currentDocumentIndex];
      console.log(`Presenting document: ${doc.id}`);
      document.getElementById("document-title").innerText = `Document ${
        currentDocumentIndex + 1
      }`;
      document.getElementById(
        "document-content"
      ).innerHTML = `<div class="document-content">${marked.parse(
        doc.content
      )}</div>`;
      config.applyDocumentStyling();
      startTime = Date.now();
    } else {
      alert("Survey completed. Thank you!");
      console.log("Collected Data:", collectedData);
    }
  }

  function submitLaymanScore() {
    const selectedScore = document.querySelector('input[name="score"]:checked');
    if (!selectedScore) {
      displayError("Please select a score");
      return;
    }

    const score = selectedScore.value;
    const documentID = shuffledDocuments[currentDocumentIndex].id;
    const timeSpent = Date.now() - startTime;

    const dataEntry = {
      userID,
      documentID,
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

  window.submitLaymanScore = submitLaymanScore;

  fetchLaymanDocuments();
})();
