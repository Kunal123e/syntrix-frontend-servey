const BACKEND_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:5000"
  : "https://syntrix-airdrop.onrender.com";

// Constants for Strict Validations
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_TIMEOUT_MS = 10000; // 10 seconds network abort rule

// Helper to normalize user input or URL referral codes to SYN-XXXXXX format
function normalizeReferralCode(code) {
  if (!code) return "";
  let clean = code.trim().toUpperCase();
  clean = clean.replace(/\s+/g, "");
  
  if (!clean.startsWith("SYN-")) {
    if (clean.startsWith("SYN")) {
      clean = "SYN-" + clean.substring(3);
    } else {
      clean = "SYN-" + clean;
    }
  }
  return clean;
}

// Global Custom Timeout Fetch Wrapper Engine
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = DEFAULT_TIMEOUT_MS } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Onboarding and Navigation DOM Hook Nodes
const emailGateSection = document.getElementById("emailGateSection");
const emailGateForm = document.getElementById("emailGateForm");
const gateEmailInput = document.getElementById("gateEmail");
const startSurveyBtn = document.getElementById("startSurveyBtn");
const referredByCodeInput = document.getElementById("referredByCode"); 

// 3-Dots Navigation Floating Menu Controls
const menuToggleBtn = document.getElementById("menuToggleBtn");
const optionsPopover = document.getElementById("optionsPopover");
const menuRestartBtn = document.getElementById("menuRestartBtn");
const menuRecoverBtn = document.getElementById("menuRecoverBtn");

// Custom Modal Overlay DOM Interface Elements
const retrieveModal = document.getElementById("retrieveModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const confirmRetrieveBtn = document.getElementById("confirmRetrieveBtn");
const modalEmailInput = document.getElementById("modalEmailInput");
const modalStatus = document.getElementById("modalStatus");

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

// Integrated Reward Claims Section
const claimScreenSection = document.getElementById("claimScreenSection");
const claimLoadingGear = document.getElementById("claimLoadingGear");
const claimStaticIcon = document.getElementById("claimStaticIcon");
const claimScreenTitle = document.getElementById("claimScreenTitle");
const claimInfoSubtitle = document.getElementById("claimInfoSubtitle");
const claimErrorBox = document.getElementById("claimErrorBox");
const claimRewardDetails = document.getElementById("claimRewardDetails");
const claimActionPanel = document.getElementById("claimActionPanel");
const claimConnectWalletBtn = document.getElementById("claimConnectWalletBtn");
const claimWalletConnectedBlock = document.getElementById("claimWalletConnectedBlock");
const claimWalletAddressDisplay = document.getElementById("claimWalletAddressDisplay");
const submitClaimRewardBtn = document.getElementById("submitClaimRewardBtn");
const claimTxHashLink = document.getElementById("claimTxHashLink");
const claimSuccessPanel = document.getElementById("claimSuccessPanel");

// Statistics DOM nodes
const statTotalReferrals = document.getElementById("statTotalReferrals");
const statPendingRewards = document.getElementById("statPendingRewards");
const statClaimedRewards = document.getElementById("statClaimedRewards");
const statTotalEarned = document.getElementById("statTotalEarned");
const referralCodeDisplay = document.getElementById("referralCodeDisplay");
const copyReferralBtn = document.getElementById("copyReferralBtn");

const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");

let userEmailAddress = "";
let currentSection = 0;
const answers = {};
let currentLanguage = "en";

// ================= ROUTING SWITCHBOARD & SESSION ON-LOAD =================
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const claimToken = urlParams.get("token");
  const refParam = urlParams.get("ref");
  
  if (refParam) {
    localStorage.setItem("referralCode", normalizeReferralCode(refParam));
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  const savedRefCode = localStorage.getItem("referralCode");
  if (savedRefCode && referredByCodeInput) {
    referredByCodeInput.value = savedRefCode;
  }
  
  const isClaimPath = window.location.pathname.includes("/claim") || claimToken;
  
  if (isClaimPath && claimToken) {
    if (emailGateSection) emailGateSection.classList.add("hidden");
    if (claimForm) claimForm.classList.add("hidden");
    if (rewardDashboardScreen) rewardDashboardScreen.classList.add("hidden");
    if (claimScreenSection) claimScreenSection.classList.remove("hidden");
    
    document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
    
    initializeClaimSection(claimToken);
  } else {
    if (claimScreenSection) claimScreenSection.classList.add("hidden");
    
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      await runProfileLedgerVerification(savedEmail, false);
    }
  }
});

