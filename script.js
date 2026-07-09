// =========================================================================
// SYNTRIX CORE PLATFORM APPLICATION LOGIC ENGINE
// =========================================================================

const BACKEND_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:5000"
  : "https://syntrix-airdrop.onrender.com";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_TIMEOUT_MS = 90000; 

let surveyStartTime = 0;
const QUALITY_THRESHOLD_MS = 120000; 

let userEmailAddress = "";
let currentSection = 0;
const answers = {};
let currentLanguage = "en";
let isOtpSent = false;
let userConnectedWalletAddress = "";
let legalConsentTimestamp = "";
let clientUserAgent = "";

const splashLandingGate = document.getElementById("splashLandingGate");
const mainApplicationLayout = document.getElementById("mainApplicationLayout");
const viewSplashHome = document.getElementById("viewSplashHome");
const viewSplashRewards = document.getElementById("viewSplashRewards");
const viewSplashAbout = document.getElementById("viewSplashAbout");
const linkHomeTab = document.getElementById("linkHomeTab");
const linkRewardsTab = document.getElementById("linkRewardsTab");
const linkAboutTab = document.getElementById("linkAboutTab");
const navLogoHomeTrigger = document.getElementById("navLogoHomeTrigger");
const navGetStartedAction = document.getElementById("navGetStartedAction");
const initializePlatformBtn = document.getElementById("initializePlatformBtn");

const emailGateSection = document.getElementById("emailGateSection");
const emailGateForm = document.getElementById("emailGateForm");
const gateEmailInput = document.getElementById("gateEmail");
const startSurveyBtn = document.getElementById("startSurveyBtn");
const referredByCodeInput = document.getElementById("referredByCode"); 
const menuToggleBtn = document.getElementById("menuToggleBtn");
const optionsPopover = document.getElementById("optionsPopover");
const menuRecoverBtn = document.getElementById("menuRecoverBtn");
const menuRestartBtn = document.getElementById("menuRestartBtn"); 
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

const gatewayScreenSection = document.getElementById("gatewayScreenSection");
const documentModeSection = document.getElementById("documentModeSection");

const rewardDashboardScreen = document.getElementById("rewardDashboardScreen");
const tabScreenBadge = document.getElementById("tabScreenBadge");
const tabScreenReferrals = document.getElementById("tabScreenReferrals");
const tabScreenMoreSurveys = document.getElementById("tabScreenMoreSurveys");
const claimScreenSection = document.getElementById("claimScreenSection");

