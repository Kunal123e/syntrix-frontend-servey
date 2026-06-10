// ================= GLOBAL CONFIGURATION ENGINES & CONSTANTS =================
const BACKEND_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:5000"
  : "https://syntrix-airdrop.onrender.com";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_TIMEOUT_MS = 60000;

let userEmailAddress = "";
let currentSection = 0;
const answers = {};
let currentLanguage = "en";
let isOtpSent = false;
let userConnectedWalletAddress = "";

// ================= DOM LINK HIERARCHY HOOK NODES =================
const emailGateSection = document.getElementById("emailGateSection");
const emailGateForm = document.getElementById("emailGateForm");
const gateEmailInput = document.getElementById("gateEmail");
const startSurveyBtn = document.getElementById("startSurveyBtn");
const referredByCodeInput = document.getElementById("referredByCode"); 

const menuToggleBtn = document.getElementById("menuToggleBtn");
const optionsPopover = document.getElementById("optionsPopover");
const menuRestartBtn = document.getElementById("menuRestartBtn");
const menuRecoverBtn = document.getElementById("menuRecoverBtn");

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

const statTotalReferrals = document.getElementById("statTotalReferrals");
const statPendingRewards = document.getElementById("statPendingRewards");
const statClaimedRewards = document.getElementById("statClaimedRewards");
const statTotalEarned = document.getElementById("statTotalEarned");
const referralCodeDisplay = document.getElementById("referralCodeDisplay");
const copyReferralBtn = document.getElementById("copyReferralBtn");

const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");

// ================= GLOBAL HELPERS & FORM VALIDATION MATRIX =================
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

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = DEFAULT_TIMEOUT_MS } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// ================= STAGE 1: EMAIL VERIFICATION GATE =================
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

function getSectionTitle(section) {
  if (typeof sectionTranslations !== "undefined" && sectionTranslations[currentLanguage]) {
    return sectionTranslations[currentLanguage][section.title] || section.title;
  }
  return section.title || "";
}

// ================= STAGE 2: SURVEY RENDER SYSTEM =================
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

function validateCurrentSectionAnswers() {
  const sections = getSurveyData();
  const currentData = sections[currentSection];
  if (!currentData) return false;
  for (let q of currentData.questions) {
    if (!answers[q.id]) return false;
  }
  return true;
}

function renderSection() {
  const sections = getSurveyData();
  if (!sections || sections.length === 0 || !surveyContainer) return;

  const currentData = sections[currentSection];
  
  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === currentSection + 1) st.classList.add("active");
    else st.classList.remove("active");
  });

  const progressPercent = ((currentSection + 1) / sections.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

  // THICK BOLD STYLING APPLIED TO TITLE
  let htmlStr = `<div class="survey-section-card animate-fade-in">
    <h2 class="surveySectionTitle" style="font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 5px;">${getSectionTitle(currentData)}</h2>`;

  currentData.questions.forEach((q) => {
    const savedAnswer = answers[q.id] || "";
    // THICK BOLD STYLING APPLIED TO QUESTIONS
    htmlStr += `<div class="question-block" style="margin-top:30px; text-align:left;">
      <p class="questionText" style="font-weight:800; margin-bottom:16px; font-size:17px; color:#1f1f1f;">${getQuestionText(q)}</p>
      <div class="options">`; 

    q.options.forEach((opt) => {
      const isChecked = savedAnswer === opt ? "checked" : "";
      const isSelectedClass = savedAnswer === opt ? "selected" : ""; 
      // THICK BOLD STYLING APPLIED TO OPTIONS
      htmlStr += `
        <label class="option ${isSelectedClass}" style="display:inline-block; user-select:none; font-weight: 600;">
          <input type="radio" name="${q.id}" value="${opt}" ${isChecked} style="display:none;" onchange="recordSelection('${q.id}', this.value)">
          <span class="optionText">${getOptionText(opt)}</span>
        </label>`;
    });
    htmlStr += `</div></div>`;
  });

  htmlStr += `</div>`;
  surveyContainer.innerHTML = htmlStr;

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
  renderSection();
};