// ================= LANGUAGE SELECTION INTERFACE CONTROLS =================
const langButtons = document.querySelectorAll(".langBtn");
langButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    langButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLanguage = btn.dataset.lang;
    
    translatePage();
    
    if (claimForm && !claimForm.classList.contains("hidden")) {
      renderSection();
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
    claiming: "⚡ Dispensing tokens to target network gateway...",
    checkingLedger: "🔍 Authenticating communication profile ledger status..."
  };
  if (typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return fallbacks[key] || key;
}

function translatePage() {
  if (typeof translations === "undefined" || !translations[currentLanguage]) return;
  const dict = translations[currentLanguage];

  const mainTitleEl = document.getElementById("mainTitle");
  const mainSubtitleEl = document.getElementById("mainSubtitle");
  if (mainTitleEl && (dict.mainTitle || dict.title)) mainTitleEl.innerText = dict.mainTitle || dict.title;
  if (mainSubtitleEl && (dict.mainSubtitle || dict.surveySubtitle)) mainSubtitleEl.innerText = dict.mainSubtitle || dict.surveySubtitle;

  const emailSectionTitleEl = document.querySelector("#emailGateSection .sectionTitle");
  if (emailSectionTitleEl && dict.emailSectionTitle) emailSectionTitleEl.innerText = dict.emailSectionTitle;
  
  const startSurveyBtnEl = document.getElementById("startSurveyBtn");
  if (startSurveyBtnEl && dict.btnStart) startSurveyBtnEl.innerHTML = dict.btnStart;

  const prevBtnEl = document.getElementById("prevBtn");
  const nextBtnEl = document.getElementById("nextBtn");
  const submitClaimBtnEl = document.getElementById("submitClaimBtn");
  if (prevBtnEl && (dict.previous || dict.btnPrev)) prevBtnEl.innerHTML = `&lt; ${dict.previous || dict.btnPrev}`;
  if (nextBtnEl && (dict.next || dict.btnNext)) nextBtnEl.innerHTML = `${dict.next || dict.btnNext} &gt;`;
  if (submitClaimBtnEl && (dict.submit || dict.btnSubmit)) submitClaimBtnEl.innerHTML = dict.submit || dict.btnSubmit;

  const rewardTitleEl = document.querySelector("#rewardDashboardScreen .rewardTitle");
  if (rewardTitleEl && dict.claimTitle) rewardTitleEl.innerText = dict.claimTitle;
  
  const connectWalletBtnEl = document.querySelector("#connectWalletBtn span");
  if (connectWalletBtnEl && dict.metaMaskLabel) connectWalletBtnEl.innerText = dict.metaMaskLabel;
  
  const manualLabelEl = document.querySelector(".manualWalletWrapper .dividerLine span");
  if (manualLabelEl && dict.manualLabel) manualLabelEl.innerText = dict.manualLabel;
  
  const executeClaimBtnEl = document.getElementById("executeClaimBtn");
  if (executeClaimBtnEl && dict.btnExecute) executeClaimBtnEl.innerText = dict.btnExecute;
  
  const referralTitleEl = document.querySelector(".referralContainer .dividerLine span");
  if (referralTitleEl && dict.referralTitle) referralTitleEl.innerText = dict.referralTitle;
  
  const referralDescriptionEl = document.querySelector(".referralContainer .referralDescription");
  if (referralDescriptionEl && dict.referralSub) referralDescriptionEl.innerText = dict.referralSub;
  
  const copyReferralBtnEl = document.getElementById("copyReferralBtn");
  if (copyReferralBtnEl && dict.btnCopy) copyReferralBtnEl.innerText = dict.btnCopy;

  const modalTitleEl = document.querySelector("#retrieveModal .modal-header h2");
  if (modalTitleEl && dict.modalTitle) modalTitleEl.innerText = dict.modalTitle;
  
  const modalSubEl = document.querySelector("#retrieveModal .modal-subtitle");
  if (modalSubEl && dict.modalSub) modalSubEl.innerText = dict.modalSub;
  
  const modalDetailsTitleEl = document.querySelector("#retrieveModal .extra-details-box h4");
  if (modalDetailsTitleEl && dict.modalDetailsTitle) modalDetailsTitleEl.innerText = dict.modalDetailsTitle;
  
  const modalDetails1El = document.querySelector("#retrieveModal .extra-details-box li:nth-child(1)");
  if (modalDetails1El && dict.modalDetails1) modalDetails1El.innerText = dict.modalDetails1;
  
  const modalDetails2El = document.querySelector("#retrieveModal .extra-details-box li:nth-child(2)");
  if (modalDetails2El && dict.modalDetails2) modalDetails2El.innerText = dict.modalDetails2;
  
  const modalDetails3El = document.querySelector("#retrieveModal .extra-details-box li:nth-child(3)");
  if (modalDetails3El && dict.modalDetails3) modalDetails3El.innerText = dict.modalDetails3;
  
  const modalInputLabelEl = document.querySelector("#retrieveModal .input-wrapper label");
  if (modalInputLabelEl && dict.modalInputLabel) modalInputLabelEl.innerText = dict.modalInputLabel;
  
  const cancelModalBtnEl = document.getElementById("cancelModalBtn");
  if (cancelModalBtnEl && dict.btnCancel) cancelModalBtnEl.innerText = dict.btnCancel;
  
  const confirmRetrieveBtnEl = document.getElementById("confirmRetrieveBtn");
  if (confirmRetrieveBtnEl && dict.btnSearch) confirmRetrieveBtnEl.innerText = dict.btnSearch;
}

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