const dashboardWalletInput = document.getElementById("dashboardWalletInput");
const executeClaimBtn = document.getElementById("executeClaimBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const claimConnectWalletBtn = document.getElementById("claimConnectWalletBtn");
const claimWalletConnectedBlock = document.getElementById("claimWalletConnectedBlock");
const claimWalletAddressDisplay = document.getElementById("claimWalletAddressDisplay");
const submitClaimRewardBtn = document.getElementById("submitClaimRewardBtn");
const statTotalReferrals = document.getElementById("statTotalReferrals");
const statPendingRewards = document.getElementById("statPendingRewards");
const statClaimedRewards = document.getElementById("statClaimedRewards");
const statTotalEarned = document.getElementById("statTotalEarned");
const referralCodeDisplay = document.getElementById("referralCodeDisplay");
const copyReferralBtn = document.getElementById("copyReferralBtn");

const generateQrBtn = document.getElementById("generateQrBtn");
const qrCodeWrapper = document.getElementById("qrCodeWrapper");
const qrCodeCanvas = document.getElementById("qrCodeCanvas");
const downloadQrBtn = document.getElementById("downloadQrBtn");

const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");
const dashboardTabLinks = document.getElementById("dashboardTabLinks");
const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
const confirmRestartModal = document.getElementById("confirmRestartModal");
const cancelRestartBtn = document.getElementById("cancelRestartBtn");
const confirmRestartBtn = document.getElementById("confirmRestartBtn");

function showToast(message, icon = "⚠️") {
  let toast = document.getElementById("customToast");
  let toastMsg = document.getElementById("toastMessage");
  let toastIcon = document.querySelector(".toast-icon");
  
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "customToast";
    toast.className = "custom-toast";
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span id="toastMessage">${message}</span>`;
    document.body.appendChild(toast);
    toastMsg = document.getElementById("toastMessage");
    toastIcon = document.querySelector(".toast-icon");
  }

  toastMsg.innerText = message;
  if(toastIcon) toastIcon.innerText = icon;
  
  void toast.offsetWidth;
  toast.style.display = "flex";
  toast.classList.add("show");
  setTimeout(() => { 
    toast.classList.remove("show"); 
    setTimeout(() => { toast.style.display = "none"; }, 500);
  }, 3500);
}

function openLegalModal() { 
  const legalModal = document.getElementById("legalModal");
  if(legalModal) {
    legalModal.classList.remove("hidden");
    legalModal.style.display = "flex";
  }
}
function closeLegalModal() { 
  const legalModal = document.getElementById("legalModal");
  if(legalModal) {
    legalModal.classList.add("hidden");
    legalModal.style.display = "none";
  }
}
const dismissModal = () => { 
  if (retrieveModal) {
    retrieveModal.classList.add("hidden"); 
    retrieveModal.style.display = "none";
  }
};

function routeSplashNavViews(targetView) {
  if (viewSplashHome) viewSplashHome.style.display = "none";
  if (viewSplashRewards) viewSplashRewards.style.display = "none";
  if (viewSplashAbout) viewSplashAbout.style.display = "none";
  
  document.querySelectorAll(".nav-splash-tab").forEach(link => link.classList.remove("active"));
  
  if (targetView === "home" && viewSplashHome) { viewSplashHome.style.display = "block"; if(linkHomeTab) linkHomeTab.classList.add("active"); }
  if (targetView === "rewards" && viewSplashRewards) { viewSplashRewards.style.display = "block"; if(linkRewardsTab) linkRewardsTab.classList.add("active"); }
  if (targetView === "about" && viewSplashAbout) { viewSplashAbout.style.display = "block"; if(linkAboutTab) linkAboutTab.classList.add("active"); }
}

if (linkHomeTab) linkHomeTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("home"); });
if (linkRewardsTab) linkRewardsTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("rewards"); });
if (linkAboutTab) linkAboutTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("about"); });
if (navLogoHomeTrigger) navLogoHomeTrigger.addEventListener("click", () => routeSplashNavViews("home"));
document.querySelectorAll(".back-to-home-btn").forEach(btn => btn.addEventListener("click", () => routeSplashNavViews("home")));

if (navGetStartedAction) navGetStartedAction.addEventListener("click", () => { if (initializePlatformBtn) initializePlatformBtn.click(); });

if (initializePlatformBtn) {
  initializePlatformBtn.addEventListener("click", () => {
    if(splashLandingGate) splashLandingGate.style.display = "none"; 
    if(mainApplicationLayout) { mainApplicationLayout.classList.remove("hidden"); mainApplicationLayout.style.display = "flex"; }
    
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      if (emailGateSection) { emailGateSection.style.display = "none"; emailGateSection.classList.add("hidden"); }
      runProfileLedgerVerification(userEmailAddress, false);
    } else {
      const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "gatewayScreenSection", "documentModeSection"];
      dashboardCards.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = "none"; el.classList.add("hidden"); }
      });
      if (emailGateSection) { emailGateSection.classList.remove("hidden"); emailGateSection.style.display = "flex"; }
    }
  });
}

window.openMode = function(mode) {
  const gateway = document.getElementById("gatewayScreenSection");
  const survey = document.getElementById("claimForm");
  const topProgress = document.getElementById("topProgressBox");
  const docMode = document.getElementById("documentModeSection");
  const mainSubtitle = document.getElementById("mainSubtitle"); 

  [gateway, survey, topProgress, docMode].forEach(el => {
      if (el) { el.classList.add("hidden"); el.style.display = "none"; }
  });

  if (mode === 'gateway') {
      if(gateway) { gateway.classList.remove("hidden"); gateway.style.display = "flex"; }
      if(mainSubtitle) mainSubtitle.style.display = "block";
  } else if (mode === 'survey') {
      currentSection = 0;
      if(mainSubtitle) mainSubtitle.style.display = "block";
      renderSection(); 
  } else if (mode === 'document') {
      if(docMode) { docMode.classList.remove("hidden"); docMode.style.display = "block"; }
      if(mainSubtitle) mainSubtitle.style.display = "none"; 
  }
};

// 🚀 Explicitly URL encoded paths to bypass space formatting errors in browsers
const BADGE_PROFILES = {
  Analyzer: { 
    title: "ANALYZER", sub: "The Mindful Shopper",
    desc: "You shop with brilliant clarity! For you, real value and true quality matter most. By thoughtfully comparing details and trusting genuine reviews, you always make incredibly smart and satisfying choices.", 
    iconHTML: `<img src="BADGES%20PNG/badge%201%20analyzer.jpeg" alt="Analyzer" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    color: "#2563eb", textColor: "#0f172a"
  },
  Stylist: { 
    title: "STYLIST", sub: "The Tasteful Explorer",
    desc: "You have a beautiful eye for design! For you, shopping is about joy, artistry, and wonderful experiences. You naturally gravitate towards things that tell a great story and bring an extra touch of elegance into your everyday life.", 
    iconHTML: `<img src="BADGES%20PNG/badge%203.jpeg" alt="Stylist" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z"></path></svg>`,
    color: "#8b5cf6", textColor: "#0f172a"
  },
  Hedger: { 
    title: "HEDGER", sub: "The Thoughtful Planner",
    desc: "You value peace of mind and total reliability! You love knowing your purchases are safe and backed by great guarantees. By choosing trusted paths, you ensure every shopping experience is completely smooth, secure, and worry-free.", 
    iconHTML: `<img src="BADGES%20PNG/badge%202.jpeg" alt="Hedger" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    color: "#ea580c", textColor: "#0f172a"
  },
  Native: { 
    title: "NATIVE", sub: "The Connected Heart",
    desc: "You deeply value genuine connections! Your best shopping moments come from trusted recommendations and shared stories. By listening to friends and family, you always bring home products that carry real warmth and authenticity.", 
    iconHTML: `<img src="BADGES%20PNG/badge%204.jpeg" alt="Native" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    color: "#eab308", textColor: "#0f172a"
  }
};