function handleNextSection() {
  if (!validateCurrentSectionAnswers()) {
    alert(getUIText("validationRequired"));
    return;
  }
  
  // Advance to next section
  currentSection++;

  // --- GAMIFICATION EXCITEMENT LOGIC ---
  const unlockedTokens = currentSection * 8; // 8 Tokens per module completed
  const excitementBanner = document.getElementById("excitementBanner");
  const excitementText = document.getElementById("excitementText");
  
  if (excitementBanner && excitementText) {
    excitementBanner.style.display = "flex";
    
    // Reset animation so it bounces every time they click next
    excitementBanner.style.animation = 'none';
    excitementBanner.offsetHeight; 
    excitementBanner.style.animation = null; 

    if (currentSection < 7) {
      excitementText.innerHTML = `Great job! You've secured <strong style="font-size: 20px; font-weight: 900;">${unlockedTokens} SYNX</strong> so far! Complete the next module to claim 8 more!`;
    } else {
      excitementText.innerHTML = `🔥 Incredible! You've secured all <strong style="font-size: 20px; font-weight: 900;">56 SYNX</strong>! Hit Submit to claim them!`;
    }
  }
  // -------------------------------------

  renderSection();
}

function handlePrevSection() {
  if (currentSection > 0) {
    currentSection--;
    
    const unlockedTokens = currentSection * 8;
    const excitementText = document.getElementById("excitementText");
    if (excitementText && currentSection > 0) {
      excitementText.innerHTML = `Great job! You've secured <strong style="font-size: 20px; font-weight: 900;">${unlockedTokens} SYNX</strong> so far! Complete the next module to claim 8 more!`;
    } else if (excitementText) {
      document.getElementById("excitementBanner").style.display = "none";
    }

    renderSection();
  }
}