function getOptionText(opt) {
  if (typeof optionTranslations !== "undefined" && optionTranslations[currentLanguage]) {
    return optionTranslations[currentLanguage][opt] || opt;
  }
  return opt;
}

// ================= 3-DOTS OPTIONS NAVIGATION CONTROLLER =================
if (menuToggleBtn && optionsPopover) {
  menuToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    optionsPopover.classList.toggle("hidden");
  });
}

document.addEventListener("click", () => {
  if (optionsPopover) optionsPopover.classList.add("hidden");
});

if (menuRestartBtn) {
  menuRestartBtn.addEventListener("click", () => {
    resetApplicationFlowState();
  });
}

if (menuRecoverBtn && optionsPopover && retrieveModal && modalEmailInput && modalStatus) {
  menuRecoverBtn.addEventListener("click", () => {
    optionsPopover.classList.add("hidden");
    modalEmailInput.value = "";
    modalStatus.innerHTML = "";
    retrieveModal.classList.remove("hidden");
    setTimeout(() => { modalEmailInput.focus(); }, 100);
  });
}

const dismissModal = () => { if (retrieveModal) retrieveModal.classList.add("hidden"); };
if (closeModalBtn) closeModalBtn.addEventListener("click", dismissModal);
if (cancelModalBtn) cancelModalBtn.addEventListener("click", dismissModal);
if (retrieveModal) {
  retrieveModal.addEventListener("click", (e) => {
    if (e.target === retrieveModal) dismissModal();
  });
}

if (confirmRetrieveBtn) {
  confirmRetrieveBtn.addEventListener("click", async () => {
    if (modalEmailInput) {
      const targetEmail = modalEmailInput.value.trim();
      await runProfileLedgerVerification(targetEmail, true);
    }
  });
}

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email");
  localStorage.removeItem("referralCode");
  if (statusDiv) statusDiv.innerHTML = "";
  userEmailAddress = "";
  currentSection = 0;
  isOtpSent = false;
  
  const otpSection = document.getElementById("otpSection");
  if (otpSection) otpSection.classList.add("hidden");
  if (startSurveyBtn) startSurveyBtn.innerHTML = "Initialize Research Modules &rarr;";
  if (gateEmailInput) gateEmailInput.readOnly = false;
  
  for (const prop in answers) { 
    if (Object.prototype.hasOwnProperty.call(answers, prop)) delete answers[prop]; 
  }
  
  if (emailGateSection) emailGateSection.classList.remove("hidden");
  if (claimForm) claimForm.classList.add("hidden");
  if (topProgressBox) topProgressBox.classList.add("hidden");
  if (rewardDashboardScreen) rewardDashboardScreen.classList.add("hidden");
  if (claimScreenSection) claimScreenSection.classList.add("hidden");
  
  document.querySelectorAll(".step").forEach((st, idx) => {
    if (idx === 0) st.classList.add("active");
    else st.classList.remove("active");
  });
}