function displayConsumerBadgesUI(badgeKey) {
  const profile = BADGE_PROFILES[badgeKey] || BADGE_PROFILES.Analyzer;
  const badgeCard = document.getElementById("dashboardPsychologyBadgeCard");

  if (badgeCard) {
    badgeCard.style.display = "flex";
    badgeCard.style.background = "#ffffff";
    badgeCard.style.border = `2px solid ${profile.color}30`;
    badgeCard.style.boxShadow = `0 15px 35px -5px rgba(0, 0, 0, 0.05), 0 0 20px ${profile.color}15`;
    badgeCard.style.borderRadius = "24px";
    badgeCard.style.padding = "30px";
    badgeCard.style.marginBottom = "35px";
    badgeCard.style.alignItems = "center";
    badgeCard.style.gap = "30px";
    badgeCard.style.textAlign = "left";

    badgeCard.innerHTML = `
      <div style="position: relative; flex-shrink: 0; width: 100px; height: 100px; border-radius: 50%; background: #ffffff; border: 3px solid ${profile.color}60; display: block; box-shadow: 0 0 30px ${profile.color}30; overflow: hidden;">
         ${profile.iconHTML}
      </div>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; color: ${profile.color}; font-weight: 900; letter-spacing: 2px; margin-bottom: 8px;">Consumer Persona Unlocked</div>
        <h3 style="font-size: 32px; font-weight: 900; color: ${profile.textColor}; margin: 0 0 8px 0; letter-spacing: -1px;">${profile.title}</h3>
        <div style="font-size: 16px; font-weight: 800; color: #475569; margin-bottom: 12px;">${profile.sub}</div>
        <p style="font-size: 15px; color: #64748b; line-height: 1.7; margin: 0; font-weight: 500;">${profile.desc}</p>
      </div>
    `;
  }

  const dropdownBadgeWrapper = document.getElementById("menuPsychologyBadgeWrapper");
  const dropdownBadgeText = document.getElementById("menuPsychologyBadgeText");
  const dropdownBadgeIcon = document.getElementById("menuBadgeIcon");
  if (dropdownBadgeWrapper && dropdownBadgeText && dropdownBadgeIcon) {
    dropdownBadgeWrapper.style.display = "flex";
    dropdownBadgeIcon.innerHTML = profile.menuIcon;
    dropdownBadgeText.innerText = profile.title;
    dropdownBadgeText.style.color = profile.color;
  }
}

function normalizeReferralCode(code) {
  if (!code) return "";
  let clean = code.trim().toUpperCase();
  clean = clean.replace(/\s+/g, "");
  if (!clean.startsWith("SYN-")) clean = "SYN-" + clean;
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

function getUIText(key) {
  const fallbacks = {
    validationRequired: "Please answer all questions before continuing.",
    submitting: "⏳ Storing survey data metrics across secure registers...",
    claiming: "⚡ Appending whitelist configuration parameters...",
    checkingLedger: "⏳ Setting up your exclusive premium experience..."
  };
  if (typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return fallbacks[key] || key;
}

function routeDashboardTabs(targetTab) {
  const cards = [
    document.getElementById("rewardDashboardScreen"),
    document.getElementById("tabScreenBadge"),
    document.getElementById("tabScreenReferrals"),
    document.getElementById("tabScreenMoreSurveys"),
    document.getElementById("claimScreenSection"),
    document.getElementById("documentModeSection"),
    document.getElementById("gatewayScreenSection"),
    document.getElementById("claimForm")
  ];
  
  cards.forEach(card => {
    if (card) { card.classList.add("hidden"); card.style.display = "none"; }
  });
  
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  const clickedBtn = document.querySelector(`[data-tab="${targetTab}"]`);
  if (clickedBtn) clickedBtn.classList.add("active");

  const mainSubtitle = document.getElementById("mainSubtitle"); 
  if(mainSubtitle) mainSubtitle.style.display = "block";

  if (targetTab === "hub") { const el = document.getElementById("rewardDashboardScreen"); if(el) { el.classList.remove("hidden"); el.style.display = "block"; } }
  if (targetTab === "badge") { const el = document.getElementById("tabScreenBadge"); if(el) { el.classList.remove("hidden"); el.style.display = "block"; } }
  if (targetTab === "referrals") { const el = document.getElementById("tabScreenReferrals"); if(el) { el.classList.remove("hidden"); el.style.display = "block"; } }
  if (targetTab === "more-surveys") { const el = document.getElementById("tabScreenMoreSurveys"); if(el) { el.classList.remove("hidden"); el.style.display = "block"; } }
  if (targetTab === "document") { const el = document.getElementById("documentModeSection"); if(el) { el.classList.remove("hidden"); el.style.display = "block"; } if(mainSubtitle) mainSubtitle.style.display = "none"; }
}

if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!gateEmailInput) return;

    const legalConsent = document.getElementById("legalConsent");
    if (legalConsent && !legalConsent.checked) {
      showToast("You must agree to the Legal Terms of Research to continue.", "⚖️");
      return;
    }
    
    const emailVal = gateEmailInput.value.trim().toLowerCase();
    
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
      showToast("Please input a valid email address.", "❌");
      return;
    }

    if (!isOtpSent) {
      if (startSurveyBtn.disabled) return; 
      startSurveyBtn.disabled = true;
      startSurveyBtn.innerHTML = "⏳ Sending Code...";

      try {
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal })
        });
        const result = await response.json();
        if (result.success) {
          isOtpSent = true;
          document.getElementById("otpSection").style.display = "block";
          startSurveyBtn.innerHTML = "Verify & Enter &rarr;";
          startSurveyBtn.disabled = false;
          gateEmailInput.readOnly = true; 
        } else {
          showToast("Failed to send code.", "❌");
          startSurveyBtn.disabled = false;
          startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
        }
      } catch (err) {
        showToast("Network error.", "❌");
        startSurveyBtn.disabled = false;
        startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
      }
      return; 
    }

    const gateOtpInput = document.getElementById("gateOtp");
    const otpVal = gateOtpInput.value.replace(/[\s-]/g, "");

    if (!otpVal || otpVal.length !== 6) {
      showToast("Please enter the 6-digit verification code.", "❌");
      return;
    }

    if (startSurveyBtn.disabled) return;
    startSurveyBtn.disabled = true;
    startSurveyBtn.innerHTML = "⏳ Verifying...";

    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, otp: otpVal })
      });

      const result = await response.json();
      if (result.success) {
        userEmailAddress = emailVal;
        localStorage.setItem("syntrix_user_email", emailVal);
        startSurveyBtn.disabled = false;
        await runProfileLedgerVerification(emailVal, false);
      } else {
        showToast("Invalid code.", "❌");
        startSurveyBtn.disabled = false;
        startSurveyBtn.innerHTML = "Verify & Enter &rarr;";
      }
    } catch (err) {
      showToast("Network error.", "❌");
      startSurveyBtn.disabled = false;
      startSurveyBtn.innerHTML = "Verify & Enter &rarr;";
    }
  });
}