// ================= STAGE 3: PROFILE LEDGER BACKEND HANDLERS =================
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
      
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statClaimedRewards) statClaimedRewards.innerText = `${statusResult.claimedRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${(statusResult.pendingRewards || 0) + (statusResult.claimedRewards || 0)} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

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

async function handleSurveySubmission(e) {
  if (e) e.preventDefault();
  if (!validateCurrentSectionAnswers()) {
    alert(getUIText("validationRequired"));
    return;
  }

  // Hide the survey UI so it looks clean
  document.getElementById("claimForm").classList.add("hidden");
  const excitementBanner = document.getElementById("excitementBanner");
  if(excitementBanner) excitementBanner.style.display = "none";

  // SHOW FULL SCREEN ANIMATION
  const animOverlay = document.getElementById("rewardAnimationOverlay");
  if (animOverlay) animOverlay.style.display = "flex";

  const referralCodeUsed = localStorage.getItem("referralCode") || "";

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/submit-survey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmailAddress,
        answers: answers,
        referredBy: referralCodeUsed
      })
    });

    const result = await response.json();
    
    // Wait for the animation to play out nicely for the user (3.5 seconds)
    setTimeout(async () => {
      if (animOverlay) animOverlay.style.display = "none";
      
      if (result.success) {
        if (statusDiv) statusDiv.innerHTML = "";
        await runProfileLedgerVerification(userEmailAddress, false);
      } else {
        document.getElementById("claimForm").classList.remove("hidden"); // Re-show if failed
        if (statusDiv) {
          statusDiv.innerHTML = `❌ ${result.error || "Submission rejected by registry backend."}`;
          statusDiv.style.color = "#ff4d4d";
        }
      }
    }, 3500);

  } catch (err) {
    if (animOverlay) animOverlay.style.display = "none";
    document.getElementById("claimForm").classList.remove("hidden");
    if (statusDiv) {
      statusDiv.innerHTML = "❌ Network transaction failed.";
      statusDiv.style.color = "#ff4d4d";
    }
  }
}

// ================= STAGE 5: WEB3 EMBEDDED OAUTH WALLET HANDLING =================
async function connectWallet(isDirectClaimFlow = false) {
  const creatorModal = document.getElementById("walletCreatorModal");
  const closeBtn = document.getElementById("closeWalletCreatorBtn");
  const googleAuthBtn = document.getElementById("authGoogleWalletBtn");

  if (typeof window.ethereum === "undefined") {
    console.log("[SYN-WEB3] Core extension missing. Launching MetaMask Embedded integration overlay.");
    if (creatorModal) creatorModal.classList.remove("hidden");

    if (closeBtn) {
      closeBtn.onclick = () => creatorModal.classList.add("hidden");
    }

    const handleSocialWalletGeneration = async () => {
      if (!window.isWeb3AuthReady || !window.metamaskEmbeddedInstance) {
        console.warn("Web3Auth is still initializing. Please wait a moment.");
        if (statusDiv) {
          statusDiv.innerHTML = `⏳ Web3 Engine is still loading. Please wait a moment and click again.`;
          statusDiv.style.color = "#f59e0b";
        }
        return;
      }

      if (statusDiv) {
        statusDiv.innerHTML = `⏳ Initializing secure Web3Auth portal via MetaMask parameters...`;
        statusDiv.style.color = "#a855f7";
      }
      
      try {
        const provider = await window.metamaskEmbeddedInstance.connect();
        
        const EthersProviderClass = (window.ethers && window.ethers.BrowserProvider) || (window.ethers && window.ethers.providers && window.ethers.providers.Web3Provider);
        if (!EthersProviderClass) {
          throw new Error("Ethers provider module not detected globally.");
        }
        
        const ethersProvider = new EthersProviderClass(provider);
        const signer = await ethersProvider.getSigner();
        const realWeb3Address = await signer.getAddress();
        
        userConnectedWalletAddress = realWeb3Address.toLowerCase();

        if (isDirectClaimFlow) {
          if (claimConnectWalletBtn) claimConnectWalletBtn.classList.add("hidden");
          if (claimWalletConnectedBlock) claimWalletConnectedBlock.classList.remove("hidden");
          if (claimWalletAddressDisplay) claimWalletAddressDisplay.innerText = userConnectedWalletAddress + " (Web3Auth)";
        } else {
          if (dashboardWalletInput) {
            dashboardWalletInput.value = userConnectedWalletAddress;
          }
        }

        if (creatorModal) creatorModal.classList.add("hidden");
        if (statusDiv) {
          statusDiv.innerHTML = `✅ Authentic Web3 wallet generated and linked successfully!`;
          statusDiv.style.color = "#57d6c2";
        }
      } catch (authErr) {
        console.error("Web3Auth verification abort:", authErr);
        if (statusDiv) {
          statusDiv.innerHTML = `❌ Connection cancelled or denied.`;
          statusDiv.style.color = "#ff4d4d";
        }
      }
    };

    if (googleAuthBtn) googleAuthBtn.onclick = () => handleSocialWalletGeneration();
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) return;
    
    userConnectedWalletAddress = accounts[0].toLowerCase();
    
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

async function handleManualClaimExecution() {
  if (!dashboardWalletInput) return;
  const targetWallet = dashboardWalletInput.value.trim();

  if (!WALLET_REGEX.test(targetWallet)) {
    alert("❌ Invalid EVM public address framework detected. Address must start with 0x followed by 40 hex characters.");
    return;
  }

  if (statusDiv) {
    statusDiv.innerHTML = `⚡ Ingesting reward request to transactional queue registers...`;
    statusDiv.style.color = "#a855f7";
  }

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/claim-reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmailAddress, walletAddress: targetWallet })
    });

    const result = await response.json();
    if (result.success) {
      if (statusDiv) {
        statusDiv.innerHTML = "✨ Request successfully queued! Your payout is being compiled into our next block cycle.";
        statusDiv.style.color = "#57d6c2";
      }
      if (dashboardWalletInput) dashboardWalletInput.value = "";
      setTimeout(async () => { await runProfileLedgerVerification(userEmailAddress, false); }, 3000);
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

// ================= STAGE 6: EXPLICIT AFFECTED CLAIM BLOCK HANDLERS =================
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
      if (document.getElementById("claimInfoAmount")) document.getElementById("claimInfoAmount").innerText = `${details.amount || 56} SYNX`;
      
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
    
    let signature;
    if (window.ethereum && typeof window.ethereum.request === "function") {
      signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, userConnectedWalletAddress]
      });
    } else {
      const provider = window.metamaskEmbeddedInstance.provider;
      signature = await provider.request({
        method: "personal_sign",
        params: [message, userConnectedWalletAddress]
      });
    }

    if (claimActionPanel) claimActionPanel.classList.add("hidden");
    if (claimRewardDetails) claimRewardDetails.classList.add("hidden");
    
    if (claimScreenTitle) claimScreenTitle.innerText = "Processing Verification Pipeline...";
    if (claimInfoSubtitle) claimInfoSubtitle.innerText = "Appending distribution requests directly to transaction loop blocks...";
    if (claimLoadingGear) claimLoadingGear.classList.remove("hidden");

    const response = await fetchWithTimeout(`${BACKEND_URL}/api/execute-claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token, signature: signature, walletAddress: userConnectedWalletAddress })
    });

    const txResult = await response.json();
    if (claimLoadingGear) claimLoadingGear.classList.add("hidden");

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