// ================= STAGE 1: ENTRY ONBOARDING & AUTO-RECOVERY TRACKING GATE (WITH OTP) =================
let isOtpSent = false;

if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!gateEmailInput) return;
    
    const emailVal = gateEmailInput.value.trim().toLowerCase();
    
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Please input a valid email address.";
        statusDiv.style.color = "#ff4d4d";
      }
      return;
    }

    // STATE 1: SEND THE OTP CODE
    if (!isOtpSent) {
      if (statusDiv) {
        statusDiv.innerHTML = "⏳ Sending verification code...";
        statusDiv.style.color = "#57d6c2";
      }
      
      try {
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal })
        });
        
        const result = await response.json();
        if (result.success) {
          isOtpSent = true;
          const otpSection = document.getElementById("otpSection");
          if (otpSection) otpSection.classList.remove("hidden");
          if (startSurveyBtn) startSurveyBtn.innerHTML = "Verify & Enter &rarr;";
          gateEmailInput.readOnly = true; 
          if (statusDiv) statusDiv.innerHTML = "";
        } else {
          if (statusDiv) {
            statusDiv.innerHTML = "❌ " + (result.error || "Failed to send code.");
            statusDiv.style.color = "#ff4d4d";
          }
        }
      } catch (err) {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ Network error. Could not send code.";
          statusDiv.style.color = "#ff4d4d";
        }
      }
      return;
    }

    // STATE 2: VERIFY THE OTP & ACCESS LEDGER SWITCHBOARD
    if (isOtpSent) {
      const gateOtpEl = document.getElementById("gateOtp");
      const otpInput = gateOtpEl ? gateOtpEl.value.trim() : "";
      
      if (!otpInput || otpInput.length !== 6) {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ Please enter the 6-digit code.";
          statusDiv.style.color = "#ff4d4d";
        }
        return;
      }

      if (statusDiv) {
        statusDiv.innerHTML = "🔍 Verifying code...";
        statusDiv.style.color = "#57d6c2";
      }

      try {
        const otpRes = await fetchWithTimeout(`${BACKEND_URL}/api/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal, otp: otpInput })
        });
        
        const otpResult = await otpRes.json();
        
        if (otpResult.success) {
          await runProfileLedgerVerification(emailVal, false);
        } else {
          if (statusDiv) {
            statusDiv.innerHTML = "❌ " + (otpResult.error || "Invalid code.");
            statusDiv.style.color = "#ff4d4d";
          }
        }
      } catch (err) {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ Verification failed due to network error.";
          statusDiv.style.color = "#ff4d4d";
        }
      }
    }
  });
}

async function runProfileLedgerVerification(emailValue, isFromModal = false) {
  const sanitizedEmail = emailValue.trim().toLowerCase();
  const currentStatusOutput = isFromModal ? modalStatus : statusDiv;
  
  if (!sanitizedEmail || !EMAIL_REGEX.test(sanitizedEmail)) {
    if (currentStatusOutput) {
      currentStatusOutput.innerHTML = "❌ Please input a valid identification email profile address.";
      currentStatusOutput.style.color = "#ff4d4d";
    }
    return;
  }
  
  userEmailAddress = sanitizedEmail;
  if (currentStatusOutput) {
    currentStatusOutput.innerHTML = getUIText("checkingLedger");
    currentStatusOutput.style.color = "#57d6c2";
  }
  
  try {
    const rawRefCode = referredByCodeInput ? referredByCodeInput.value.trim() : "";
    const refCodeVal = normalizeReferralCode(rawRefCode);
    
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/dashboard-auth?email=${encodeURIComponent(userEmailAddress)}&ref=${encodeURIComponent(refCodeVal)}`);
    const verification = await response.json();
    
    if (!response.ok) {
      if (currentStatusOutput) {
        currentStatusOutput.innerHTML = "❌ " + (verification.error || "Verification failed.");
        currentStatusOutput.style.color = "#ff4d4d";
      }
      return;
    }

    if (verification.status === "FLOW_A" || verification.status === "FLOW_B") {
      const hasClaimedTokens = (verification.status === "FLOW_B");

      if (!hasClaimedTokens) {
        if (currentStatusOutput) {
          currentStatusOutput.innerHTML = "✨ Record isolated! Loading Web3 dashboard gateway...";
          currentStatusOutput.style.color = "#57d6c2";
        }
        
        localStorage.setItem("syntrix_user_email", userEmailAddress);
        
        setTimeout(async () => {
          if (emailGateSection) emailGateSection.classList.add("hidden");
          if (claimForm) claimForm.classList.add("hidden");
          if (topProgressBox) topProgressBox.classList.add("hidden");
          if (isFromModal && retrieveModal) retrieveModal.classList.add("hidden");
          if (statusDiv) statusDiv.innerHTML = "";
          if (rewardDashboardScreen) rewardDashboardScreen.classList.remove("hidden");
          
          document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
          const finalStepNode = document.getElementById("step-7");
          if (finalStepNode) {
            finalStepNode.classList.add("active");
          } else {
            const fallbackStep = document.querySelector(".sidebar .steps .step:last-child") || document.querySelector(".step:last-child");
            if (fallbackStep) fallbackStep.classList.add("active");
          }
          
          await loadReferralDashboard(userEmailAddress);
        }, 1000);
        
      } else {
        if (currentStatusOutput) {
          currentStatusOutput.innerHTML = "❌ This email profile has already fully claimed their SYNX tokens.";
          currentStatusOutput.style.color = "#ff4d4d";
        }
      }
      
    } else {
      if (isFromModal) {
        if (currentStatusOutput) {
          currentStatusOutput.innerHTML = "❌ Pending claim record not found.";
          currentStatusOutput.style.color = "#ff4d4d";
        }
      } else {
        if (statusDiv) statusDiv.innerHTML = "";
        if (emailGateSection) emailGateSection.classList.add("hidden");
        if (claimForm) claimForm.classList.remove("hidden");
        if (topProgressBox) topProgressBox.classList.remove("hidden");
        
        currentSection = 0;
        renderSection();
      }
    }
    
  } catch (err) {
    console.error("Ledger communication stack tracing error:", err);
    if (currentStatusOutput) {
      currentStatusOutput.innerHTML = "❌ Connection timeout or cluster failure. Please try again.";
      currentStatusOutput.style.color = "#ff4d4d";
    }
  }
}