function interceptClaimGateActions(e) {
  if (e) e.preventDefault();
  showToast("Coming Soon! Stay tuned to claim your precious tokens! 💎", "⚙️");
}

function validateCurrentSectionAnswers() {
  const sections = getSurveyData();
  const currentData = sections[currentSection];
  if (!currentData) return false;
  
  for (let q of currentData.questions) { 
    if (q.type === "textarea") {
      if (!answers[q.id] || answers[q.id].trim() === "") return false;
    } else {
      if (!answers[q.id]) return false; 
    }
  }
  return true;
}

function renderSection() {
  const sections = getSurveyData();
  if (!sections || sections.length === 0 || !surveyContainer) return;
  const currentData = sections[currentSection];
  
  try {
    if (currentSection === 0) surveyStartTime = Date.now(); 

    if (topProgressBox) { topProgressBox.classList.remove("hidden"); topProgressBox.style.display = "block"; }
    if (claimForm) { claimForm.classList.remove("hidden"); claimForm.style.display = "block"; }
    if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }

    const progressPercent = ((currentSection + 1) / sections.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

    let htmlStr = `<div class="survey-section-card animate-fade-in"><h2 class="surveySectionTitle" style="font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 5px;">${getSectionTitle(currentData)}</h2>`;

    if (currentData && currentData.questions) {
        currentData.questions.forEach((q) => {
          const savedAnswer = answers[q.id] || "";
          htmlStr += `<div class="question-block" style="margin-top:30px; text-align:left;"><p class="questionText" style="font-weight:800; margin-bottom:16px; font-size:17px; color:#1f1f1f;">${getQuestionText(q)}</p><div class="options">`; 

          if (q.type === "textarea") {
               htmlStr += `<textarea id="${q.id}" placeholder="Type your answer here..." onchange="recordSelection('${q.id}', this.value)" style="width:100%; border:2px solid #e2e8f0; border-radius:14px; padding:16px; font-size:15px; font-family:inherit;">${savedAnswer}</textarea>`;
          } else if (q.options && Array.isArray(q.options)) {
              q.options.forEach((opt) => {
                const isChecked = savedAnswer === opt ? "checked" : "";
                const isSelectedClass = savedAnswer === opt ? "selected" : ""; 
                htmlStr += `<label class="option ${isSelectedClass}" style="display:inline-block; user-select:none; font-weight: 600;"><input type="radio" name="${q.id}" value="${opt}" ${isChecked} style="display:none;" onchange="recordSelection('${q.id}', this.value)"><span class="optionText">${getOptionText(opt)}</span></label>`;
              });
          }
          htmlStr += `</div></div>`;
        });
    }

    htmlStr += `</div>`;
    surveyContainer.innerHTML = htmlStr;

    if (prevBtn) {
      if(currentSection === 0) { prevBtn.style.visibility = "hidden"; prevBtn.style.display = "none"; } 
      else { prevBtn.style.visibility = "visible"; prevBtn.style.display = "block"; }
    }
    
    if (currentSection === sections.length - 1) {
      if (nextBtn) { nextBtn.classList.add("hidden"); nextBtn.style.display = "none"; }
      if (submitClaimBtn) { submitClaimBtn.classList.remove("hidden"); submitClaimBtn.style.display = "block"; }
    } else {
      if (nextBtn) { nextBtn.classList.remove("hidden"); nextBtn.style.display = "block"; }
      if (submitClaimBtn) { submitClaimBtn.classList.add("hidden"); submitClaimBtn.style.display = "none"; }
    }
  } catch (err) {
    surveyContainer.innerHTML = `<div style="background:#fee2e2; border: 2px solid #ef4444; color:#991b1b; padding: 20px; border-radius: 12px; font-weight:bold; margin-top:20px;">🚨 System Error: ${err.message}</div>`;
  }
}

