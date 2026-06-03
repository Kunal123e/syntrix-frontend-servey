const BACKEND_URL = "https://syntrix-airdrop.onrender.com";

// Onboarding and Navigation DOM Hook Nodes
const emailGateSection = document.getElementById("emailGateSection");
const emailGateForm = document.getElementById("emailGateForm");
const gateEmailInput = document.getElementById("gateEmail");
const startSurveyBtn = document.getElementById("startSurveyBtn");
const referredByCodeInput = document.getElementById("referredByCode"); // Phase 4

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

// Integrated Reward Claims Section (Phase 9 SPA)
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

// Statistics DOM nodes (Phase 7)
const statTotalReferrals = document.getElementById("statTotalReferrals");
const statPendingRewards = document.getElementById("statPendingRewards");
const statClaimedRewards = document.getElementById("statClaimedRewards");
const statTotalEarned = document.getElementById("statTotalEarned");
const referralCodeDisplay = document.getElementById("referralCodeDisplay");
const copyReferralBtn = document.getElementById("copyReferralBtn");
const referralInviteForm = document.getElementById("referralInviteForm");
const inviteFriendEmail = document.getElementById("inviteFriendEmail");
const referralStatusMessage = document.getElementById("referralStatusMessage");

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
  
  // Phase 3: URL Parameter Reading & localStorage persistence
  if (refParam) {
    localStorage.setItem("referralCode", refParam.trim().toUpperCase());
    // Strip query parameters for clean URL aesthetic
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // Fill referredByCode input if code exists in localStorage
  const savedRefCode = localStorage.getItem("referralCode");
  if (savedRefCode && referredByCodeInput) {
    referredByCodeInput.value = savedRefCode;
  }
  
  // Router check: If accessing claim route (by URL path '/claim' or having '?token=...' parameter)
  const isClaimPath = window.location.pathname.includes("/claim") || claimToken;
  
  if (isClaimPath && claimToken) {
    // Hide standard views, show claim section
    emailGateSection.classList.add("hidden");
    claimForm.classList.add("hidden");
    rewardDashboardScreen.classList.add("hidden");
    claimScreenSection.classList.remove("hidden");
    
    // De-activate sidebar step tracking
    document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
    
    initializeClaimSection(claimToken);
  } else {
    // Normal onboarding flow
    claimScreenSection.classList.add("hidden");
    
    // Session Recovery
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
    
    // Translate all static page elements
    translatePage();
    
    // Rerender layout content matching translation engine profiles
    if (claimForm.classList.contains("hidden") === false) {
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
    claiming: "⚡ Dispensing 10 SYNX tokens to target network gateway...",
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

  // Main Titles
  const mainTitleEl = document.getElementById("mainTitle");
  const mainSubtitleEl = document.getElementById("mainSubtitle");
  if (mainTitleEl && (dict.mainTitle || dict.title)) mainTitleEl.innerText = dict.mainTitle || dict.title;
  if (mainSubtitleEl && (dict.mainSubtitle || dict.surveySubtitle)) mainSubtitleEl.innerText = dict.mainSubtitle || dict.surveySubtitle;

  // Onboarding Gate
  const emailSectionTitleEl = document.querySelector("#emailGateSection .sectionTitle");
  if (emailSectionTitleEl && dict.emailSectionTitle) emailSectionTitleEl.innerText = dict.emailSectionTitle;
  
  const startSurveyBtnEl = document.getElementById("startSurveyBtn");
  if (startSurveyBtnEl && dict.btnStart) startSurveyBtnEl.innerHTML = dict.btnStart;

  // Navigation buttons
  const prevBtnEl = document.getElementById("prevBtn");
  const nextBtnEl = document.getElementById("nextBtn");
  const submitClaimBtnEl = document.getElementById("submitClaimBtn");
  if (prevBtnEl && (dict.previous || dict.btnPrev)) prevBtnEl.innerHTML = `&lt; ${dict.previous || dict.btnPrev}`;
  if (nextBtnEl && (dict.next || dict.btnNext)) nextBtnEl.innerHTML = `${dict.next || dict.btnNext} &gt;`;
  if (submitClaimBtnEl && (dict.submit || dict.btnSubmit)) submitClaimBtnEl.innerHTML = dict.submit || dict.btnSubmit;

  // Dashboard
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
  
  const inviteLabelEl = document.querySelector("#referralInviteForm label");
  if (inviteLabelEl && dict.inviteLabel) inviteLabelEl.innerText = dict.inviteLabel;
  
  const sendInviteBtnEl = document.getElementById("sendInviteBtn");
  if (sendInviteBtnEl && dict.btnInvite) sendInviteBtnEl.innerText = dict.btnInvite;

  // Modal
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

// Reveal custom modal overlay when clicking "Retrieve Pending Claim"
menuRecoverBtn.addEventListener("click", () => {
  optionsPopover.classList.add("hidden");
  modalEmailInput.value = "";
  modalStatus.innerHTML = "";
  retrieveModal.classList.remove("hidden");
  setTimeout(() => { modalEmailInput.focus(); }, 100);
});

// Modal dismiss event listeners
const dismissModal = () => { retrieveModal.classList.add("hidden"); };
closeModalBtn.addEventListener("click", dismissModal);
cancelModalBtn.addEventListener("click", dismissModal);
retrieveModal.addEventListener("click", (e) => {
  if (e.target === retrieveModal) dismissModal();
});

// Custom Modal Submit Trigger Execution Handler
confirmRetrieveBtn.addEventListener("click", async () => {
  const targetEmail = modalEmailInput.value.trim();
  await runProfileLedgerVerification(targetEmail, true);
});

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email"); // Clear saved session
  localStorage.removeItem("referralCode");
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
  claimScreenSection.classList.add("hidden");
  
  document.querySelectorAll(".step").forEach((st, idx) => {
    if (idx === 0) st.classList.add("active");
    else st.classList.remove("active");
  });
}

// ================= STAGE 1: ENTRY ONBOARDING & AUTO-RECOVERY GATE =================
if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailVal = gateEmailInput.value.trim();
    await runProfileLedgerVerification(emailVal, false);
  });
} else {
  // Fallback anchor hooks if layout matches standard click triggers
  startSurveyBtn.addEventListener("click", async () => {
    const emailVal = gateEmailInput.value.trim();
    await runProfileLedgerVerification(emailVal, false);
  });
}