// ================= UTILITIES & POPOVER MODAL CONTROLS =================
const dismissModal = () => { if (retrieveModal) retrieveModal.classList.add("hidden"); };

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

function translatePage() {
  if (typeof translations === "undefined" || !translations[currentLanguage]) return;
  const dict = translations[currentLanguage];

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

  const connectWalletBtnEl = document.querySelector("#connectWalletBtn span");
  if (connectWalletBtnEl && dict.metaMaskLabel) connectWalletBtnEl.innerText = dict.metaMaskLabel;
  
  const manualLabelEl = document.querySelector(".manualWalletWrapper .dividerLine span");
  if (manualLabelEl && dict.manualLabel) manualLabelEl.innerText = dict.manualLabel;
  
  const executeClaimBtnEl = document.getElementById("executeClaimBtn");
  if (executeClaimBtnEl && dict.btnExecute) executeClaimBtnEl.innerText = dict.btnExecute;
  
  const referralTitleEl = document.querySelector(".referralContainer .dividerLine span");
  if (referralTitleEl && dict.referralTitle) referralTitleEl.innerText = dict.referralTitle;
  
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

// ================= LIFE CYCLE REGISTRATION RUNNERS & EVENT ROUTERS =================
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

  if (claimToken) {
    if (emailGateSection) emailGateSection.classList.add("hidden");
    if (claimForm) claimForm.classList.add("hidden");
    if (topProgressBox) topProgressBox.classList.add("hidden");
    if (rewardDashboardScreen) rewardDashboardScreen.classList.add("hidden");
    if (claimScreenSection) claimScreenSection.classList.remove("hidden");
    if (claimLoadingGear) claimLoadingGear.classList.remove("hidden");
    await initializeClaimSection(claimToken);
  } else {
    const localSavedEmail = localStorage.getItem("syntrix_user_email");
    if (localSavedEmail) {
      userEmailAddress = localSavedEmail;
      await runProfileLedgerVerification(userEmailAddress, false);
    }
  }

  // --- ATTACH EVENT LISTENERS TO INTERACTION HANDLERS ---
  if (nextBtn) nextBtn.onclick = () => handleNextSection();
  if (prevBtn) prevBtn.onclick = () => handlePrevSection();
  if (submitClaimBtn) submitClaimBtn.onclick = (e) => handleSurveySubmission(e);
  if (executeClaimBtn) executeClaimBtn.onclick = () => handleManualClaimExecution();
  
  // Connect Wallets
  if (connectWalletBtn) connectWalletBtn.onclick = () => connectWallet(false);
  if (claimConnectWalletBtn) claimConnectWalletBtn.onclick = () => connectWallet(true);
  if (submitClaimRewardBtn) submitClaimRewardBtn.onclick = () => handleSignatureTokenRelease();
  if (copyReferralBtn) copyReferralBtn.onclick = () => handleReferralLinkCopy();

  // Popover Nav Menu Interactivity Matrix
  if (menuToggleBtn && optionsPopover) {
    menuToggleBtn.onclick = (e) => {
      e.stopPropagation();
      optionsPopover.classList.toggle("hidden");
    };
    document.addEventListener("click", () => optionsPopover.classList.add("hidden"));
  }

  if (menuRestartBtn) {
    menuRestartBtn.onclick = () => {
      if (confirm("Are you sure you want to clear your current progress session?")) {
        resetApplicationFlowState();
      }
    };
  }

  if (menuRecoverBtn && retrieveModal) {
    menuRecoverBtn.onclick = () => {
      retrieveModal.classList.remove("hidden");
      if (modalEmailInput) modalEmailInput.value = "";
      if (modalStatus) modalStatus.innerHTML = "";
    };
  }

  if (closeModalBtn) closeModalBtn.onclick = () => dismissModal();
  if (cancelModalBtn) cancelModalBtn.onclick = () => dismissModal();
  
  if (confirmRetrieveBtn) {
    confirmRetrieveBtn.onclick = async () => {
      const searchEmail = modalEmailInput ? modalEmailInput.value.trim().toLowerCase() : "";
      if (!searchEmail || !EMAIL_REGEX.test(searchEmail)) {
        if (modalStatus) {
          modalStatus.innerHTML = "❌ Please provide a valid email structure.";
          modalStatus.style.color = "#ff4d4d";
        }
        return;
      }
      await runProfileLedgerVerification(searchEmail, true);
    };
  }
});