window.recordSelection = function(questionId, selectedValue) { answers[questionId] = selectedValue; renderSection(); };
function handleNextSection() { if (!validateCurrentSectionAnswers()) { showToast(getUIText("validationRequired"), "⚠️"); return; } if (currentSection < getSurveyData().length - 1) { currentSection++; renderSection(); updateExcitementBanner(currentSection); } }
function handlePrevSection() { if (currentSection > 0) { currentSection--; renderSection(); updateExcitementBanner(currentSection); } }

function updateExcitementBanner(sectionIndex) {
  const banner = document.getElementById("excitementBanner");
  if (!banner) return;
  if (sectionIndex === 0) { banner.style.display = "none"; return; }

  const unlockedTokens = sectionIndex * 8;
  const totalTokens = 48;
  
  banner.style.display = "flex";
  banner.style.animation = 'none'; banner.offsetHeight; banner.style.animation = 'slideDown 0.5s ease-out';

  if (currentLanguage === "hi") {
      if (sectionIndex < 5) banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">शानदार! आपने अब तक <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">अगला मॉड्यूल पूरा करें Aur <strong style="color: #fbbf24;">8 Aur Paayein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">जारी रखें & दावा करें &gt;</div></div>`;
      else banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">अविश्वसनीय! आपने सभी <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">दावा करने के लिए नीचे सबमिट पर क्लिक करें!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 48 / 48 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">दावा करने के लिए तैयार</div></div>`;
  } else if (currentLanguage === "hinglish") {
      if (sectionIndex < 5) banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! Aapne ab tak <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> secure kar liye hain!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Next module complete karein aur <strong style="color: #fbbf24;">8 more payein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Continue & Claim &gt;</div></div>`;
      else banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! Aapne sabhi <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span> secure kar liye hain!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Neeche Submit button par click karke claim karein!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 48 / 48 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Ready to Claim</div></div>`;
  } else {
      if (sectionIndex < 5) banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! You've secured <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> so far!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Complete the next module to claim <strong style="color: #fbbf24;">8 more!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Continue & Claim &gt;</div></div>`;
      else banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! You've secured all <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span>!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Hit Submit below to transfer them to your wallet!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 48 / 48 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Ready to Claim</div></div>`;
  }
}