// ================= STAGE 2: SURVEY LAYOUT GENERATOR MATRIX =================
function renderSection() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0 || !surveyContainer) return;

  const section = surveyData[currentSection];
  
  document.querySelectorAll(".step").forEach((st, idx) => {
    if (idx === currentSection + 1) st.classList.add("active");
    else st.classList.remove("active");
  });

  translatePage();

  surveyContainer.innerHTML = `
    <div class="section">
      <h2 class="sectionTitle">${getSectionTitle(section)}</h2>
      ${section.questions.map(q => {
        const translatedQuestionText = getQuestionText(q);

        if (q.type === "textarea") {
          return `
            <div class="question">
              <h3>${translatedQuestionText}</h3>
              <textarea data-id="${q.id}" placeholder="${getUIText('textareaPlaceholder')}">${answers[q.id] || ""}</textarea>
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
  
  if (prevBtn) prevBtn.style.display = currentSection === 0 ? "none" : "inline-block";

  if (currentSection === surveyData.length - 1) {
    if (nextBtn) nextBtn.classList.add("hidden");
    if (submitClaimBtn) submitClaimBtn.classList.remove("hidden");
  } else {
    if (nextBtn) nextBtn.classList.remove("hidden");
    if (submitClaimBtn) submitClaimBtn.classList.add("hidden");
  }
}