// Centralized Asynchronous Core Routing Logic for Profile Matching
async function runProfileLedgerVerification(emailValue, isFromModal = false) {
  const sanitizedEmail = emailValue.trim().toLowerCase();
  
  // Choose correct feedback container based on where the action was taken
  const currentStatusOutput = isFromModal ? modalStatus : statusDiv;
  
  if (!sanitizedEmail || !sanitizedEmail.includes("@")) {
    currentStatusOutput.innerHTML = "❌ Please input a valid identification email profile address.";
    currentStatusOutput.style.color = "#ff4d4d";
    return;
  }
  
  userEmailAddress = sanitizedEmail;
  currentStatusOutput.innerHTML = getUIText("checkingLedger");
  currentStatusOutput.style.color = "#57d6c2";
  
  try {
    const refCodeVal = referredByCodeInput ? referredByCodeInput.value.trim() : "";
    // Intercept: Scan database records on the backend cluster
    const response = await fetch(`${BACKEND_URL}/api/dashboard-auth?email=${encodeURIComponent(userEmailAddress)}&ref=${encodeURIComponent(refCodeVal)}`);
    const verification = await response.json();
    
    console.log("Database response payload logs:", verification);

    // DYNAMIC CONDITIONAL AUTO-RECOVERY PIPELINE
    if (verification.exists) {
      // Check structural boolean variations from normalized database schemas
      const hasClaimedTokens = verification.isClaimed === true || 
                                verification.status === "success" || 
                                (verification.txHash !== undefined && verification.txHash !== null && verification.txHash !== "");

      if (!hasClaimedTokens) {
        // CASE A: Profile has filled survey data but has not claimed their tokens yet
        currentStatusOutput.innerHTML = "✨ Record isolated! Loading Web3 dashboard gateway...";
        currentStatusOutput.style.color = "#57d6c2";
        
        localStorage.setItem("syntrix_user_email", userEmailAddress);
        
        setTimeout(async () => {
          // Clear layout containers
          emailGateSection.classList.add("hidden");
          claimForm.classList.add("hidden");
          topProgressBox.classList.add("hidden");
          if (isFromModal) retrieveModal.classList.add("hidden");
          
          statusDiv.innerHTML = "";
          
          // Force slide into Web3 reward dashboard display card
          rewardDashboardScreen.classList.remove("hidden");
          
          // Highlight ultimate index on left layout bar element
          document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
          const finalStepNode = document.getElementById("step-7");
          if (finalStepNode) {
            finalStepNode.classList.add("active");
          } else {
            const fallbackStep = document.querySelector(".sidebar .steps .step:last-child") || document.querySelector(".step:last-child");
            if (fallbackStep) fallbackStep.classList.add("active");
          }
          
          // Load referral stats dashboard (Phase 7)
          await loadReferralDashboard(userEmailAddress);
        }, 1000);
        
      } else {
        // CASE B: Target communication signature records an active validation token hash transfer
        currentStatusOutput.innerHTML = "❌ This email profile has already fully claimed their SYNX tokens.";
        currentStatusOutput.style.color = "#ff4d4d";
      }
      
    } else {
      // CASE C: Fresh custom consumer entry sequence
      if (isFromModal) {
        currentStatusOutput.innerHTML = "❌ No prior survey history found for this email address.";
        currentStatusOutput.style.color = "#ff4d4d";
      } else {
        currentStatusOutput.innerHTML = "";
        emailGateSection.classList.add("hidden");
        claimForm.classList.remove("hidden");
        topProgressBox.classList.remove("hidden");
        
        currentSection = 0;
        renderSection();
      }
    }
    
  } catch (err) {
    console.error("Ledger communication stack tracing error:", err);
    // Graceful Fallback if cluster times out
    if (!isFromModal) {
      currentStatusOutput.innerHTML = "";
      emailGateSection.classList.add("hidden");
      claimForm.classList.remove("hidden");
      topProgressBox.classList.remove("hidden");
      renderSection();
    } else {
      currentStatusOutput.innerHTML = "❌ Communication channel with registry server timed out.";
      currentStatusOutput.style.color = "#ff4d4d";
    }
  }
}