async function runProfileLedgerVerification(email, isFromModal = false, isBackgroundSync = false) {
  const outputTarget = isFromModal ? modalStatus : statusDiv;
  if (!outputTarget) return;

  if (!isBackgroundSync) {
    outputTarget.innerHTML = `⏳ ${getUIText("checkingLedger")}`;
    outputTarget.style.color = "#57d6c2";
  }

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();

    if (isFromModal) dismissModal();

    if (statusResult.success) {
      userEmailAddress = email;
      localStorage.setItem("syntrix_user_email", email);
      
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYNX`;
      if (statClaimedRewards) statClaimedRewards.innerText = `${statusResult.claimedRewards || 0} SYNX`;
      if (statTotalEarned) statTotalEarned.innerText = `${(statusResult.pendingRewards || 0) + (statusResult.claimedRewards || 0)} SYNX`;
      
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;
      
      const menuReferralInput = document.getElementById("menuReferralInputDisplay");
      if (menuReferralInput) menuReferralInput.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;
      
      const menuReferralWrapper = document.getElementById("menuReferralWrapper");
      if (menuReferralWrapper) menuReferralWrapper.style.display = "flex";

      if (statusResult.exists === true) {
        displayConsumerBadgesUI(statusResult.badge || "Analyzer");

        if (!isBackgroundSync) {
            if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
            if (claimForm) { claimForm.classList.add("hidden"); claimForm.style.display = "none"; }
            if (topProgressBox) { topProgressBox.classList.add("hidden"); topProgressBox.style.display = "none"; }
            if (gatewayScreenSection) { gatewayScreenSection.classList.add("hidden"); gatewayScreenSection.style.display = "none"; }
            if (documentModeSection) { documentModeSection.classList.add("hidden"); documentModeSection.style.display = "none"; }
            
            const tabLinksContainer = document.getElementById("dashboardTabLinks");
            if (tabLinksContainer) { tabLinksContainer.classList.remove("hidden"); tabLinksContainer.style.display = "flex"; }
            
            routeDashboardTabs("badge");
        }
        if (!isBackgroundSync) outputTarget.innerHTML = "";
      } else {
        const menuPsychologyBadgeWrapper = document.getElementById("menuPsychologyBadgeWrapper");
        if (menuPsychologyBadgeWrapper) menuPsychologyBadgeWrapper.style.display = "none";

        if (!isBackgroundSync) {
            if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
            
            const cards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "claimForm", "topProgressBox", "documentModeSection"];
            cards.forEach(id => {
              const el = document.getElementById(id);
              if (el) { el.classList.add("hidden"); el.style.display = "none"; }
            });
            
            const tabLinksContainer = document.getElementById("dashboardTabLinks");
            if (tabLinksContainer) { tabLinksContainer.classList.add("hidden"); tabLinksContainer.style.display = "none"; }

            window.openMode('gateway');
            outputTarget.innerHTML = "";
        }
      }
    } else {
      if (!isFromModal) {
        if (!isBackgroundSync) {
            if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
            const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "claimForm", "topProgressBox", "documentModeSection"];
            dashboardCards.forEach(id => {
              const el = document.getElementById(id);
              if (el) { el.style.display = "none"; el.classList.add("hidden"); }
            });
            const tabLinksContainer = document.getElementById("dashboardTabLinks");
            if (tabLinksContainer) { tabLinksContainer.classList.add("hidden"); tabLinksContainer.style.display = "none"; }
            
            window.openMode('gateway');
            outputTarget.innerHTML = "";
        }
      } else {
        if (!isBackgroundSync) outputTarget.innerHTML = ""; 
        showToast("Profile ledger entry not found.", "❌");
      }
    }
  } catch (err) {
    if (!isBackgroundSync) outputTarget.innerHTML = ""; 
    showToast("Server waking up or offline. Please try again.", "❌");
  }
}

function determinePersonaBadge(answersObj) {
  const scores = { Analyzer: 0, Stylist: 0, Hedger: 0, Native: 0 };
  const mapping = {
    "question_1_id": { "I compare all the data and reviews": "Analyzer", "I care about how beautiful it looks": "Stylist", "I only buy if there is a safe warranty": "Hedger", "I buy what my friends recommend": "Native" },
    "question_2_id": { "Logic and numbers": "Analyzer", "Aesthetics and vibe": "Stylist", "Safety and guarantees": "Hedger", "Community and trust": "Native" }
  };
  for (const [qId, selectedAnswer] of Object.entries(answersObj)) {
    if (mapping[qId] && mapping[qId][selectedAnswer]) { scores[mapping[qId][selectedAnswer]]++; }
  }
  let topBadge = "Analyzer"; let maxScore = -1;
  for (const [badge, score] of Object.entries(scores)) { if (score > maxScore) { maxScore = score; topBadge = badge; } }
  return topBadge;
}

async function handleSurveySubmission(e) {
  if (e) e.preventDefault();
  if ((Date.now() - surveyStartTime) < QUALITY_THRESHOLD_MS) { showToast("Please take more time to read the questions carefully.", "⏱️"); return; }
  if (!validateCurrentSectionAnswers()) { showToast(getUIText("validationRequired"), "⚠️"); return; }
  if (claimForm) { claimForm.classList.add("hidden"); claimForm.style.display = "none"; }
  
  const animOverlay = document.getElementById("rewardAnimationOverlay");
  if (animOverlay) animOverlay.style.display = "flex";

  const referralCodeUsed = localStorage.getItem("referralCode") || "";

  const finalPayload = {
    email: userEmailAddress, answers: answers, referredBy: referralCodeUsed, legal_consent: true,
    consent_timestamp: legalConsentTimestamp || new Date().toISOString(), user_agent: clientUserAgent || navigator.userAgent,
    startTime: surveyStartTime, submissionTime: Date.now(), assignedBadge: determinePersonaBadge(answers)
  };

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/submit-survey`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(finalPayload)
    });
    const result = await response.json();
    
    setTimeout(async () => {
      if (animOverlay) animOverlay.style.display = "none";
      if (result.success) await runProfileLedgerVerification(userEmailAddress, false);
      else { if (claimForm) { claimForm.classList.remove("hidden"); claimForm.style.display = "block"; } showToast(`${result.error || "Submission rejected."}`, "❌"); }
    }, 3500);
  } catch (err) {
    if (animOverlay) animOverlay.style.display = "none";
    if (claimForm) { claimForm.classList.remove("hidden"); claimForm.style.display = "block"; }
    showToast("Network transaction failed.", "❌");
  }
}

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email");
  userEmailAddress = "";
  if (emailGateSection) { emailGateSection.classList.remove("hidden"); emailGateSection.style.display = "flex"; }
  const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "gatewayScreenSection", "documentModeSection"];
  dashboardCards.forEach(id => { const el = document.getElementById(id); if (el) { el.classList.add("hidden"); el.style.display = "none"; } });
  if (mainApplicationLayout) { mainApplicationLayout.classList.add("hidden"); mainApplicationLayout.style.display = "none"; }
  if (splashLandingGate) { splashLandingGate.style.display = "flex"; }
  routeSplashNavViews("home");
  showToast("Account profiles successfully signed out.", "✓");
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const claimToken = urlParams.get("token");
  const refParam = urlParams.get("ref");
  
  if (refParam) { localStorage.setItem("referralCode", normalizeReferralCode(refParam)); window.history.replaceState({}, document.title, window.location.pathname); }
  const savedRefCode = localStorage.getItem("referralCode");
  if (savedRefCode && referredByCodeInput) referredByCodeInput.value = savedRefCode;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => { const target = e.target.dataset.tab; if (target) routeDashboardTabs(target); });
  });

  if (claimToken) {
    const dashboardCards = ["emailGateSection", "claimForm", "topProgressBox", "gatewayScreenSection", "documentModeSection", "rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys"];
    dashboardCards.forEach(id => { const el = document.getElementById(id); if (el) { el.classList.add("hidden"); el.style.display = "none"; } });
  } else {
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      if(splashLandingGate) splashLandingGate.style.display = "none";
      if(mainApplicationLayout) { mainApplicationLayout.classList.remove("hidden"); mainApplicationLayout.style.display = "flex"; }
      runProfileLedgerVerification(savedEmail, false);
    }
  }

  if (nextBtn) nextBtn.onclick = () => handleNextSection();
  if (prevBtn) prevBtn.onclick = () => handlePrevSection();
  if (claimForm) claimForm.addEventListener("submit", (e) => handleSurveySubmission(e));
  if (connectWalletBtn) connectWalletBtn.addEventListener("click", interceptClaimGateActions);
  if (claimConnectWalletBtn) claimConnectWalletBtn.addEventListener("click", interceptClaimGateActions);
  if (executeClaimBtn) executeClaimBtn.addEventListener("click", interceptClaimGateActions);
  if (submitClaimRewardBtn) submitClaimRewardBtn.addEventListener("click", interceptClaimGateActions);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", () => resetApplicationFlowState());
});

