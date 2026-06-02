const BACKEND_URL = "https://syntrix-airdrop.onrender.com";

// Onboarding and Navigation DOM Hook Nodes
const emailGateSection = document.getElementById("emailGateSection");
const emailGateForm = document.getElementById("emailGateForm");
const gateEmailInput = document.getElementById("gateEmail");
const startSurveyBtn = document.getElementById("startSurveyBtn");

// 3-Dots Navigation Floating Menu Controls
const menuToggleBtn = document.getElementById("menuToggleBtn");
const optionsPopover = document.getElementById("optionsPopover");
const menuRestartBtn = document.getElementById("menuRestartBtn");
const menuRecoverBtn = document.getElementById("menuRecoverBtn");

const topProgressBox = document.getElementById("topProgressBox");
const claimForm = document.getElementById("claimForm");
const surveyContainer = document.getElementById("surveyContainer");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitClaimBtn = document.getElementById("submitClaimBtn");

const rewardDashboardScreen = document.getElementById("rewardDashboardScreen");
const dashboardWalletInput = document.getElementById("dashboardWalletInput");
const executeClaimBtn = document.getElementById("executeClaimBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");

const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");

let userEmailAddress = "";
let currentSection = 0;
const answers = {};
let currentLanguage = "en";

// ================= LANGUAGE SELECTION INTERFACE CONTROLS =================
const langButtons = document.querySelectorAll(".langBtn");
langButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    langButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLanguage = btn.dataset.lang;
    
    // Rerender layout content matching translation engine profiles
    if (claimForm.classList.contains("hidden") === false) {
      renderSection();
    } else {
      translateMainHeadings();
    }
  });
});

function getSurveyData() {
  return typeof surveySections !== "undefined" ? surveySections : [];
}

function getUIText(key) {
  const fallbacks = {
    validationRequired: "❌ Please answer all questions before continuing.",
    submitting: "⏳ Storing survey data metrics across secure registers...",
    claiming: "⚡ Dispensing 10 SYNX tokens to target network gateway...",
    checkingLedger: "🔍 Authenticating communication profile ledger status..."
  };
  if (typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return fallbacks[key] || key;
}

function translateMainHeadings() {
  if (typeof translations !== "undefined" && translations[currentLanguage]) {
    const mainTitleEl = document.getElementById("mainTitle");
    const mainSubtitleEl = document.getElementById("mainSubtitle");
    if (mainTitleEl && translations[currentLanguage].mainTitle) mainTitleEl.innerText = translations[currentLanguage].mainTitle;
    if (mainSubtitleEl && translations[currentLanguage].mainSubtitle) mainSubtitleEl.innerText = translations[currentLanguage].mainSubtitle;
  }
}

// ================= DYNAMIC TRANSLATION ENGINE INTERCEPTORS =================
function getSectionTitle(section) {
  if (typeof sectionTranslations !== "undefined" && sectionTranslations[currentLanguage]) {
    return sectionTranslations[currentLanguage][section.title] || section.title;
  }
  return section.title || "";
}

function getQuestionText(q) {
  if (typeof questionTranslations !== "undefined" && questionTranslations[currentLanguage]) {
    return questionTranslations[currentLanguage][q.id] || q.text || q.id;
  }
  return q.text || q.id;
}

// Intercepts and parses option values dynamically out of your dictionaries
function getOptionText(opt) {
  if (typeof optionTranslations !== "undefined" && optionTranslations[currentLanguage]) {
    return optionTranslations[currentLanguage][opt] || opt;
  }
  return opt;
}

// ================= 3-DOTS OPTIONS NAVIGATION CONTROLLER =================
menuToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  optionsPopover.classList.toggle("hidden");
});

// Structural Dismissal: Close overlay popover if clicking anywhere else inside viewport
document.addEventListener("click", () => {
  optionsPopover.classList.add("hidden");
});

menuRestartBtn.addEventListener("click", () => {
  resetApplicationFlowState();
});