function attachInputEventListeners() {
  document.querySelectorAll(".option").forEach(opt => {
    opt.onclick = () => { 
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
    };
  });

  document.querySelectorAll("textarea").forEach(tx => {
    tx.oninput = () => { answers[tx.dataset.id] = tx.value; };
  });
}

function updateProgressIndicators() {
  const surveyData = getSurveyData();
  const percentage = ((currentSection + 1) / surveyData.length) * 100;
  if (progressFill) progressFill.style.width = percentage + "%";
  if (progressText) progressText.innerText = `${getUIText('progress')} ${currentSection + 1}/${surveyData.length}`;
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

if (nextBtn) {
  nextBtn.onclick = () => {
    if (!validateSectionInputs()) {
      if (statusDiv) {
        statusDiv.innerHTML = getUIText("validationRequired");
        statusDiv.style.color = "#ff4d4d";
      }
      return;
    }
    if (statusDiv) statusDiv.innerHTML = "";
    currentSection++;
    renderSection();
  };
}

if (prevBtn) {
  prevBtn.onclick = () => {
    if (statusDiv) statusDiv.innerHTML = "";
    currentSection--;
    renderSection();
  };
}

// ================= SUBMIT ENTIRE DATA BUNDLE OUT TO PHASE 1 METRICS ENDPOINT =================
if (claimForm) {
  claimForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // UI DOUBLE-SUBMIT LOCK
    if (submitClaimBtn) submitClaimBtn.disabled = true;

    if (statusDiv) {
      statusDiv.innerHTML = getUIText("submitting");
      statusDiv.style.color = "#57d6c2";
    }
    
    const rawRefCode = referredByCodeInput ? referredByCodeInput.value.trim() : "";
    const refCodeVal = normalizeReferralCode(rawRefCode);

    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/claim-airdrop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: userEmailAddress, 
          referredByCode: refCodeVal, 
          answers: answers 
        })
      });

      const output = await response.json();

      if (output.success) {
        if (statusDiv) statusDiv.innerHTML = "";
        
        localStorage.setItem("syntrix_user_email", userEmailAddress);
        localStorage.removeItem("referralCode");
        
        if (claimForm) claimForm.classList.add("hidden");
        if (topProgressBox) topProgressBox.classList.add("hidden");
        if (rewardDashboardScreen) rewardDashboardScreen.classList.remove("hidden");
        
        document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
        const finalStepNode = document.getElementById("step-7");
        if (finalStepNode) finalStepNode.classList.add("active");
        
        // Save the sequence authorization token for future claims
        if (output.claimSequenceToken) {
          localStorage.setItem("syntrix_claim_token", output.claimSequenceToken);
        }
        
        await loadReferralDashboard(userEmailAddress);
      } else {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ " + (output.error || "Survey submission integration failure.");
          statusDiv.style.color = "#ff4d4d";
        }
        if (submitClaimBtn) submitClaimBtn.disabled = false;
      }
    } catch (err) {
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Communication channel with server timed out.";
        statusDiv.style.color = "#ff4d4d";
      }
      if (submitClaimBtn) submitClaimBtn.disabled = false;
    }
  });
}

// ================= STAGE 3: EXECUTE LIVE REWARD MINT/TRANSFER VIA DASHBOARD =================
if (connectWalletBtn) {
  connectWalletBtn.onclick = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const addresses = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (addresses.length > 0 && dashboardWalletInput) {
          dashboardWalletInput.value = addresses[0];
          if (statusDiv) {
            statusDiv.innerHTML = "🦊 MetaMask Wallet successfully integrated.";
            statusDiv.style.color = "#57d6c2";
          }
        }
      } catch (walletErr) {
        if (statusDiv) {
          statusDiv.innerHTML = "⚠️ Wallet hook authorization denied by user connection.";
          statusDiv.style.color = "#ffb347";
        }
      }
    } else {
      if (statusDiv) {
        statusDiv.innerHTML = "ℹ️ Browser wallet standard injection provider missing. Paste manually.";
        statusDiv.style.color = "#ffb347";
      }
    }
  };
}

