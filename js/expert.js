(async function () {
  let currentDocumentIndex = 0;
  let originalDocuments = [];
  let translatedDocuments = [];
  let startTime;
  let shuffledDocuments = [];
  const expertConfig = config.expertConfig();

  // Mock storage for collected data
  let collectedData = [];

  async function fetchExpertDocuments() {
    try {
      const response = await fetch(expertConfig.documentSource);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const files = await response.json();
      const documents = await fetchDocumentContents(files);

      // Split documents into original and translated based on your application's logic
      originalDocuments = documents.slice(0, expertConfig.numberOfDocuments);
      translatedDocuments = documents.slice(
        expertConfig.numberOfDocuments,
        2 * expertConfig.numberOfDocuments
      );

      if (expertConfig.randomShuffle) {
        shuffledDocuments = utils.shuffleArray(translatedDocuments);
      } else {
        shuffledDocuments = translatedDocuments;
      }

      startSurvey();
    } catch (error) {
      displayError("Failed to fetch documents. Please try again later.");
      console.error("Failed to fetch documents:", error);
    }
  }

  async function fetchDocumentContents(files) {
    const documents = [];
    for (const file of files) {
      const response = await fetch(`data/epikriser/${file}`);
      if (!response.ok) {
        console.error(`Failed to fetch document: ${file}`);
        continue;
      }
      const content = await response.text();
      documents.push({ id: file, content });
    }
    return documents;
  }

  function startSurvey() {
    if (currentDocumentIndex < originalDocuments.length) {
      const originalDoc = originalDocuments[currentDocumentIndex];
      const translatedDoc = shuffledDocuments[currentDocumentIndex];

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
    const originalDocumentID = originalDocuments[currentDocumentIndex].id;
    const translatedDocumentID = shuffledDocuments[currentDocumentIndex].id;
    const timeSpent = Date.now() - startTime;

    // Store data
    const dataEntry = {
      userID,
      originalDocumentID,
      translatedDocumentID,
      score,
      timeSpent,
    };
    collectedData.push(dataEntry);

    // Log data to console
    console.log(dataEntry);

    // Move to next document
    currentDocumentIndex++;
    startSurvey();
  }

  function displayError(message) {
    alert(message); // Placeholder for a more sophisticated error display mechanism
  }

  window.submitExpertScore = submitExpertScore; // Make the function globally accessible

  fetchExpertDocuments();
})();