// ================= DOCUMENT MODE API LOGIC =================
const taskTypeSelect = document.getElementById('taskType');
const fileInputCamera = document.getElementById('fileInputCamera');
const fileInputGallery = document.getElementById('fileInputGallery');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const submitDocBtn = document.getElementById('submitDocBtn');
const statusMessage = document.getElementById('statusMessage');
const detailedReasonBox = document.getElementById('detailedReasonBox');
const retryUploadBtn = document.getElementById('retryUploadBtn');

const btnGallery = document.getElementById('btnGallery');
const btnCameraText = document.getElementById('btnCameraText');
const strictRulesBox = document.getElementById('strictRulesBox');
const notesSpecificUI = document.getElementById('notesSpecificUI');
const uploadTitle = document.getElementById('uploadTitle');
const docLanguageInput = document.getElementById('docLanguageInput');

let selectedFile = null;
let currentPollInterval = null;

// 🚀 FIX: Ensures safe UI resets without breaking the object URL
function resetUploadState(keepInputs = false) {
    if (!keepInputs) {
      selectedFile = null;
      if (fileInputCamera) fileInputCamera.value = '';
      if (fileInputGallery) fileInputGallery.value = '';
      if (previewContainer) previewContainer.style.display = 'none';
      if (imagePreview) imagePreview.src = '';
    }
    
    if (submitDocBtn) {
        submitDocBtn.disabled = true;
        submitDocBtn.innerText = 'Approve & Submit to Waiting Room';
        submitDocBtn.style.display = 'block';
    }
    
    if (statusMessage) {
        statusMessage.innerHTML = '';
        statusMessage.className = 'status-message'; 
    }
    
    if (detailedReasonBox) {
        detailedReasonBox.style.display = 'none';
        detailedReasonBox.innerText = '';
        detailedReasonBox.className = 'dynamic-reason-box';
    }
    
    if (retryUploadBtn) retryUploadBtn.style.display = 'none';
    if (currentPollInterval) clearInterval(currentPollInterval);
}

if (retryUploadBtn) {
    retryUploadBtn.addEventListener('click', () => resetUploadState(false));
}

if (taskTypeSelect) {
  taskTypeSelect.addEventListener('change', function(e) {
    resetUploadState(false);
    
    if (e.target.value === 'selfie') {
      if (btnGallery) btnGallery.style.display = 'none';
      if (strictRulesBox) strictRulesBox.style.display = 'none';
      if (notesSpecificUI) notesSpecificUI.style.display = 'none';
      if (btnCameraText) btnCameraText.innerText = '🤳 Take Selfie';
      if (fileInputCamera) fileInputCamera.setAttribute('capture', 'user'); 
      if (uploadTitle) uploadTitle.innerText = "Provide your Human Selfie";
    } else {
      if (btnGallery) btnGallery.style.display = 'inline-block';
      if (strictRulesBox) strictRulesBox.style.display = 'flex';
      if (notesSpecificUI) notesSpecificUI.style.display = 'block';
      if (btnCameraText) btnCameraText.innerText = '📷 Take Photo';
      if (fileInputCamera) fileInputCamera.setAttribute('capture', 'environment'); 
      if (uploadTitle) uploadTitle.innerText = "Provide your document";
    }
  });
}

function handleFileSelection(e) {
  if (e.target.files && e.target.files.length > 0) {
    const newFile = e.target.files[0];
    resetUploadState(true); 
    selectedFile = newFile;
    
    if (submitDocBtn) submitDocBtn.disabled = false;
    
    try {
      const url = URL.createObjectURL(selectedFile);
      if (imagePreview) imagePreview.src = url;
      if (previewContainer) previewContainer.style.display = 'block';
    } catch(err) {
      console.error("Preview generation failed:", err);
    }
  }
}

if (fileInputCamera) fileInputCamera.addEventListener('change', handleFileSelection);
if (fileInputGallery) fileInputGallery.addEventListener('change', handleFileSelection);

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function updateProgressUI(stepText, percent) {
    if (!statusMessage) return;
    statusMessage.innerHTML = `
      <div style="font-size:12.5px; color:#6b7280; margin-bottom:8px; font-weight:600;">Estimated Time: 5–15 Seconds</div>
      <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-bottom:10px;">
         <div style="width: ${percent}%; background:#6366f1; height:100%; transition: width 0.4s ease;"></div>
      </div>
      <div style="font-weight:800; color:#4f46e5; font-size:15px;" class="status-text-pulse">${stepText}</div>
    `;
}