if (executeClaimBtn) {
  executeClaimBtn.onclick = async () => {
    if (!dashboardWalletInput) return;
    const targetedWallet = dashboardWalletInput.value.trim();
    
    // CRITICAL FIX: Upgraded wallet validation matching strict checksum regex
    if (!targetedWallet || !WALLET_REGEX.test(targetedWallet)) {
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Please specify a valid EVM public network cryptographic address (0x...).";
        statusDiv.style.color = "#ff4d4d";
      }
      return;
    }

    // UI BUTTON DE-ACTIVATION LOCK
    executeClaimBtn.disabled = true;

    if (statusDiv) {
      statusDiv.innerHTML = getUIText("claiming");
      statusDiv.style.color = "#57d6c2";
    }

    try {
      const activeClaimToken = localStorage.getItem("syntrix_claim_token") || "";
      
      // Zero-Zero Routing Core Payload
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/rewards/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: activeClaimToken, 
          walletAddress: targetedWallet 
        })
      });

      const claimResult = await res.json();

      if (claimResult.success) {
        if (statusDiv) {
          statusDiv.innerHTML = `
            <div class="successBox" style="background: rgba(87, 214, 194, 0.1); border: 1px solid #57d6c2; padding: 25px; border-radius: 12px; margin-top: 20px; text-align: left;">
              <h3 style="color: #57d6c2; margin-top:0;">🚀 Token Distribution Complete!</h3>
              <p style="color:#fff; margin-bottom:10px;">Your allocations have been successfully pushed on-chain.</p>
              <a href="https://polygonscan.com/tx/${claimResult.transactionHash}" target="_blank" style="color: #57d6c2; text-decoration: underline; font-family: monospace; font-size: 13px;">
                Tx Hash: ${claimResult.transactionHash.substring(0, 20)}...
              </a>
            </div>
          `;
        }
        await loadReferralDashboard(userEmailAddress);
      } else {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ " + (claimResult.error || "Reward asset generation rejected.");
          statusDiv.style.color = "#ff4d4d";
        }
        executeClaimBtn.disabled = false;
      }
    } catch (err) {
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Network processing timeout executing claim parameters.";
        statusDiv.style.color = "#ff4d4d";
      }
      executeClaimBtn.disabled = false;
    }
  };
}

// ================= REFERRAL DASHBOARD STATS RETRIEVAL (PHASE 7) =================
async function loadReferralDashboard(email) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/referral/dashboard?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (res.ok && data.totalReferrals !== undefined) {
      if (statTotalReferrals) statTotalReferrals.textContent = data.totalReferrals;
      if (statPendingRewards) statPendingRewards.textContent = `${data.pendingRewards} SYN`;
      if (statClaimedRewards) statClaimedRewards.textContent = `${data.claimedRewards} SYN`;
      if (statTotalEarned) statTotalEarned.textContent = `${data.totalEarned} SYN`;
      
      const currentUrl = window.location.origin;
      if (referralCodeDisplay) {
        referralCodeDisplay.value = `${currentUrl}/?ref=${data.referralCode}`;
      }
    }
  } catch (err) {
    console.error("Dashboard loading error:", err);
  }
}

// Copy Referral Link click trigger
if (copyReferralBtn) {
  copyReferralBtn.onclick = () => {
    if (referralCodeDisplay) {
      referralCodeDisplay.select();
      navigator.clipboard.writeText(referralCodeDisplay.value)
        .then(() => {
          copyReferralBtn.textContent = "Copied!";
          setTimeout(() => {
            copyReferralBtn.textContent = "Copy Link";
          }, 2000);
        })
        .catch(err => {
          console.error("Clipboard system failure:", err);
        });
    }
  };
}

