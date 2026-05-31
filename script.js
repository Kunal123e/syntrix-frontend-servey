const API_URL = "[https://syntrix-airdrop.onrender.com/api/claim-airdrop](https://syntrix-airdrop.onrender.com/api/claim-airdrop)";

const surveyContainer = document.getElementById("surveyContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitSection = document.getElementById("submitSection");
const form = document.getElementById("claimForm");
const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");
const steps = document.querySelectorAll(".step");

let currentSection = 0;
const answers = {};
let currentLanguage = "en";

// ================= CRASH-PROOF TRANSLATION & DATA ENGINE =================

function getSurveyData() {
  if (typeof surveySections !== "undefined") {
    return surveySections;
  }
  console.error("CRITICAL: surveySections is not defined. Check if data.js is loaded correctly.");
  return [];
}

function getSectionTitle(section) {
  if (currentLanguage === "hi" && typeof sectionTranslations !== "undefined" && sectionTranslations.hi && sectionTranslations.hi[section.title]) {
    return sectionTranslations.hi[section.title];
  }
  return section.title || "";
}

function getQuestionText(q) {
  if (currentLanguage === "hi" && typeof questionTranslations !== "undefined" && questionTranslations.hi && questionTranslations.hi[q.id]) {
    return questionTranslations.hi[q.id];
  }
  return q.text || q.id;
}

function getOptionText(opt) {
  if (currentLanguage === "hi" && typeof optionTranslations !== "undefined" && optionTranslations.hi && optionTranslations.hi[opt]) {
    return optionTranslations.hi[opt];
  }
  return opt;
}

function getUIText(key) {
  // Hardcoded absolute fallbacks to prevent rendering freezes if translation.js fails
  const fallbacks = {
    progress: "Progress",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    textareaPlaceholder: "Write your answer...",
    validationRequired: "❌ Please answer all questions before continuing.",
    fillRequired: "❌ Please fill all required fields.",
    invalidWallet: "❌ Invalid wallet address.",
    submitting: "⏳ Submitting survey..."
  };

  if (typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return fallbacks[key] || key;
}

const languageSelect = document.getElementById("languageSelect");
if (languageSelect) {
  languageSelect.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    renderSection();
  });
}

