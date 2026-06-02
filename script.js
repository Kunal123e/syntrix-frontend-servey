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

const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");

let userEmailAddress = "";
let currentSection = 0;
const answers = {};
let currentLanguage = "en";

// ================= NEW: GLOBAL REFERRAL TRACKING STATE VARIABLES =================
let activeReferralCode = null;

function checkUrlForReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('ref')) {
    activeReferralCode = urlParams.get('ref');
    console.log("Captured active referral code tracking input:", activeReferralCode);
  }
}
// Immediately execute extraction protocol on load
checkUrlForReferral();

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
  
  document.querySelectorAll(".step").forEach((st, idx) => {
    if (idx === 0) st.classList.add("active");
    else st.classList.remove("active");
  });
}

// ================= STAGE 1: ENTRY ONBOARDING & AUTO-RECOVERY TRACKING GATE =================
if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailVal = gateEmailInput.value.trim();
    await runProfileLedgerVerification(emailVal, false);
  });
} else {
  // Fallback anchor hooks if your layout is bound to standard click listeners on buttons instead of form structures
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
    // Intercept: Scan database records on the backend cluster
    // Pass active referral code parameters downstream during custom registration checks
    let requestUrl = `${BACKEND_URL}/api/dashboard-auth?email=${encodeURIComponent(userEmailAddress)}`;
    if (activeReferralCode) {
      requestUrl += `&ref=${encodeURIComponent(activeReferralCode)}`;
    }

    const response = await fetch(requestUrl);
    const verification = await response.json();
    
    console.log("Database response payload logs:", verification);

    // Save referral code metadata generated by backend profiles database rules safely to state
    if (verification.referralCode) {
      localStorage.setItem('myReferralCode', verification.referralCode);
    }

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
        
        setTimeout(() => {
          // Clear layout section containers instantly
          emailGateSection.classList.add("hidden");
          claimForm.classList.add("hidden");
          topProgressBox.classList.add("hidden");
          if (isFromModal) retrieveModal.classList.add("hidden");
          
          statusDiv.innerHTML = "";
          
          // Force slide into Web3 reward dashboard display card
          rewardDashboardScreen.classList.remove("hidden");
          initializeReferralDashboard();
          
          // Highlight ultimate index on left layout bar element
          document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
          const finalStepNode = document.getElementById("step-7");
          if (finalStepNode) {
            finalStepNode.classList.add("active");
          } else {
            const fallbackStep = document.querySelector(".sidebar .steps .step:last-child") || document.querySelector(".step:last-child");
            if (fallbackStep) fallbackStep.classList.add("active");
          }
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
    // Pack explicit referral metadata alongside payload if generated tracking rules exist
    const requestPayload = { email: userEmailAddress, ...answers };
    if (activeReferralCode) {
      requestPayload.referredByCode = activeReferralCode;
    }

    const response = await fetch(`${BACKEND_URL}/api/claim-airdrop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload)
    });

    const output = await response.json();

    if (output.success) {
      statusDiv.innerHTML = "";
      
      // Save code records calculated dynamically during raw payload submissions
      if (output.referralCode) {
        localStorage.setItem('myReferralCode', output.referralCode);
      }
      
      // Advance user instantly into Stage 3 Post-Submission dashboard screen container
      claimForm.classList.add("hidden");
      topProgressBox.classList.add("hidden");
      rewardDashboardScreen.classList.remove("hidden");
      
      // Run UI generator configurations
      initializeReferralDashboard();
      
      document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
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

// ================= NEW: REFERRAL MODULE USER INTERFACE LOGIC MANAGEMENT =================
function initializeReferralDashboard() {
  const myCode = localStorage.getItem('myReferralCode') || "SYNX-MEMBER";
  const referralInput = document.getElementById("referralCodeDisplay");
  const copyBtn = document.getElementById("copyReferralBtn");
  const referralForm = document.getElementById("referralInviteForm");
  const referralStatus = document.getElementById("referralStatusMessage");

  // Construct sharing parameters mapping back seamlessly to our gate listeners
  if (referralInput) {
    const trackingInvitationUrl = `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(myCode)}`;
    referralInput.value = trackingInvitationUrl;
  }

  // Bind clipboard triggers safely
  if (copyBtn && referralInput) {
    // Remove older clones if updating dynamically during active states
    const newCopyBtn = copyBtn.cloneNode(true);
    copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);

    newCopyBtn.addEventListener("click", () => {
      referralInput.select();
      referralInput.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(referralInput.value);
      
      newCopyBtn.textContent = "Copied! ✓";
      setTimeout(() => { newCopyBtn.textContent = "Copy Link"; }, 2000);
    });
  }

  // Bind direct outbound invitation pipeline actions
  if (referralForm) {
    referralForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const targetFriendEmail = document.getElementById("inviteFriendEmail").value.trim();
      
      if (!referralStatus) return;

      referralStatus.innerText = "⏳ Generating notification ledger transaction...";
      referralStatus.style.color = "#57d6c2";

      try {
        // Execute direct communication out to backend server to process automated mail deliveries
        const res = await fetch(`${BACKEND_URL}/api/send-invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referrerEmail: userEmailAddress,
            friendEmail: targetFriendEmail,
            referralLink: referralInput.value
          })
        });

        const outcome = await res.json();

        if (outcome.success) {
          referralStatus.innerText = "✨ Invitation link successfully routed to your friend's inbox!";
          referralStatus.style.color = "#16a34a";
          referralForm.reset();
        } else {
          referralStatus.innerText = "❌ " + (outcome.error || "Could not dispatch invitation parameters.");
          referralStatus.style.color = "#ff4d4d";
        }
      } catch (err) {
        console.error("Outbound invitation exception tracking trace:", err);
        referralStatus.innerText = "❌ Network transport error processing invite transmission.";
        referralStatus.style.color = "#ff4d4d";
      }
    });
  }
}
