const BACKEND_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:5000"
  : "https://syntrix-airdrop.onrender.com";

// Constants for Strict Validations
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_TIMEOUT_MS = 60000; // 60 seconds to allow Render.com to wake from sleep

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
let isOtpSent = false;
let userConnectedWalletAddress = "";

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

  // Bind operational button actions
  if (nextBtn) nextBtn.addEventListener("click", handleNextSection);
  if (prevBtn) prevBtn.addEventListener("click", handlePrevSection);
  if (claimForm) claimForm.addEventListener("submit", handleSurveySubmission);
  if (connectWalletBtn) connectWalletBtn.addEventListener("click", () => connectWallet(false));
  if (claimConnectWalletBtn) claimConnectWalletBtn.addEventListener("click", () => connectWallet(true));
  if (executeClaimBtn) executeClaimBtn.addEventListener("click", handleManualClaimExecution);
  if (submitClaimRewardBtn) submitClaimRewardBtn.addEventListener("click", handleSignatureTokenRelease);
  if (copyReferralBtn) copyReferralBtn.addEventListener("click", handleReferralLinkCopy);
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
  if (startSurveyBtn) startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
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

    // STATE 2: VERIFY THE OTP CODE
    const gateOtpInput = document.getElementById("gateOtp");
    const otpVal = gateOtpInput ? gateOtpInput.value.trim() : "";

    if (!otpVal || otpVal.length !== 6) {
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Please enter the 6-digit verification code.";
        statusDiv.style.color = "#ff4d4d";
      }
      return;
    }

    if (statusDiv) {
      statusDiv.innerHTML = "⏳ Verifying code...";
      statusDiv.style.color = "#57d6c2";
    }

    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, otp: otpVal })
      });

      const result = await response.json();
      if (result.success) {
        if (statusDiv) statusDiv.innerHTML = "✅ Verification successful!";
        
        userEmailAddress = emailVal;
        localStorage.setItem("syntrix_user_email", emailVal);
        
        if (referredByCodeInput && referredByCodeInput.value.trim() !== "") {
          localStorage.setItem("referralCode", normalizeReferralCode(referredByCodeInput.value));
        }

        await runProfileLedgerVerification(emailVal, false);
      } else {
        if (statusDiv) {
          statusDiv.innerHTML = "❌ " + (result.error || "Invalid or expired code.");
          statusDiv.style.color = "#ff4d4d";
        }
      }
    } catch (err) {
      if (statusDiv) {
        statusDiv.innerHTML = "❌ Network error. Could not verify code.";
        statusDiv.style.color = "#ff4d4d";
      }
    }
  });
}

