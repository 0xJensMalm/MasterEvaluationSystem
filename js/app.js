let userID = null;

function validatePasscode() {
  const passcode = document.getElementById("passcode").value;

  // Validate passcode and determine user type (replace with actual logic)
  if (passcode === "doctor") {
    userID = "expert";
    document.getElementById("expert-script").src = "js/expert.js";
    document.getElementById("expert-script").style.display = "block";
    document.getElementById("expert-survey").style.display = "block";
  } else if (passcode === "layman") {
    userID = "layman";
    document.getElementById("layman-script").src = "js/layman.js";
    document.getElementById("layman-script").style.display = "block";
    document.getElementById("layman-survey").style.display = "block";
  } else {
    alert("Invalid passcode");
    return;
  }

  document.getElementById("login-container").style.display = "none";
  document.getElementById("survey-container").style.display = "block";
}
