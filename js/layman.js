(async function () {
  let currentDocumentIndex = 0;
  let documents = [];
  let startTime;
  let shuffledDocuments = [];
  const laymanConfig = config.laymanConfig();

  // Mock storage for collected data
  let collectedData = [];

  async function fetchLaymanDocuments() {
    try {
      const response = await fetch(laymanConfig.documentSource);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const files = await response.json();
      documents = await fetchDocumentContents(files);
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
    if (currentDocumentIndex < shuffledDocuments.length) {
      const doc = shuffledDocuments[currentDocumentIndex];
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

    // Store data
    const dataEntry = {
      userID,
      documentID,
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

  window.submitLaymanScore = submitLaymanScore; // Make the function globally accessible

  fetchLaymanDocuments();
})();
