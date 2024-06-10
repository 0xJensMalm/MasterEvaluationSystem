(async function () {
  let currentDocumentIndex = 0;
  let documents = [];
  let startTime;
  let shuffledDocuments = [];
  const config = config.laymanConfig(); // Ensure config is accessed correctly

  // Mock storage for collected data
  let collectedData = [];

  async function fetchLaymanDocuments() {
    try {
      const response = await fetch("data/documents.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      documents = await response.json();
      if (config.randomShuffle) {
        shuffledDocuments = shuffleArray(documents);
      } else {
        shuffledDocuments = documents;
      }
      startSurvey();
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  }

  function startSurvey() {
    if (currentDocumentIndex < shuffledDocuments.length) {
      const doc = shuffledDocuments[currentDocumentIndex];
      document.getElementById("document-title").innerText = `Document ${
        currentDocumentIndex + 1
      }`;
      document.getElementById("document-content").innerText = doc.content;
      startTime = Date.now();
    } else {
      alert("Survey completed. Thank you!");
      console.log("Collected Data:", collectedData);
    }
  }

  function submitLaymanScore() {
    const selectedScore = document.querySelector('input[name="score"]:checked');
    if (!selectedScore) {
      alert("Please select a score");
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

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  fetchLaymanDocuments();
})();