// ================= STAGE 2: PROFILE LEDGER LOOKUP & STATE MANAGEMENT =================
async function runProfileLedgerVerification(email, isFromModal = false) {
  const outputTarget = isFromModal ? modalStatus : statusDiv;
  if (!outputTarget) return;

  outputTarget.innerHTML = `⏳ ${getUIText("checkingLedger")}`;
  outputTarget.style.color = "#57d6c2";

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();

    if (isFromModal) dismissModal();

    if (statusResult.success) {
      userEmailAddress = email;
      localStorage.setItem("syntrix_user_email", email);
      
      // Update stats dashboard fields
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statClaimedRewards) statClaimedRewards.innerText = `${statusResult.claimedRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${(statusResult.pendingRewards || 0) + (statusResult.claimedRewards || 0)} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

      // Immediately jump to Dashboard if the user exists in Supabase
      if (statusResult.exists === true) {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        if (claimForm) claimForm.classList.add("hidden");
        if (topProgressBox) topProgressBox.classList.add("hidden");
        if (rewardDashboardScreen) rewardDashboardScreen.classList.remove("hidden");
        outputTarget.innerHTML = "";
      } else {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        if (claimForm) claimForm.classList.remove("hidden");
        if (topProgressBox) topProgressBox.classList.remove("hidden");
        currentSection = 0;
        renderSection();
        outputTarget.innerHTML = "";
      }
    } else {
      if (!isFromModal) {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        if (claimForm) claimForm.classList.remove("hidden");
        if (topProgressBox) topProgressBox.classList.remove("hidden");
        currentSection = 0;
        renderSection();
        outputTarget.innerHTML = "";
      } else {
        outputTarget.innerHTML = "❌ Profile ledger entry not found.";
        outputTarget.style.color = "#ff4d4d";
      }
    }
  } catch (err) {
    outputTarget.innerHTML = "❌ Communication framework offline.";
    outputTarget.style.color = "#ff4d4d";
  }
}

// ================= STAGE 3: MULTI-STEP RESEARCH DATA MATRIX RENDERING =================
function renderSection() {
  const sections = getSurveyData();
  if (!sections || sections.length === 0 || !surveyContainer) return;

  const currentData = sections[currentSection];
  
  // Highlight progressive sidebar markers
  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === currentSection + 1) st.classList.add("active");
    else st.classList.remove("active");
  });

  // Calculate percentage bar metrics
  const progressPercent = ((currentSection + 1) / sections.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

  let htmlStr = `<div class="survey-section-card animate-fade-in">
    <h2 class="surveySectionTitle">${getSectionTitle(currentData)}</h2>`;

  // Swapped to the premium pill-button UI
  currentData.questions.forEach((q) => {
    const savedAnswer = answers[q.id] || "";
    
    htmlStr += `<div class="question-block" style="margin-top:30px; text-align:left;">
      <p class="questionText" style="font-weight:700; margin-bottom:16px; font-size:17px; color:#1f1f1f;">${getQuestionText(q)}</p>
      <div class="options">`; 

    q.options.forEach((opt) => {
      const isChecked = savedAnswer === opt ? "checked" : "";
      const isSelectedClass = savedAnswer === opt ? "selected" : ""; 
      
      htmlStr += `
        <label class="option ${isSelectedClass}" style="display:inline-block; user-select:none;">
          <input type="radio" name="${q.id}" value="${opt}" ${isChecked} style="display:none;" onchange="recordSelection('${q.id}', this.value)">
          <span class="optionText">${getOptionText(opt)}</span>
        </label>`;
    });

    htmlStr += `</div></div>`;
  });

  htmlStr += `</div>`;
  surveyContainer.innerHTML = htmlStr;

  // Handle pagination dynamic displays
  if (prevBtn) prevBtn.style.visibility = currentSection === 0 ? "hidden" : "visible";
  
  if (currentSection === sections.length - 1) {
    if (nextBtn) nextBtn.classList.add("hidden");
    if (submitClaimBtn) submitClaimBtn.classList.remove("hidden");
  } else {
    if (nextBtn) nextBtn.classList.remove("hidden");
    if (submitClaimBtn) submitClaimBtn.classList.add("hidden");
  }
}

window.recordSelection = function(questionId, selectedValue) {
  answers[questionId] = selectedValue;
  // Visually repaint selections for faster UI response times
  renderSection();
};

function validateCurrentSectionAnswers() {
  const sections = getSurveyData();
  const currentData = sections[currentSection];
  for (let q of currentData.questions) {
    if (!answers[q.id]) return false;
  }
  return true;
}

function handleNextSection() {
  if (!validateCurrentSectionAnswers()) {
    alert(getUIText("validationRequired"));
    return;
  }
  currentSection++;
  renderSection();
}

// ================= STAGE 5: WEB3 CONNECTIVITY & EMBEDDED WALLET CREATOR MODAL INTERFACE =================
async function connectWallet(isDirectClaimFlow = false) {
  const creatorModal = document.getElementById("walletCreatorModal");
  const closeBtn = document.getElementById("closeWalletCreatorBtn");
  const googleAuthBtn = document.getElementById("authGoogleWalletBtn");
  const appleAuthBtn = document.getElementById("authAppleWalletBtn");

  // IF METAMASK BROWSER EXTENSION IS MISSING: Launch Embedded Wallet Creation Popup
  if (typeof window.ethereum === "undefined") {
    console.log("[SYN-WEB3] Core extension missing. Launching MetaMask Embedded integration overlay.");
    
    if (creatorModal) creatorModal.classList.remove("hidden");

    if (closeBtn) {
      closeBtn.onclick = () => creatorModal.classList.add("hidden");
    }

    // AUTHENTIC SOCIAL WALLET GEN LOGIC LAYER (CONNECTED TO METAMASK RAILS)
    const handleSocialWalletGeneration = async (providerType) => {
      if (!window.metamaskEmbeddedInstance) {
        alert("Wallet initialization engine is currently warming up. Please try again in 2 seconds.");
        return;
      }

      if (statusDiv) {
        statusDiv.innerHTML = `⏳ Spawning safe cryptographic key shares via MetaMask security matrix...`;
        statusDiv.style.color = "#a855f7";
      }
      
      try {
        // Trigger the MetaMask OAuth modal popup automatically based on social selection
        const provider = await window.metamaskEmbeddedInstance.connect();
        
        // Wrap the returned provider into an Ethers interface to extract their brand new public key address
        const ethersProvider = new window.ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const realWeb3Address = await signer.getAddress();
        
        // Cache the authentic, verified blockchain address string into memory global context
        userConnectedWalletAddress = realWeb3Address.toLowerCase();

        // Dynamically route data across layout elements
        if (isDirectClaimFlow) {
          if (claimConnectWalletBtn) claimConnectWalletBtn.classList.add("hidden");
          if (claimWalletConnectedBlock) claimWalletConnectedBlock.classList.remove("hidden");
          if (claimWalletAddressDisplay) claimWalletAddressDisplay.innerText = userConnectedWalletAddress + " (MetaMask Account)";
        } else {
          if (dashboardWalletInput) {
            dashboardWalletInput.value = userConnectedWalletAddress;
          }
        }

        creatorModal.classList.add("hidden");
        if (statusDiv) {
          statusDiv.innerHTML = `✅ Authentic MetaMask wallet generated and linked via ${providerType}!`;
          statusDiv.style.color = "#57d6c2";
        }

      } catch (authErr) {
        console.error("MetaMask verification abort:", authErr);
        if (statusDiv) {
          statusDiv.innerHTML = `❌ Connection cancelled or denied by authentication provider.`;
          statusDiv.style.color = "#ff4d4d";
        }
      }
    };

    if (googleAuthBtn) googleAuthBtn.onclick = () => handleSocialWalletGeneration("Google");
    if (appleAuthBtn) appleAuthBtn.onclick = () => handleSocialWalletGeneration("Apple");
    
    return;
  }

  // Real Web3 Production Provider Gateway Flow (Fires natively if extension is active!)
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) return;
    
    userConnectedWalletAddress = accounts[0];
    
    if (isDirectClaimFlow) {
      if (claimConnectWalletBtn) claimConnectWalletBtn.classList.add("hidden");
      if (claimWalletConnectedBlock) claimWalletConnectedBlock.classList.remove("hidden");
      if (claimWalletAddressDisplay) claimWalletAddressDisplay.innerText = userConnectedWalletAddress;
    } else {
      if (dashboardWalletInput) {
        dashboardWalletInput.value = userConnectedWalletAddress;
      }
    }
  } catch (err) {
    console.error("MetaMask browser extension handshake failure:", err.message);
  }
}

// Dashboard Claim Manual Execution Entry Point
async function handleManualClaimExecution() {
  if (!dashboardWalletInput) return;
  const targetWallet = dashboardWalletInput.value.trim();

  // 1. Strict Validation Check against your EVM Regex template
  if (!WALLET_REGEX.test(targetWallet)) {
    alert("❌ Invalid EVM public address framework detected. Address must start with 0x followed by 40 hex characters.");
    return;
  }

  // 2. Set UI loading indicator states across processing blocks
  if (statusDiv) {
    statusDiv.innerHTML = `⚡ Ingesting reward request to transactional queue registers...`;
    statusDiv.style.color = "#a855f7";
  }

  try {
    // 3. Dispatch the payload context directly to your dedicated backend route
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/claim-reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmailAddress,
        walletAddress: targetWallet
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // 4. Update UI to match the background processing engine status
      if (statusDiv) {
        statusDiv.innerHTML = "✨ Request successfully queued! Your payout is being compiled into our next block cycle.";
        statusDiv.style.color = "#57d6c2";
      }
      
      // Clear the dashboard layout fields to prevent double triggers
      if (dashboardWalletInput) dashboardWalletInput.value = "";
      
      // Refresh the ledger state tracking matrices dynamically after 3 seconds
      setTimeout(async () => {
        await runProfileLedgerVerification(userEmailAddress, false);
      }, 3000);

    } else {
      if (statusDiv) {
        statusDiv.innerHTML = `❌ ${result.error || "Claim system execution failed."}`;
        statusDiv.style.color = "#ff4d4d";
      }
    }
  } catch (err) {
    if (statusDiv) {
      statusDiv.innerHTML = "❌ Token execution communication gateway failure.";
      statusDiv.style.color = "#ff4d4d";
    }
  }
}

// ================= STAGE 6: EXPLICIT ON-CHAIN CLAIM ROUTES =================
async function initializeClaimSection(token) {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/claim-details?token=${encodeURIComponent(token)}`);
    const details = await response.json();

    if (claimLoadingGear) claimLoadingGear.classList.add("hidden");

    if (details.success) {
      if (claimStaticIcon) claimStaticIcon.classList.remove("hidden");
      if (claimScreenTitle) claimScreenTitle.innerText = "Claim Authorized Successfully";
      if (claimInfoSubtitle) claimInfoSubtitle.innerText = "Please authenticate ledger registry requirements below via message validation structures.";
      if (claimRewardDetails) claimRewardDetails.classList.remove("hidden");
      if (claimActionPanel) claimActionPanel.classList.remove("hidden");

      if (document.getElementById("claimInfoEmail")) document.getElementById("claimInfoEmail").innerText = details.email;
      if (document.getElementById("claimInfoType")) document.getElementById("claimInfoType").innerText = details.type || "Airdrop Claim";
      if (document.getElementById("claimInfoAmount")) document.getElementById("claimInfoAmount").innerText = `${details.amount || 10} SYN`;
      
      // Cache details to memory contexts
      claimScreenSection.dataset.email = details.email;
      claimScreenSection.dataset.token = token;
    } else {
      showClaimScreenError("Link Expired or Invalid", details.error || "The credential target block signature profile matches an invalid registration framework.");
    }
  } catch (err) {
    if (claimLoadingGear) claimLoadingGear.classList.add("hidden");
    showClaimScreenError("Network Error", "Failed to retrieve registration records from target node arrays.");
  }
}