// ================= STAGE 2: SURVEY LAYOUT GENERATOR MATRIX =================
function renderSection() {
  const surveyData = getSurveyData();
  if (surveyData.length === 0) return;

  const section = surveyData[currentSection];
  
  // Highlighting matching steps on sidebar tracker panels cleanly
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
  progressText.innerText = `${getUIText('progress')} ${currentSection + 1}/${surveyData.length}`;
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

// ================= SUBMIT SURVEY TO CLUSTER =================
claimForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusDiv.innerHTML = getUIText("submitting");
  statusDiv.style.color = "#57d6c2";
  
  const refCodeVal = referredByCodeInput ? referredByCodeInput.value.trim() : "";

  try {
    const response = await fetch(`${BACKEND_URL}/api/claim-airdrop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: userEmailAddress, 
        referredByCode: refCodeVal, // Optional referral code parameter (Phase 4)
        ...answers 
      })
    });

    const output = await response.json();

    if (output.success) {
      statusDiv.innerHTML = "";
      
      localStorage.setItem("syntrix_user_email", userEmailAddress);
      localStorage.removeItem("referralCode"); // Clear saved code once completed
      
      // Advance user instantly into Stage 3 Post-Submission dashboard screen container
      claimForm.classList.add("hidden");
      topProgressBox.classList.add("hidden");
      rewardDashboardScreen.classList.remove("hidden");
      
      document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
      const finalStepNode = document.getElementById("step-7");
      if (finalStepNode) finalStepNode.classList.add("active");
      
      // Load stats dashboard
      await loadReferralDashboard(userEmailAddress);
    } else {
      statusDiv.innerHTML = "❌ " + (output.error || "Survey submission integration failure.");
      statusDiv.style.color = "#ff4d4d";
    }
  } catch (err) {
    statusDiv.innerHTML = "❌ Communication channel with Render cluster down.";
    statusDiv.style.color = "#ff4d4d";
  }
});

// ================= STAGE 3: EXECUTE LIVE REWARD VIA DASHBOARD =================
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
          <p style="color:#000; margin-bottom:10px;">10 SYNX tokens have been pushed directly to your account address.</p>
          <a href="https://polygonscan.com/tx/${claimResult.transactionHash}" target="_blank" style="color: #1f1f1f; text-decoration: underline; font-family: monospace; font-size: 13px;">
            Tx Hash: ${claimResult.transactionHash.substring(0, 20)}...
          </a>
        </div>
      `;
      // Update statistics
      await loadReferralDashboard(userEmailAddress);
    } else {
      statusDiv.innerHTML = "❌ " + (claimResult.error || "Reward asset generation rejected.");
      statusDiv.style.color = "#ff4d4d";
    }
  } catch (err) {
    statusDiv.innerHTML = "❌ Network processing failure executing claim asset parameters.";
    statusDiv.style.color = "#ff4d4d";
  }
});

// ================= REFERRAL DASHBOARD STATS RETRIEVAL (PHASE 7) =================
async function loadReferralDashboard(email) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/referral/dashboard?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (res.ok && data.success) {
      if (statTotalReferrals) statTotalReferrals.textContent = data.totalReferrals;
      if (statPendingRewards) statPendingRewards.textContent = `${data.pendingRewards} SYN`;
      if (statClaimedRewards) statClaimedRewards.textContent = `${data.claimedRewards} SYN`;
      if (statTotalEarned) statTotalEarned.textContent = `${data.totalEarned} SYN`;
      
      // Standardize referral links structure
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
  copyReferralBtn.addEventListener("click", () => {
    if (referralCodeDisplay) {
      referralCodeDisplay.select();
      document.execCommand("copy");
      copyReferralBtn.textContent = "Copied!";
      setTimeout(() => {
        copyReferralBtn.textContent = "Copy Link";
      }, 2000);
    }
  });
}