// ================= RENDER CONTROL LAYER =================
function renderSection() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0) {
    surveyContainer.innerHTML = `<p style="color:red; font-weight:bold;">Error: Survey data failed to load. Please check your data.js file.</p>`;
    return;
  }

  const section = surveyData[currentSection];
  const translatedSectionTitle = getSectionTitle(section);

  surveyContainer.innerHTML = `
    <div class="section">
      <h2 class="sectionTitle">${translatedSectionTitle}</h2>

      ${section.questions.map(q => {
        const translatedQuestionText = getQuestionText(q);

        // ================= TEXTAREA =================
        if (q.type === "textarea") {
          return `
            <div class="question">
              <h3>${translatedQuestionText}</h3>
              <textarea
                data-id="${q.id}"
                placeholder="${getUIText("textareaPlaceholder")}"
              >${answers[q.id] || ""}</textarea>
            </div>
          `;
        }

        // ================= MULTI SELECT =================
        if (q.multiple) {
          const selectedValues = answers[q.id] || [];
          return `
            <div class="question">
              <h3>${translatedQuestionText}</h3>
              <div class="options">
                ${(q.options || []).map(opt => {
                  return `
                    <div
                      class="option ${selectedValues.includes(opt) ? "selected" : ""}"
                      data-question="${q.id}"
                      data-value="${opt}"
                      data-multiple="true"
                    >
                      ${getOptionText(opt)}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }

        // ================= SINGLE SELECT =================
        return `
          <div class="question">
            <h3>${translatedQuestionText}</h3>
            <div class="options">
              ${(q.options || []).map(opt => {
                return `
                  <div
                    class="option ${answers[q.id] === opt ? "selected" : ""}"
                    data-question="${q.id}"
                    data-value="${opt}"
                  >
                    ${getOptionText(opt)}
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  updateProgress();
  attachOptionEvents();
  attachTextareaEvents();
  updateButtons();
}

// ================= BUTTONS & UI TRANSLATION INTERFACE =================
function updateButtons() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0) return;

  nextBtn.innerText = getUIText("next");
  prevBtn.innerText = getUIText("previous");
  
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerText = getUIText("submit");
  }

  // Prev Button visibility toggling
  prevBtn.style.display = currentSection === 0 ? "none" : "inline-block";

  // Next Button / Form visibility toggling
  if (currentSection === surveyData.length - 1) {
    nextBtn.style.display = "none";
    submitSection.classList.remove("hidden");
  } else {
    nextBtn.style.display = "inline-block";
    submitSection.classList.add("hidden");
  }
}

// ================= OPTION EVENTS =================
function attachOptionEvents() {
  const options = document.querySelectorAll(".option");
  options.forEach(option => {
    option.addEventListener("click", () => {
      const question = option.dataset.question;
      const value = option.dataset.value;
      const multiple = option.dataset.multiple;

      if (multiple) {
        if (!answers[question]) answers[question] = [];
        if (answers[question].includes(value)) {
          answers[question] = answers[question].filter(item => item !== value);
        } else {
          answers[question].push(value);
        }
      } else {
        answers[question] = value;
      }
      renderSection();
    });
  });
}

// ================= TEXTAREA EVENTS =================
function attachTextareaEvents() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.addEventListener("input", () => {
      answers[textarea.dataset.id] = textarea.value;
    });
  });
}

// ================= PROGRESS =================
function updateProgress() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0) return;

  const percent = ((currentSection + 1) / surveyData.length) * 100;
  progressFill.style.width = percent + "%";
  progressText.innerText = `${getUIText("progress")} ${currentSection + 1}/${surveyData.length}`;

  steps.forEach((step, index) => {
    if (index <= currentSection) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

// ================= VALIDATION =================
function validateCurrentSection() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0) return false;

  const currentQuestions = surveyData[currentSection].questions;
  let valid = true;

  currentQuestions.forEach(q => {
    if (q.type === "textarea") {
      if (!answers[q.id] || answers[q.id].trim() === "") valid = false;
    } else {
      if (q.multiple) {
        if (!answers[q.id] || answers[q.id].length === 0) valid = false;
      } else {
        if (!answers[q.id]) valid = false;
      }
    }
  });

  return valid;
}

// ================= NAVIGATION TRIGGERS =================
nextBtn.addEventListener("click", () => {
  if (!validateCurrentSection()) {
    statusDiv.innerHTML = getUIText("validationRequired");
    statusDiv.style.color = "#ff4d4d";
    return;
  }
  statusDiv.innerHTML = "";
  currentSection++;
  renderSection();
});

prevBtn.addEventListener("click", () => {
  statusDiv.innerHTML = "";
  currentSection--;
  renderSection();
});

// ================= FORM SUBMISSION =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const walletAddress = document.getElementById("walletAddress").value;

  if (!email || !walletAddress) {
    statusDiv.innerHTML = getUIText("fillRequired");
    statusDiv.style.color = "#ff4d4d";
    return;
  }

  if (!walletAddress.startsWith("0x") || walletAddress.length !== 42) {
    statusDiv.innerHTML = getUIText("invalidWallet");
    statusDiv.style.color = "#ff4d4d";
    return;
  }

  statusDiv.innerHTML = getUIText("submitting");
  statusDiv.style.color = "#57d6c2";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, walletAddress, ...answers })
    });

    const data = await response.json();

    if (data.success) {
      statusDiv.innerHTML = `
        <div class="successBox">
          <h2>✅ Claim Successful</h2>
          <p>Your 10 SYNX reward has been sent successfully.</p>
          <div class="txBox">
            <strong>Transaction Hash:</strong><br><br>
            <span>${data.transactionHash}</span>
          </div>
        </div>
      `;
      form.reset();
      Object.keys(answers).forEach(key => delete answers[key]);
      currentSection = 0;
      renderSection();
    } else {
      statusDiv.innerHTML = "❌ " + (data.error || "Something went wrong");
      statusDiv.style.color = "#ff4d4d";
    }
  } catch (err) {
    console.error(err);
    statusDiv.innerHTML = "❌ Server Error";
    statusDiv.style.color = "#ff4d4d";
  }
});

// ================= START INITIALIZATION =================
renderSection();
