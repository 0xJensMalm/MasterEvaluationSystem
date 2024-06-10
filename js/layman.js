let currentDocumentIndex = 0;
let documents = [];
let startTime;

// Mock storage for collected data
let collectedData = [];

async function fetchLaymanDocuments() {
  const response = await fetch("data/documents.json");
  documents = await response.json();
  startSurvey();
}

function startSurvey() {
  if (currentDocumentIndex < documents.length) {
    const doc = documents[currentDocumentIndex];
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
  const documentID = documents[currentDocumentIndex].id;
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

fetchLaymanDocuments();