// Direct Invitation Form submission
if (referralInviteForm) {
  referralInviteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const friendEmail = inviteFriendEmail.value.trim().toLowerCase();
    
    if (referralStatusMessage) {
      referralStatusMessage.textContent = "Sending invitation email...";
      referralStatusMessage.className = "referral-status";
    }
    
    try {
      const link = referralCodeDisplay.value;
      const res = await fetch(`${BACKEND_URL}/api/send-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerEmail: userEmailAddress,
          friendEmail: friendEmail,
          referralLink: link
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (referralStatusMessage) {
          referralStatusMessage.textContent = `Invitation email successfully dispatched to ${friendEmail}!`;
          referralStatusMessage.className = "referral-status success";
        }
        inviteFriendEmail.value = "";
      } else {
        throw new Error(data.error || "Failed to dispatch email.");
      }
    } catch (err) {
      if (referralStatusMessage) {
        referralStatusMessage.textContent = err.message;
        referralStatusMessage.className = "referral-status error";
      }
    }
  });
}

// ================= REWARD CLAIMING SPA ROUTE WORKFLOW =================
function initializeClaimSection(token) {
  let claimWallet = "";

  // Fetch token specs on load
  fetch(`${BACKEND_URL}/api/rewards/claim-info?token=${encodeURIComponent(token)}`)
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification parameter token check invalid.");
      
      if (data.status !== "pending") {
        throw new Error(`This reward allocation is already marked as ${data.status.toUpperCase()}.`);
      }
      
      document.getElementById("claimInfoEmail").textContent = data.email;
      document.getElementById("claimInfoType").textContent = data.rewardType;
      document.getElementById("claimInfoAmount").textContent = `${data.amount} SYN`;
      
      claimLoadingGear.classList.add("hidden");
      claimStaticIcon.classList.remove("hidden");
      claimScreenTitle.textContent = "Claim Your Earned Reward";
      claimInfoSubtitle.textContent = "Verify details and connect MetaMask to execute claim.";
      
      claimRewardDetails.classList.remove("hidden");
      claimActionPanel.classList.remove("hidden");
    })
    .catch(err => {
      claimLoadingGear.classList.add("hidden");
      claimErrorBox.classList.remove("hidden");
      claimScreenTitle.textContent = "Claim Attempt Blocked";
      claimInfoSubtitle.textContent = err.message;
      claimInfoSubtitle.style.color = "#ff4d4d";
    });

  // MetaMask Pairing
  claimConnectWalletBtn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      statusDiv.innerHTML = "❌ MetaMask wallet browser extension not detected.";
      statusDiv.style.color = "#ff4d4d";
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      claimWallet = accounts[0];
      
      claimWalletAddressDisplay.textContent = claimWallet;
      claimConnectWalletBtn.classList.add("hidden");
      claimWalletConnectedBlock.classList.remove("hidden");
      statusDiv.innerHTML = "";
    } catch (err) {
      statusDiv.innerHTML = "❌ MetaMask connection rejected.";
      statusDiv.style.color = "#ff4d4d";
    }
  });

  // Signature verification & transfer trigger execution (Phase 9 & 11)
  submitClaimRewardBtn.addEventListener("click", async () => {
    if (!claimWallet) return;
    
    statusDiv.innerHTML = "";
    submitClaimRewardBtn.disabled = true;
    submitClaimRewardBtn.textContent = "Sign Message in MetaMask...";
    
    try {
      // Build Verification Message
      const message = `Claiming SYNTRIX Reward\nToken: ${token}\nWallet: ${claimWallet}`;
      
      // Request signature from user MetaMask provider
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, claimWallet]
      });
      
      submitClaimRewardBtn.textContent = "Executing On-Chain Settlement...";
      
      const response = await fetch(`${BACKEND_URL}/api/rewards/claim`, {
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
      
      // Open Success Screen
      claimRewardDetails.classList.add("hidden");
      claimActionPanel.classList.add("hidden");
      claimSuccessPanel.classList.remove("hidden");
      
      claimScreenTitle.textContent = "Settlement Finalized!";
      claimInfoSubtitle.textContent = "Your SYN tokens have been transferred successfully.";
      
      claimTxHashLink.textContent = result.transactionHash;
      claimTxHashLink.href = `https://polygonscan.com/tx/${result.transactionHash}`;
      
      statusDiv.innerHTML = "✅ Reward successfully transferred! Your wallet balance has been updated.";
      statusDiv.style.color = "#57d6c2";

    } catch (err) {
      statusDiv.innerHTML = "❌ " + err.message;
      statusDiv.style.color = "#ff4d4d";
      submitClaimRewardBtn.disabled = false;
      submitClaimRewardBtn.textContent = "✍️ Sign Message & Claim Tokens";
    }
  });
}
