let currentDocumentIndex = 0;
let originalDocuments = [];
let translatedDocuments = [];
let startTime;

// Mock storage for collected data
let collectedData = [];

async function fetchExpertDocuments() {
  const response = await fetch("data/expert_documents.json");
  const data = await response.json();
  originalDocuments = data.originalEpikriser;
  translatedDocuments = [...data.epikriserMethod1, ...data.epikriserMethod2];
  shuffleArray(translatedDocuments); // Shuffle to randomize selection
  startSurvey();
}

function startSurvey() {
  if (currentDocumentIndex < originalDocuments.length) {
    const originalDoc = originalDocuments[currentDocumentIndex];
    const translatedDoc = translatedDocuments[currentDocumentIndex];

    document.getElementById("original-document-content").innerText =
      originalDoc.content;
    document.getElementById("translated-document-content").innerText =
      translatedDoc.content;
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
    alert("Please select a score");
    return;
  }

  const score = selectedScore.value;
  const originalDocumentID = originalDocuments[currentDocumentIndex].id;
  const translatedDocumentID = translatedDocuments[currentDocumentIndex].id;
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

fetchExpertDocuments();