menuRecoverBtn.addEventListener("click", async () => {
  resetApplicationFlowState();
  
  // Prompt user to provide input if running checking pipeline from scratch
  const targetEmail = prompt("Enter your registered email address to check pending claim rewards:");
  if (!targetEmail || !targetEmail.trim()) return;
  
  gateEmailInput.value = targetEmail.trim();
  // Call the auto-recovery verification workflow programmatically
  await runProfileLedgerVerification(targetEmail.trim());
});

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  statusDiv.innerHTML = "";
  userEmailAddress = "";
  currentSection = 0;
  
  // Clear local questionnaire answers keys mapping object
  for (const prop in answers) { 
    if (Object.prototype.hasOwnProperty.call(answers, prop)) delete answers[prop]; 
  }
  
  emailGateSection.classList.remove("hidden");
  claimForm.classList.add("hidden");
  topProgressBox.classList.add("hidden");
  rewardDashboardScreen.classList.add("hidden");
  
  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === 0) st.classList.add("active");
    else st.classList.remove("active");
  });
}

// ================= STAGE 1: ENTRY ONBOARDING & AUTO-RECOVERY TRACKING GATE =================
emailGateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailVal = gateEmailInput.value.trim();
  await runProfileLedgerVerification(emailVal);
});

// Centralized Asynchronous Core Routing Logic for Profile Matching
async function runProfileLedgerVerification(emailValue) {
  const sanitizedEmail = emailValue.trim().toLowerCase();
  if (!sanitizedEmail || !sanitizedEmail.includes("@")) {
    statusDiv.innerHTML = "❌ Please input a valid identification email profile address.";
    statusDiv.style.color = "#ff4d4d";
    return;
  }
  
  userEmailAddress = sanitizedEmail;
  statusDiv.innerHTML = getUIText("checkingLedger");
  statusDiv.style.color = "#57d6c2";
  
  try {
    // Intercept: Scan database records on the backend cluster
    const response = await fetch(`${BACKEND_URL}/api/dashboard-auth?email=${encodeURIComponent(userEmailAddress)}`);
    const verification = await response.json();
    
    console.log("Database response payload logs:", verification);

    // DYNAMIC CONDITIONAL AUTO-RECOVERY PIPELINE
    if (verification.exists) {
      
      // Check structural boolean variations from normalized database schemas
      const hasClaimedTokens = verification.isClaimed === true || 
                                verification.status === "claimed" || 
                                (verification.txHash !== undefined && verification.txHash !== null && verification.txHash !== "");

      if (!hasClaimedTokens) {
        // CASE A: Profile has filled survey data but has not claimed their tokens yet
        console.log("Auto-Recovery Route Action: Loading Web3 Claims Screen Layout View.");
        statusDiv.innerHTML = "✨ Unclaimed registration record found. Redirecting to reward distribution section...";
        statusDiv.style.color = "#57d6c2";
        
        // Clear layout section containers instantly
        emailGateSection.classList.add("hidden");
        claimForm.classList.add("hidden");
        topProgressBox.classList.add("hidden");
        
        // Clear status text context right before presenting reward node viewport
        setTimeout(() => { statusDiv.innerHTML = ""; }, 1500);
        
        // Force slide into Web3 reward dashboard display card
        rewardDashboardScreen.classList.remove("hidden");
        
        // Highlight ultimate index on left layout bar element
        document.querySelectorAll(".sidebar .step").forEach(s => s.classList.remove("active"));
        const finalStepNode = document.getElementById("step-7");
        if (finalStepNode) {
          finalStepNode.classList.add("active");
        } else {
          const fallbackStep = document.querySelector(".sidebar .steps .step:last-child");
          if (fallbackStep) fallbackStep.classList.add("active");
        }
        
      } else {
        // CASE B: Target communication signature records an active validation token hash transfer
        statusDiv.innerHTML = "❌ This email profile has already registered and fully claimed their SYNX tokens.";
        statusDiv.style.color = "#ff4d4d";
      }
      
    } else {
      // CASE C: Fresh custom consumer entry sequence
      statusDiv.innerHTML = "";
      emailGateSection.classList.add("hidden");
      claimForm.classList.remove("hidden");
      topProgressBox.classList.remove("hidden");
      
      currentSection = 0;
      renderSection();
    }
    
  } catch (err) {
    console.error("Ledger communication stack tracing error:", err);
    // Graceful Fallback: Drop user safely into fresh survey matrix sequence if cluster times out
    statusDiv.innerHTML = "";
    emailGateSection.classList.add("hidden");
    claimForm.classList.remove("hidden");
    topProgressBox.classList.remove("hidden");
    
    renderSection();
  }
}