function showDetailedReason(reasonText, isSuccess) {
    if(detailedReasonBox) {
        detailedReasonBox.style.display = 'block';
        detailedReasonBox.innerText = reasonText;
        detailedReasonBox.className = isSuccess ? 'dynamic-reason-box reason-success' : 'dynamic-reason-box reason-error';
    }
}

if (submitDocBtn) {
  submitDocBtn.addEventListener('click', async function() {
    if (!selectedFile || !userEmailAddress) { 
      if (statusMessage) statusMessage.innerHTML = '<span style="color:#ef4444;">⚠️ Please select a file and ensure you are logged in.</span>';
      return;
    }

    const taskType = taskTypeSelect ? taskTypeSelect.value : 'notes';
    let contentTags = [];
    
    if (taskType === 'notes') {
      const consentSensitive = document.getElementById('consentSensitive');
      const consentCommercial = document.getElementById('consentCommercial');
      if (!consentSensitive.checked || !consentCommercial.checked) { 
          if (statusMessage) statusMessage.innerHTML = '<span style="color:#ef4444;">⚠️ You must agree to the Legal Consents before uploading.</span>';
          return; 
      }
      if (docLanguageInput && docLanguageInput.value.trim() === "") { 
          if (statusMessage) statusMessage.innerHTML = '<span style="color:#ef4444;">⚠️ Please specify the language used in the notes.</span>';
          return; 
      }
      const tagCheckboxes = document.querySelectorAll('.doc-tag:checked');
      tagCheckboxes.forEach(cb => contentTags.push(cb.value));
      if (contentTags.length === 0) { 
          if (statusMessage) statusMessage.innerHTML = '<span style="color:#ef4444;">⚠️ Please select at least one content tag.</span>';
          return; 
      }
    }

    submitDocBtn.disabled = true;
    updateProgressUI('📤 Uploading securely...', 15);

    try {
      const base64String = await convertToBase64(selectedFile);
      const payload = {
        userEmail: userEmailAddress, taskType: taskType, fileName: selectedFile.name || 'capture.jpg', imageBase64: base64String,
        contentTags: contentTags.length > 0 ? contentTags : ['none']
      };

      const response = await fetch(`${BACKEND_URL}/api/upload-task`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });

      if (response.ok) {
        let attempts = 0;
        const maxAttempts = 15; // 45 seconds total check
        
        updateProgressUI('🤖 AI is verifying parameters...', 35);

        currentPollInterval = setInterval(async () => {
            attempts++;
            
            if(attempts === 2) updateProgressUI('📄 Checking quality and embeddings...', 60);
            if(attempts === 5) updateProgressUI('🔐 Security verification...', 85);

            try {
                const res = await fetch(`${BACKEND_URL}/api/check-submission?email=${encodeURIComponent(userEmailAddress)}`);
                const checkData = await res.json();
                
                if (checkData.success && checkData.submission) {
                    const status = checkData.submission.status;
                    const reason = checkData.submission.reason || "System processing error.";
                    
                    if (status === 'verified' || status === 'approved') {
                        clearInterval(currentPollInterval);
                        await runProfileLedgerVerification(userEmailAddress, false, true); 
                        
                        submitDocBtn.style.display = 'none';
                        statusMessage.innerHTML = `
                            <div style="font-size:40px; margin-bottom:10px;">✅</div>
                            <div style="font-weight:900; color:#166534; font-size:18px;">Document Verified</div>
                            <div style="color:#111827; font-size:14px; margin-top:8px;"><strong>+48 SYNX Tokens</strong><br>Tokens will be credited after final approval.</div>
                        `;
                        showDetailedReason(reason, true);
                        retryUploadBtn.style.display = 'block'; 
                    } 
                    else if (status === 'rejected' || status === 'rejected_pii' || status === 'fraud' || status === 'duplicate') {
                        clearInterval(currentPollInterval);
                        
                        submitDocBtn.style.display = 'none';
                        statusMessage.innerHTML = '<span style="font-weight:800; font-size:16px; color:#9f1239;">❌ Verification Failed</span>';
                        showDetailedReason(reason, false); 
                        retryUploadBtn.style.display = 'block';
                    }
                }
                
                if (attempts >= maxAttempts) {
                    clearInterval(currentPollInterval);
                    statusMessage.innerHTML = '<span style="color:#ea580c; font-weight:700;">⚠️ AI timed out. Please try again.</span>';
                    submitDocBtn.disabled = false;
                    submitDocBtn.innerText = 'Approve & Submit to Waiting Room';
                    retryUploadBtn.style.display = 'block';
                }
            } catch (e) { console.error("Polling error", e); }
        }, 3000); 

      } else {
        const data = await response.json();
        statusMessage.innerHTML = `<span style="color:#ef4444;">❌ ${data.error || 'Upload failed.'}</span>`;
        submitDocBtn.disabled = false;
      }
    } catch (error) {
      statusMessage.innerHTML = '<span style="color:#ef4444;">⚠️ Network error. Could not connect to waiting room.</span>';
      submitDocBtn.disabled = false;
    }
  });
}