function showClaimScreenError(title, subtitle) {
  if (claimStaticIcon) claimStaticIcon.classList.add("hidden");
  if (claimScreenTitle) claimScreenTitle.innerText = title;
  if (claimInfoSubtitle) claimInfoSubtitle.innerText = subtitle;
  if (claimErrorBox) claimErrorBox.classList.remove("hidden");
  if (claimRewardDetails) claimRewardDetails.classList.add("hidden");
  if (claimActionPanel) claimActionPanel.classList.add("hidden");
}

async function handleSignatureTokenRelease() {
  const email = claimScreenSection.dataset.email;
  const token = claimScreenSection.dataset.token;

  if (!userConnectedWalletAddress) {
    alert("Please re-establish MetaMask structural configurations.");
    return;
  }

  try {
    const message = `Authenticating Token Core distribution protocols on email registry node: ${email}`;
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, userConnectedWalletAddress]
    });

    if (claimActionPanel) claimActionPanel.classList.add("hidden");
    if (claimRewardDetails) claimRewardDetails.classList.add("hidden");
    
    if (claimScreenTitle) claimScreenTitle.innerText = "Processing Verification Pipeline...";
    if (claimInfoSubtitle) claimInfoSubtitle.innerText = "Appending distribution requests directly to transaction loop blocks...";
    if (claimLoadingGear) claimLoadingGear.classList.remove("hidden");

    const response = await fetchWithTimeout(`${BACKEND_URL}/api/execute-claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        signature: signature,
        walletAddress: userConnectedWalletAddress
      })
    });

    const txResult = await response.json();
    if (claimLoadingGear) claimLoadingGear.classList.add("hidden");

    // **UI UPDATE TO MATCH ASYNC BACKGROUND PAYOUT QUEUE**
    if (txResult.success) {
      if (claimStaticIcon) claimStaticIcon.classList.add("hidden");
      if (claimScreenTitle) claimScreenTitle.innerText = "Claim Received Successfully!";
      if (claimInfoSubtitle) claimInfoSubtitle.innerHTML = "✨ Your distribution is currently being written into our block processing layers.<br>Your tokens will automatically land in your wallet in a moments time!";
    } else {
      showClaimScreenError("Transaction Revoked", txResult.error || "The processing smart contract rejected token asset distributions.");
    }
  } catch (err) {
    if (claimLoadingGear) claimLoadingGear.classList.add("hidden");
    alert("Cryptographic signature process rejected or timed out.");
  }
}

// ================= UTILITIES & DASHBOARD EXTRA FEATURES =================
function handleReferralLinkCopy() {
  if (!referralCodeDisplay) return;
  referralCodeDisplay.select();
  referralCodeDisplay.setSelectionRange(0, 99999);
  
  try {
    navigator.clipboard.writeText(referralCodeDisplay.value);
    if (copyReferralBtn) {
      const originalText = copyReferralBtn.innerText;
      copyReferralBtn.innerText = "Copied! ✓";
      setTimeout(() => { copyReferralBtn.innerText = originalText; }, 2000);
    }
  } catch (err) {
    alert("Failed to access system clipboard registers.");
  }
}

function handlePrevSection() {
  if (currentSection > 0) {
    currentSection--;
    renderSection();
  }
}