// ================= STAGE 2: SURVEY LAYOUT GENERATOR MATRIX =================
function renderSection() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0) return;

  const section = surveyData[currentSection];
  
  // Highlighting matching steps on sidebar tracker panels cleanly
  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === currentSection + 1) st.classList.add("active");
    else st.classList.remove("active");
  });

  translateMainHeadings();

  surveyContainer.innerHTML = `
    <div class="section">
      <h2 class="sectionTitle">${getSectionTitle(section)}</h2>
      ${section.questions.map(q => {
        const translatedQuestionText = getQuestionText(q);

        if (q.type === "textarea") {
          return `
            <div class="question">
              <h3>${translatedQuestionText}</h3>
              <textarea data-id="${q.id}" placeholder="Write your answer...">${answers[q.id] || ""}</textarea>
            </div>
          `;
        }
        if (q.multiple) {
          const selectedValues = answers[q.id] || [];
          return `
            <div class="question">
              <h3>${translatedQuestionText}</h3>
              <div class="options">
                ${(q.options || []).map(opt => `
                  <div class="option ${selectedValues.includes(opt) ? "selected" : ""}" data-question="${q.id}" data-value="${opt}" data-multiple="true">
                    ${getOptionText(opt)}
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        }
        return `
          <div class="question">
            <h3>${translatedQuestionText}</h3>
            <div class="options">
              ${(q.options || []).map(opt => `
                <div class="option ${answers[q.id] === opt ? "selected" : ""}" data-question="${q.id}" data-value="${opt}">
                  ${getOptionText(opt)}
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  updateProgressIndicators();
  attachInputEventListeners();
  configureNavigationActionButtons();
}

function configureNavigationActionButtons() {
  const surveyData = getSurveyData();
  
  // Handle layout visibility variations
  prevBtn.style.display = currentSection === 0 ? "none" : "inline-block";

  if (currentSection === surveyData.length - 1) {
    nextBtn.classList.add("hidden");
    submitClaimBtn.classList.remove("hidden"); // Reveals "Submit Survey & Claim ✨"
  } else {
    nextBtn.classList.remove("hidden");
    submitClaimBtn.classList.add("hidden");
  }
}

function attachInputEventListeners() {
  document.querySelectorAll(".option").forEach(opt => {
    opt.addEventListener("click", () => {
      const qId = opt.dataset.question;
      const val = opt.dataset.value;
      if (opt.dataset.multiple) {
        if (!answers[qId]) answers[qId] = [];
        if (answers[qId].includes(val)) answers[qId] = answers[qId].filter(i => i !== val);
        else answers[qId].push(val);
      } else {
        answers[qId] = val;
      }
      renderSection();
    });
  });

  document.querySelectorAll("textarea").forEach(tx => {
    tx.addEventListener("input", () => { answers[tx.dataset.id] = tx.value; });
  });
}

function updateProgressIndicators() {
  const surveyData = getSurveyData();
  const percentage = ((currentSection + 1) / surveyData.length) * 100;
  progressFill.style.width = percentage + "%";
  progressText.innerText = `Progress ${currentSection + 1}/${surveyData.length}`;
}

function validateSectionInputs() {
  const surveyData = getSurveyData();
  const currentQuestions = surveyData[currentSection].questions;
  let isPass = true;

  currentQuestions.forEach(q => {
    if (q.type === "textarea") {
      if (!answers[q.id] || answers[q.id].trim() === "") isPass = false;
    } else if (q.multiple) {
      if (!answers[q.id] || answers[q.id].length === 0) isPass = false;
    } else {
      if (!answers[q.id]) isPass = false;
    }
  });
  return isPass;
}

nextBtn.addEventListener("click", () => {
  if (!validateSectionInputs()) {
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

// ================= SUBMIT ENTIRE DATA BUNDLE OUT TO PHASE 1 METRICS ENDPOINT =================
claimForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusDiv.innerHTML = getUIText("submitting");
  statusDiv.style.color = "#57d6c2";

  try {
    const response = await fetch(`${BACKEND_URL}/api/claim-airdrop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmailAddress, ...answers })
    });

    const output = await response.json();

    if (output.success) {
      statusDiv.innerHTML = "";
      
      // Advance user instantly into Stage 3 Post-Submission dashboard screen container
      claimForm.classList.add("hidden");
      topProgressBox.classList.add("hidden");
      rewardDashboardScreen.classList.remove("hidden");
      
      document.querySelectorAll(".sidebar .step").forEach(s => s.classList.remove("active"));
      const finalStepNode = document.getElementById("step-7");
      if (finalStepNode) finalStepNode.classList.add("active");
    } else {
      statusDiv.innerHTML = "❌ " + (output.error || "Survey submission integration failure.");
      statusDiv.style.color = "#ff4d4d";
    }
  } catch (err) {
    statusDiv.innerHTML = "❌ Communication channel with Render cluster down.";
    statusDiv.style.color = "#ff4d4d";
  }
});

