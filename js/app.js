let userID = null;

function validatePasscode() {
  const passcode = document.getElementById("passcode").value;

  // Validate passcode and determine user type (replace with actual logic)
  if (passcode === "doctor") {
    userID = "expert";
    loadScript("js/expert.js", function () {
      document.getElementById("expert-survey").style.display = "block";
    });
  } else if (passcode === "layman") {
    userID = "layman";
    loadScript("js/layman.js", function () {
      document.getElementById("layman-survey").style.display = "block";
    });
  } else {
    alert("Invalid passcode");
    return;
  }

  document.getElementById("login-container").style.display = "none";
  document.getElementById("survey-container").style.display = "block";
}

function loadScript(url, callback) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.body.appendChild(script);
}