// ================= REWARD CLAIMING SPA ROUTE WORKFLOW (PHASE 9 & 11) =================
function initializeClaimSection(token) {
  let claimWallet = "";

  fetchWithTimeout(`${BACKEND_URL}/api/rewards/claim-info?token=${encodeURIComponent(token)}`)
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification parameter token check invalid.");
      
      if (data.status !== "pending") {
        throw new Error(`This reward allocation is already marked as ${data.status.toUpperCase()}.`);
      }
      
      const infoEmail = document.getElementById("claimInfoEmail");
      const infoType = document.getElementById("claimInfoType");
      const infoAmount = document.getElementById("claimInfoAmount");
      
      if (infoEmail) infoEmail.textContent = data.email;
      if (infoType) infoType.textContent = data.rewardType;
      if (infoAmount) infoAmount.textContent = `${data.amount} SYN`;
      
      if (claimLoadingGear) claimLoadingGear.classList.add("hidden");
      if (claimStaticIcon) claimStaticIcon.classList.remove("hidden");
      if (claimScreenTitle) claimScreenTitle.textContent = "Claim Your Earned Reward";
      if (claimInfoSubtitle) claimInfoSubtitle.textContent = "Verify details and connect MetaMask to execute claim.";
      
      if (claimRewardDetails) claimRewardDetails.classList.remove("hidden");
      if (claimActionPanel) claimActionPanel.classList.remove("hidden");
    })
    .catch(err => {
      if (claimLoadingGear) claimLoadingGear.classList.add("hidden");
      if (claimErrorBox) claimErrorBox.classList.remove("hidden");
      if (claimScreenTitle) claimScreenTitle.textContent = "Claim Attempt Blocked";
      if (claimInfoSubtitle) {
        claimInfoSubtitle.textContent = err.message;
        claimInfoSubtitle.style.color = "#ff4d4d";
      }
    });

  // MetaMask Pairing
  if (claimConnectWalletBtn) {
    claimConnectWalletBtn.onclick = async () => {
      if (typeof window.ethereum === "undefined") {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ MetaMask wallet browser extension not detected.";
          statusDiv.style.color = "#ff4d4d";
        }
        return;
      }
      
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        claimWallet = accounts[0];
        
        if (claimWalletAddressDisplay) claimWalletAddressDisplay.textContent = claimWallet;
        if (claimConnectWalletBtn) claimConnectWalletBtn.classList.add("hidden");
        if (claimWalletConnectedBlock) claimWalletConnectedBlock.classList.remove("hidden");
        if (statusDiv) statusDiv.innerHTML = "";
      } catch (err) {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ MetaMask connection rejected.";
          statusDiv.style.color = "#ff4d4d";
        }
      }
    };
  }

  // Signature verification & transfer trigger execution (Phase 9 & 11)
  if (submitClaimRewardBtn) {
    submitClaimRewardBtn.onclick = async () => {
      if (!claimWallet) return;
      
      if (statusDiv) statusDiv.innerHTML = "";
      submitClaimRewardBtn.disabled = true;
      submitClaimRewardBtn.textContent = "Sign Message in MetaMask...";
      
      try {
        const message = `Claiming SYNTRIX Reward\nToken: ${token}\nWallet: ${claimWallet}`;
        
        // Convert to hex-string array to keep MetaMask runtime validation sound
        const hexMessage = "0x" + Array.from(new TextEncoder().encode(message))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [hexMessage, claimWallet]
        });
        
        submitClaimRewardBtn.textContent = "Executing On-Chain Settlement...";
        
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/rewards/claim`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            walletAddress: claimWallet,
            signature: signature
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Claim transaction rejected.");
        }
        
        if (claimRewardDetails) claimRewardDetails.classList.add("hidden");
        if (claimActionPanel) claimActionPanel.classList.add("hidden");
        if (claimSuccessPanel) claimSuccessPanel.classList.remove("hidden");
        
        if (claimScreenTitle) claimScreenTitle.textContent = "Settlement Finalized!";
        if (claimInfoSubtitle) claimInfoSubtitle.textContent = "Your SYN tokens have been transferred successfully.";
        
        if (claimTxHashLink) {
          claimTxHashLink.textContent = result.transactionHash;
          claimTxHashLink.href = `https://polygonscan.com/tx/${result.transactionHash}`;
        }
        
        if (statusDiv) {
          statusDiv.innerHTML = "✅ Reward successfully transferred! Your wallet balance has been updated.";
          statusDiv.style.color = "#57d6c2";
        }

      } catch (err) {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ " + err.message;
          statusDiv.style.color = "#ff4d4d";
        }
        submitClaimRewardBtn.disabled = false;
        submitClaimRewardBtn.textContent = "✍️ Sign Message & Claim Tokens";
      }
    };
  }
}