// ================= STAGE 3: EXECUTE LIVE REWARD MINT/TRANSFER VIA DASHBOARD =================
connectWalletBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const addresses = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (addresses.length > 0) {
        dashboardWalletInput.value = addresses[0];
        statusDiv.innerHTML = "🦊 MetaMask Wallet successfully integrated.";
        statusDiv.style.color = "#57d6c2";
      }
    } catch (walletErr) {
      statusDiv.innerHTML = "⚠️ Wallet hook authorization denied by user connection.";
      statusDiv.style.color = "#ffb347";
    }
  } else {
    statusDiv.innerHTML = "ℹ️ Browser wallet standard injection provider missing. Paste manually.";
    statusDiv.style.color = "#ffb347";
  }
});

executeClaimBtn.addEventListener("click", async () => {
  const targetedWallet = dashboardWalletInput.value.trim();
  
  if (!targetedWallet || targetedWallet.length !== 42 || !targetedWallet.startsWith("0x")) {
    statusDiv.innerHTML = "❌ Please specify a valid EVM public network cryptographic address.";
    statusDiv.style.color = "#ff4d4d";
    return;
  }

  statusDiv.innerHTML = getUIText("claiming");
  statusDiv.style.color = "#57d6c2";

  try {
    const res = await fetch(`${BACKEND_URL}/api/claim-reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmailAddress, walletAddress: targetedWallet })
    });

    const claimResult = await res.json();

    if (claimResult.success) {
      statusDiv.innerHTML = `
        <div class="successBox" style="background: rgba(87, 214, 194, 0.1); border: 1px solid #57d6c2; padding: 25px; border-radius: 12px; margin-top: 20px; text-align: left;">
          <h3 style="color: #57d6c2; margin-top:0;">🚀 Token Distribution Complete!</h3>
          <p style="color:#fff; margin-bottom:10px;">10 SYNX tokens have been pushed directly to your account address.</p>
          <a href="https://polygonscan.com/tx/${claimResult.transactionHash}" target="_blank" style="color: #57d6c2; text-decoration: underline; font-family: monospace; font-size: 13px;">
            Tx Hash: ${claimResult.transactionHash.substring(0, 20)}...
          </a>
        </div>
      `;
    } else {
      statusDiv.innerHTML = "❌ " + (claimResult.error || "Reward asset generation rejected.");
      statusDiv.style.color = "#ff4d4d";
    }
  } catch (err) {
    statusDiv.innerHTML = "❌ Network processing failure executing claim asset parameters.";
    statusDiv.style.color = "#ff4d4d";
  }
});
