const API_URL = "https://syntrix-airdrop.onrender.com/api/claim-airdrop";

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

// ================= LANGUAGE HANDLING =================
let currentLanguage = "en";

/**
 * Returns the centralized survey data matrix source of truth.
 * The structure remains English, while rendering layers handle localization.
 */
function getSurveyData() {
  return surveySections;
}

/**
 * Safely extracts translated values from dictionary objects with an English fallback.
 */
function getTranslation(dict, key) {
  if (currentLanguage === "hi" && dict && dict.hi && dict.hi[key]) {
    return dict.hi[key];
  }
  return key; 
}

/**
 * Extracts static operational interface UI strings.
 */
function getUIText(key) {
  if (translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return translations["en"][key];
}

const languageSelect = document.getElementById("languageSelect");
if (languageSelect) {
  languageSelect.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    renderSection();
  });
}

// ================= RENDER SECTION =================
function renderSection() {
  const surveyData = getSurveyData();
  const section = surveyData[currentSection];
  
  // 1. Localize Section Title
  const translatedSectionTitle = getTranslation(sectionTranslations, section.title);

  surveyContainer.innerHTML = `
    <div class="section">
      <h2 class="sectionTitle">
        ${translatedSectionTitle}
      </h2>

      ${section.questions.map(q => {
        // 2. Localize Question Body Text
        const translatedQuestionText = getTranslation(questionTranslations, q.id) || q.text;

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
                ${q.options.map(opt => {
                  // 3. Localize Option Labels
                  const translatedOptionText = getTranslation(optionTranslations, opt);
                  return `
                    <div
                      class="option ${selectedValues.includes(opt) ? "selected" : ""}"
                      data-question="${q.id}"
                      data-value="${opt}"
                      data-multiple="true"
                    >
                      ${translatedOptionText}
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
              ${q.options.map(opt => {
                // 3. Localize Option Labels
                const translatedOptionText = getTranslation(optionTranslations, opt);
                return `
                  <div
                    class="option ${answers[q.id] === opt ? "selected" : ""}"
                    data-question="${q.id}"
                    data-value="${opt}"
                  >
                    ${translatedOptionText}
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

// ================= BUTTON & UI TRANSLATION UPDATE =================
function updateButtons() {
  const surveyData = getSurveyData();

  // Dynamic Button Value Swapping
  nextBtn.innerText = getUIText("next");
  prevBtn.innerText = getUIText("previous");
  
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerText = getUIText("submit");
  }

  // Handle Visibility States
  prevBtn.style.display = currentSection === 0 ? "none" : "inline-block";

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

      // ================= MULTI SELECT =================
      if (multiple) {
        if (!answers[question]) {
          answers[question] = [];
        }

        if (answers[question].includes(value)) {
          answers[question] = answers[question].filter(item => item !== value);
        } else {
          answers[question].push(value);
        }
      } else {
        // ================= SINGLE SELECT =================
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
  const currentQuestions = surveyData[currentSection].questions;
  let valid = true;

  currentQuestions.forEach(q => {
    // ================= TEXTAREA =================
    if (q.type === "textarea") {
      if (!answers[q.id] || answers[q.id].trim() === "") {
        valid = false;
      }
    } else {
      // ================= MULTI =================
      if (q.multiple) {
        if (!answers[q.id] || answers[q.id].length === 0) {
          valid = false;
        }
      } else {
        // ================= SINGLE =================
        if (!answers[q.id]) {
          valid = false;
        }
      }
    }
  });

  return valid;
}

// ================= NEXT =================
nextBtn.addEventListener("click", () => {
  const valid = validateCurrentSection();

  if (!valid) {
    statusDiv.innerHTML = getUIText("validationRequired");
    statusDiv.style.color = "#ff4d4d";
    return;
  }

  statusDiv.innerHTML = "";
  currentSection++;
  renderSection();
});

// ================= PREVIOUS =================
prevBtn.addEventListener("click", () => {
  statusDiv.innerHTML = "";
  currentSection--;
  renderSection();
});

// ================= SUBMIT =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const walletAddress = document.getElementById("walletAddress").value;

  // ================= FINAL VALIDATION =================
  if (!email || !walletAddress) {
    statusDiv.innerHTML = getUIText("fillRequired");
    statusDiv.style.color = "#ff4d4d";
    return;
  }

  // ================= WALLET CHECK =================
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        walletAddress,
        ...answers
      })
    });

    const data = await response.json();

    // ================= SUCCESS =================
    if (data.success) {
      statusDiv.innerHTML = `
        <div class="successBox">
          <h2>✅ Claim Successful</h2>
          <p>Your 10 SYNX reward has been sent successfully.</p>
          <div class="txBox">
            <strong>Transaction Hash:</strong>
            <br><br>
            <span>${data.transactionHash}</span>
          </div>
        </div>
      `;

      form.reset();
      Object.keys(answers).forEach(key => {
        delete answers[key];
      });

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

// ================= START =================
renderSection();