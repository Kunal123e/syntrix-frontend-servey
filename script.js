// =========================================================================
// SYNTRIX CORE PLATFORM APPLICATION LOGIC ENGINE
// =========================================================================

// 🚀 INJECT PREMIUM AI ANIMATION CSS DYNAMICALLY
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes aiSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
.status-text-pulse { animation: textPulse 1.5s infinite; }
@keyframes textPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`;
document.head.appendChild(styleSheet);

const BACKEND_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:5000"
  : "https://syntrix-airdrop.onrender.com";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;
const DEFAULT_TIMEOUT_MS = 90000; 

// 🚀 QUALITY GATE: Start time tracker
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

// Splash Screen & App Shell Element Selectors
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

// Gateway & Document Selectors
const gatewayScreenSection = document.getElementById("gatewayScreenSection");
const documentModeSection = document.getElementById("documentModeSection");
const selfieModeSection = document.getElementById("selfieModeSection");

// Dashboard Selectors
const rewardDashboardScreen = document.getElementById("rewardDashboardScreen");
const tabScreenHub = document.getElementById("rewardDashboardScreen"); 
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

// 🚀 QR Code Element Selectors
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

// ================= SPLASH PAGE ISOLATED ROUTING =================
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

if (navGetStartedAction) {
  navGetStartedAction.addEventListener("click", () => {
    if (initializePlatformBtn) initializePlatformBtn.click();
  });
}

if (initializePlatformBtn) {
  initializePlatformBtn.addEventListener("click", () => {
    if(splashLandingGate) splashLandingGate.style.display = "none"; 
    if(mainApplicationLayout) {
        mainApplicationLayout.classList.remove("hidden");
        mainApplicationLayout.style.display = "flex"; 
    }
    
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      if (emailGateSection) {
          emailGateSection.style.display = "none";
          emailGateSection.classList.add("hidden");
      }
      runProfileLedgerVerification(userEmailAddress, false);
    } else {
      const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "gatewayScreenSection", "documentModeSection", "selfieModeSection"];
      dashboardCards.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = "none"; el.classList.add("hidden"); }
      });
      if (emailGateSection) {
          emailGateSection.classList.remove("hidden");
          emailGateSection.style.display = "flex";
      }
    }
  });
}

// ================= GATEWAY LOGIC =================
window.openMode = function(mode) {
  if (mode === 'survey' && window.hasCompletedSurvey) {
      showToast("✅ Survey already completed. Redirecting to Survey Matrix...", "✅");
      routeDashboardTabs('more-surveys');
      return; 
  }

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
    badgeCard.style.flexDirection = "column";
    badgeCard.style.background = "linear-gradient(180deg, rgba(20,20,25,1) 0%, rgba(9,9,11,1) 100%)";
    badgeCard.style.border = `1px solid ${profile.color}50`;
    badgeCard.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${profile.color}20`;
    badgeCard.style.borderRadius = "24px";
    badgeCard.style.padding = "35px 25px";
    badgeCard.style.marginBottom = "35px";
    badgeCard.style.alignItems = "center";
    badgeCard.style.textAlign = "center";
    badgeCard.style.color = "#ffffff";

    badgeCard.innerHTML = `
      <div class="persona-header-top" style="color: ${profile.color}; letter-spacing: 2px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px;">CONSUMER PERSONA UNLOCKED</div>
      <h2 class="persona-title-main" style="font-size: 36px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin: 0 0 4px 0;">${profile.title}</h2>
      <h4 class="persona-subtitle" style="font-size: 17px; font-weight: 600; color: #d1d5db; margin-bottom: 25px;">${profile.sub}</h4>
      <div class="persona-icon-wrapper" style="width: 120px; height: 120px; border-radius: 50%; border: 2px solid ${profile.color}60; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; background: radial-gradient(circle, ${profile.color}20 0%, transparent 70%); box-shadow: inset 0 0 20px ${profile.color}20, 0 0 20px ${profile.color}20; overflow: hidden;">
         ${profile.iconHTML}
      </div>
      <p class="persona-description" style="font-size: 15px; line-height: 1.7; color: #a1a1aa; margin: 0 0 30px 0; max-width: 650px;">${profile.desc}</p>
      <div class="persona-verified-badge" style="display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 14px 20px; width: 100%; max-width: 450px; text-align: left;">
        <div class="pv-icon" style="color: ${profile.color}; display: flex; align-items: center; justify-content: center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="pv-text" style="display: flex; flex-direction: column;">
          <strong style="font-size: 12px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">VERIFIED BY SYNTRIX AI</strong>
          <span style="font-size: 11px; color: #a1a1aa; font-weight: 500;">100% Authentic Analysis</span>
        </div>
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
  if (!clean.startsWith("SYN-")) {
    if (clean.startsWith("SYN")) clean = "SYN-" + clean.substring(3);
    else clean = "SYN-" + clean;
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

// ================= DASHBOARD APP TABS ROUTER =================
function routeDashboardTabs(targetTab) {
  const cards = [
    document.getElementById("rewardDashboardScreen"),
    document.getElementById("tabScreenBadge"),
    document.getElementById("tabScreenReferrals"),
    document.getElementById("tabScreenMoreSurveys"),
    document.getElementById("claimScreenSection"),
    document.getElementById("documentModeSection"),
    document.getElementById("selfieModeSection"),
    document.getElementById("gatewayScreenSection"),
    document.getElementById("claimForm"),
    document.getElementById("topProgressBox")
  ];
  
  cards.forEach(card => {
    if (card) {
      card.classList.add("hidden");
      card.style.display = "none";
    }
  });
  
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  const clickedBtn = document.querySelector(`[data-tab="${targetTab}"]`);
  if (clickedBtn) clickedBtn.classList.add("active");

  const mainSubtitle = document.getElementById("mainSubtitle"); 
  if(mainSubtitle) mainSubtitle.style.display = "block";

  if (targetTab === "hub") {
    const el = document.getElementById("rewardDashboardScreen");
    if(el) { el.classList.remove("hidden"); el.style.display = "block"; }
  }
  else if (targetTab === "badge") {
    const el = document.getElementById("tabScreenBadge");
    if(el) { el.classList.remove("hidden"); el.style.display = "block"; }
  }
  else if (targetTab === "referrals") {
    const el = document.getElementById("tabScreenReferrals");
    if(el) { el.classList.remove("hidden"); el.style.display = "block"; }
  }
  else if (targetTab === "more-surveys" || targetTab === "more") {
    const el = document.getElementById("tabScreenMoreSurveys");
    if(el) { el.classList.remove("hidden"); el.style.display = "block"; }
  }
  else if (targetTab === "document") {
    const el = document.getElementById("documentModeSection");
    if(el) { el.classList.remove("hidden"); el.style.display = "block"; }
    if(mainSubtitle) mainSubtitle.style.display = "none"; 
  }
  else if (targetTab === "selfie") {
    const el = document.getElementById("selfieModeSection");
    if(el) { el.classList.remove("hidden"); el.style.display = "block"; }
    if(mainSubtitle) mainSubtitle.style.display = "none"; 
  }
  else if (targetTab === "gateway") {
    const el = document.getElementById("gatewayScreenSection");
    if(el) { el.classList.remove("hidden"); el.style.display = "flex"; }
  }
  else if (targetTab === "survey") {
    const form = document.getElementById("claimForm");
    const progress = document.getElementById("topProgressBox");
    if(form) { form.classList.remove("hidden"); form.style.display = "block"; }
    if(progress) { progress.classList.remove("hidden"); progress.style.display = "block"; }
  }
}

// ================= STAGE 1: EMAIL VERIFICATION GATE =================
if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!gateEmailInput) return;

    const legalConsent = document.getElementById("legalConsent");
    if (legalConsent && !legalConsent.checked) {
      showToast("You must agree to the Legal Terms of Research to continue.", "⚖️");
      return;
    }
    
    if (legalConsent && legalConsent.checked && !legalConsentTimestamp) {
      legalConsentTimestamp = new Date().toISOString();
      clientUserAgent = navigator.userAgent;
    }
    
    const emailVal = gateEmailInput.value.trim().toLowerCase();
    
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
      showToast("Please input a valid email address.", "❌");
      if (statusDiv) { statusDiv.innerHTML = ""; }
      return;
    }

    if (!isOtpSent) {
      if (startSurveyBtn.disabled) return; 
      startSurveyBtn.disabled = true;
      const originalText = startSurveyBtn.innerHTML;
      startSurveyBtn.innerHTML = "⏳ Sending Code...";

      if (statusDiv) { statusDiv.innerHTML = "⏳ Generating secure token..."; statusDiv.style.color = "#57d6c2"; }
      
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
          if (otpSection) {
            otpSection.classList.remove("hidden");
            otpSection.style.display = "block";
          }
          startSurveyBtn.innerHTML = "Verify & Enter &rarr;";
          startSurveyBtn.disabled = false;
          gateEmailInput.readOnly = true; 
          
          if(legalConsent && legalConsent.parentElement) {
            legalConsent.parentElement.style.display = "none";
          }
          
          if (statusDiv) statusDiv.innerHTML = "";
        } else {
          showToast(result.error || "Failed to send code.", "❌");
          startSurveyBtn.disabled = false;
          startSurveyBtn.innerHTML = originalText;
          if (statusDiv) { statusDiv.innerHTML = ""; }
        }
      } catch (err) {
        showToast("Network error. Could not send code.", "❌");
        startSurveyBtn.disabled = false;
        startSurveyBtn.innerHTML = originalText;
        if (statusDiv) { statusDiv.innerHTML = ""; }
      }
      return; 
    }

    const gateOtpInput = document.getElementById("gateOtp");
    const rawOtpVal = gateOtpInput ? gateOtpInput.value : "";
    const otpVal = rawOtpVal.replace(/[\s-]/g, "");

    if (!otpVal || otpVal.length !== 6) {
      showToast("Please enter the 6-digit verification code.", "❌");
      if (statusDiv) { statusDiv.innerHTML = ""; }
      return;
    }

    if (startSurveyBtn.disabled) return;
    startSurveyBtn.disabled = true;
    const originalVerifyText = startSurveyBtn.innerHTML;
    startSurveyBtn.innerHTML = "⏳ Verifying...";

    if (statusDiv) { statusDiv.innerHTML = "⏳ Verifying code..."; statusDiv.style.color = "#57d6c2"; }

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
        startSurveyBtn.disabled = false;
        await runProfileLedgerVerification(emailVal, false);
      } else {
        showToast(result.error || "Invalid or expired code.", "❌");
        startSurveyBtn.disabled = false;
        startSurveyBtn.innerHTML = originalVerifyText;
        if (statusDiv) { statusDiv.innerHTML = ""; }
      }
    } catch (err) {
      showToast("Network error. Could not verify code.", "❌");
      startSurveyBtn.disabled = false;
      startSurveyBtn.innerHTML = originalVerifyText;
      if (statusDiv) { statusDiv.innerHTML = ""; }
    }
  });
}

function getSurveyData() { return typeof surveySections !== "undefined" ? surveySections : []; }

function getSectionTitle(section) {
  if (typeof sectionTranslations !== "undefined" && sectionTranslations[currentLanguage]) {
    return sectionTranslations[currentLanguage][section.title] || section.title;
  }
  return section.title || "";
}

function handleNextSection() {
  const sections = getSurveyData();
  if (!validateCurrentSectionAnswers()) {
    showToast(getUIText("validationRequired"), "⚠️");
    return;
  }
  if (currentSection < sections.length - 1) {
    currentSection++;
    renderSection();
    updateExcitementBanner(currentSection);
  }
}

function handlePrevSection() {
  if (currentSection > 0) {
    currentSection--;
    renderSection();
    updateExcitementBanner(currentSection);
  }
}

function getQuestionText(q) {
  if (typeof questionTranslations !== "undefined" && questionTranslations[currentLanguage]) {
    return questionTranslations[currentLanguage][q.id] || q.question || q.id;
  }
  return q.question || q.id;
}

function getOptionText(opt) {
  if (typeof optionTranslations !== "undefined" && optionTranslations[currentLanguage]) {
    return optionTranslations[currentLanguage][opt] || opt;
  }
  return opt;
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
    if (currentSection === 0) {
       surveyStartTime = Date.now(); 
    }

    if (topProgressBox) {
      topProgressBox.classList.remove("hidden");
      topProgressBox.style.display = "block";
    }
    if (claimForm) {
      claimForm.classList.remove("hidden");
      claimForm.style.display = "block";
    }
    if (emailGateSection) {
      emailGateSection.classList.add("hidden");
      emailGateSection.style.display = "none";
    }

    const progressPercent = ((currentSection + 1) / sections.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

    let htmlStr = `<div class="survey-section-card animate-fade-in">
      <h2 class="surveySectionTitle" style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 5px;">${getSectionTitle(currentData)}</h2>`;

    if (currentData && currentData.questions) {
        currentData.questions.forEach((q) => {
          const savedAnswer = answers[q.id] || "";
          htmlStr += `<div class="question-block" style="margin-top:30px; text-align:left;">
            <p class="questionText" style="font-weight:800; margin-bottom:16px; font-size:17px; color:#d1d5db;">${getQuestionText(q)}</p>
            <div class="options">`; 

          if (q.type === "textarea") {
               htmlStr += `<textarea id="${q.id}" placeholder="Type your answer here..." onchange="recordSelection('${q.id}', this.value)" style="width:100%; border:1px solid #3f3f46; border-radius:14px; padding:16px; font-size:15px; font-family:inherit; background: #18181b; color: #ffffff;">${savedAnswer}</textarea>`;
          } 
          else if (q.options && Array.isArray(q.options)) {
              q.options.forEach((opt) => {
                const isChecked = savedAnswer === opt ? "checked" : "";
                const isSelectedClass = savedAnswer === opt ? "selected" : ""; 
                htmlStr += `
                  <label class="option ${isSelectedClass}" style="display:inline-block; user-select:none; font-weight: 600;">
                    <input type="radio" name="${q.id}" value="${opt}" ${isChecked} style="display:none;" onchange="recordSelection('${q.id}', this.value)">
                    <span class="optionText">${getOptionText(opt)}</span>
                  </label>`;
              });
          }
          htmlStr += `</div></div>`;
        });
    }

    htmlStr += `</div>`;
    surveyContainer.innerHTML = htmlStr;

    if (prevBtn) {
      if(currentSection === 0) {
        prevBtn.style.visibility = "hidden";
        prevBtn.style.display = "none";
      } else {
        prevBtn.style.visibility = "visible";
        prevBtn.style.display = "block";
      }
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
    console.error(err);
  }
}

window.recordSelection = function(questionId, selectedValue) {
  answers[questionId] = selectedValue;
  renderSection();
};

function updateExcitementBanner(sectionIndex) {
  const banner = document.getElementById("excitementBanner");
  if (!banner) return;
  if (sectionIndex === 0) { banner.style.display = "none"; return; }

  const unlockedTokens = sectionIndex * 8;
  const totalTokens = 48;
  
  banner.style.display = "flex";
  banner.style.animation = 'none'; banner.offsetHeight; banner.style.animation = 'slideDown 0.5s ease-out';

  if (currentLanguage === "hi") {
      if (sectionIndex < 5) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">शानदार! आपने अब तक <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">अगला मॉड्यूल पूरा करें Aur <strong style="color: #fbbf24;">8 Aur Paayein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">जारी रखें & दावा करें &gt;</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">अविश्वसनीय! आपने सभी <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">दावा करने के लिए नीचे सबमिट पर क्लिक करें!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 48 / 48 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">दावा करने के लिए तैयार</div></div>`;
      }
  } else if (currentLanguage === "hinglish") {
      if (sectionIndex < 5) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! Aapne ab tak <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> secure kar liye hain!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Next module complete karein aur <strong style="color: #fbbf24;">8 more payein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Continue & Claim &gt;</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! Aapne sabhi <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span> secure kar liye hain!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Neeche Submit button par click karke claim karein!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 48 / 48 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Ready to Claim</div></div>`;
      }
  } else {
      if (sectionIndex < 5) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! You've secured <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> so far!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Complete the next module to claim <strong style="color: #fbbf24;">8 more!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Continue & Claim &gt;</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! You've secured all <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span>!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Hit Submit below to transfer them to your wallet!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 48 / 48 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Ready to Claim</div></div>`;
      }
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
        window.hasCompletedSurvey = true; 
        displayConsumerBadgesUI(statusResult.badge || "Analyzer");

        if (!isBackgroundSync) {
            if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
            if (claimForm) { claimForm.classList.add("hidden"); claimForm.style.display = "none"; }
            if (topProgressBox) { topProgressBox.classList.add("hidden"); topProgressBox.style.display = "none"; }
            if (gatewayScreenSection) { gatewayScreenSection.classList.add("hidden"); gatewayScreenSection.style.display = "none"; }
            if (documentModeSection) { documentModeSection.classList.add("hidden"); documentModeSection.style.display = "none"; }
            if (selfieModeSection) { selfieModeSection.classList.add("hidden"); selfieModeSection.style.display = "none"; }
            
            const tabLinksContainer = document.getElementById("dashboardTabLinks");
            if (tabLinksContainer) { tabLinksContainer.classList.remove("hidden"); tabLinksContainer.style.display = "flex"; }
            
            routeDashboardTabs("badge");
        }
        if (!isBackgroundSync) outputTarget.innerHTML = "";
      } else {
        window.hasCompletedSurvey = false; 
        const menuPsychologyBadgeWrapper = document.getElementById("menuPsychologyBadgeWrapper");
        if (menuPsychologyBadgeWrapper) menuPsychologyBadgeWrapper.style.display = "none";

        if (!isBackgroundSync) {
            if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
            
            const cards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "claimForm", "topProgressBox", "documentModeSection", "selfieModeSection"];
            cards.forEach(id => {
              const el = document.getElementById(id);
              if (el) { el.classList.add("hidden"); el.style.display = "none"; }
            });
            
            const tabLinksContainer = document.getElementById("dashboardTabLinks");
            if (tabLinksContainer) { tabLinksContainer.classList.add("hidden"); tabLinksContainer.style.display = "none"; }

            routeDashboardTabs("gateway");
            outputTarget.innerHTML = "";
        }
      }
    } else {
      if (!isFromModal) {
        if (!isBackgroundSync) {
            if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
            const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "claimForm", "topProgressBox", "documentModeSection", "selfieModeSection"];
            dashboardCards.forEach(id => {
              const el = document.getElementById(id);
              if (el) { el.style.display = "none"; el.classList.add("hidden"); }
            });
            const tabLinksContainer = document.getElementById("dashboardTabLinks");
            if (tabLinksContainer) { tabLinksContainer.classList.add("hidden"); tabLinksContainer.style.display = "none"; }
            
            routeDashboardTabs("gateway");
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
    "question_1_id": {
      "I compare all the data and reviews": "Analyzer",
      "I care about how beautiful it looks": "Stylist",
      "I only buy if there is a safe warranty": "Hedger",
      "I buy what my friends recommend": "Native"
    },
    "question_2_id": {
      "Logic and numbers": "Analyzer",
      "Aesthetics and vibe": "Stylist",
      "Safety and guarantees": "Hedger",
      "Community and trust": "Native"
    }
  };
  for (const [qId, selectedAnswer] of Object.entries(answersObj)) {
    if (mapping[qId] && mapping[qId][selectedAnswer]) {
      const persona = mapping[qId][selectedAnswer];
      scores[persona]++;
    }
  }
  let topBadge = "Analyzer";
  let maxScore = -1;
  for (const [badge, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topBadge = badge;
    }
  }
  return topBadge;
}

async function handleSurveySubmission(e) {
  if (e) e.preventDefault();

  if ((Date.now() - surveyStartTime) < QUALITY_THRESHOLD_MS) {
    showToast("Please take more time to read the questions carefully.", "⏱️");
    return;
  }

  if (!validateCurrentSectionAnswers()) {
    showToast(getUIText("validationRequired"), "⚠️");
    return;
  }

  if (claimForm) { claimForm.classList.add("hidden"); claimForm.style.display = "none"; }
  
  const excitementBanner = document.getElementById("excitementBanner");
  if(excitementBanner) excitementBanner.style.display = "none";

  const animOverlay = document.getElementById("rewardAnimationOverlay");
  if (animOverlay) animOverlay.style.display = "flex";

  const referralCodeUsed = localStorage.getItem("referralCode") || "";

  const finalPayload = {
    email: userEmailAddress,
    answers: answers,
    referredBy: referralCodeUsed,
    legal_consent: true,
    consent_timestamp: legalConsentTimestamp || new Date().toISOString(),
    user_agent: clientUserAgent || navigator.userAgent,
    startTime: surveyStartTime, 
    submissionTime: Date.now(),
    assignedBadge: determinePersonaBadge(answers)
  };

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/submit-survey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload)
    });

    const result = await response.json();
    
    setTimeout(async () => {
      if (animOverlay) animOverlay.style.display = "none";
      if (result.success) {
        if (statusDiv) statusDiv.innerHTML = "";
        window.hasCompletedSurvey = true; 
        await runProfileLedgerVerification(userEmailAddress, false);
      } else {
        if (claimForm) { claimForm.classList.remove("hidden"); claimForm.style.display = "block"; }
        showToast(`${result.error || "Submission rejected by registry backend."}`, "❌");
      }
    }, 3500);
  } catch (err) {
    if (animOverlay) animOverlay.style.display = "none";
    if (claimForm) { claimForm.classList.remove("hidden"); claimForm.style.display = "block"; }
    showToast("Network transaction failed.", "❌");
  }
}

function translatePage() {
  if (typeof translations === "undefined" || !translations[currentLanguage]) return;
  const dict = translations[currentLanguage];

  const mainTitleEl = document.getElementById("mainTitle");
  const mainSubtitleEl = document.getElementById("mainSubtitle");
  if (mainTitleEl && dict.mainTitle) mainTitleEl.innerHTML = dict.mainTitle;
  if (mainSubtitleEl && dict.mainSubtitle) mainSubtitleEl.innerHTML = dict.mainSubtitle;

  const emailSectionTitleEl = document.querySelector("#emailGateSection .sectionTitle");
  if (emailSectionTitleEl && dict.emailSectionTitle) emailSectionTitleEl.innerText = dict.emailSectionTitle;
  
  const startSurveyBtnEl = document.getElementById("startSurveyBtn");
  if (startSurveyBtnEl && dict.btnStart) startSurveyBtnEl.innerHTML = dict.btnStart;

  const prevBtnEl = document.getElementById("prevBtn");
  const nextBtnEl = document.getElementById("nextBtn");
  const submitClaimBtnEl = document.getElementById("submitClaimBtn");
  if (prevBtnEl && dict.previous) prevBtnEl.innerHTML = `&lt; ${dict.previous}`;
  if (nextBtnEl && dict.next) nextBtnEl.innerHTML = `${dict.next} &gt;`;
  if (submitClaimBtnEl && dict.submit) submitClaimBtnEl.innerHTML = dict.submit;

  const rewardTitleEl = document.getElementById("claimTitle");
  const rewardSubtitleEl = document.getElementById("rewardSubtitleDesc");
  if (rewardTitleEl && dict.claimTitle) rewardTitleEl.innerHTML = dict.claimTitle;
  if (rewardSubtitleEl && dict.rewardSubtitle) rewardSubtitleEl.innerHTML = dict.rewardSubtitle;

  const connectWalletBtnEl = document.querySelector("#connectWalletBtn span");
  if (connectWalletBtnEl && dict.metaMaskLabel) connectWalletBtnEl.innerText = dict.metaMaskLabel;
  
  const manualLabelEl = document.querySelector(".manualWalletWrapper .dividerLine span");
  if (manualLabelEl && dict.manualLabel) manualLabelEl.innerText = dict.manualLabel;
  
  const executeClaimBtnEl = document.getElementById("executeClaimBtn");
  if (executeClaimBtnEl && dict.btnExecute) executeClaimBtnEl.innerText = dict.btnExecute;
  
  const referralTitleEl = document.querySelector(".referralContainer .dividerLine span");
  if (referralTitleEl && dict.referralTitle) referralTitleEl.innerText = dict.referralTitle;

  const referralDescriptionEl = document.getElementById("referralSubText");
  if (referralDescriptionEl && dict.referralSub) referralDescriptionEl.innerHTML = dict.referralSub;
  
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

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email");
  localStorage.removeItem("referralCode");
  
  if (statusDiv) statusDiv.innerHTML = "";
  
  userEmailAddress = "";
  currentSection = 0;
  isOtpSent = false;
  legalConsentTimestamp = "";
  clientUserAgent = ""; 
  window.hasCompletedSurvey = false;
  
  const otpSection = document.getElementById("otpSection");
  if (otpSection) {
      otpSection.classList.add("hidden");
      otpSection.style.display = "none";
  }
  
  if (startSurveyBtn) startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
  if (gateEmailInput) gateEmailInput.readOnly = false;
  
  for (const prop in answers) {
      if (Object.prototype.hasOwnProperty.call(answers, prop)) {
          delete answers[prop];
      }
  }
  
  if (emailGateSection) {
      emailGateSection.classList.remove("hidden");
      emailGateSection.style.display = "flex";
  }
  
  const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys", "claimScreenSection", "gatewayScreenSection", "documentModeSection", "selfieModeSection"];
  dashboardCards.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add("hidden"); el.style.display = "none"; }
  });

  if (claimForm) {
      claimForm.classList.add("hidden");
      claimForm.style.display = "none";
  }
  if (topProgressBox) {
      topProgressBox.classList.add("hidden");
      topProgressBox.style.display = "none";
  }
  
  const tabLinksContainer = document.getElementById("dashboardTabLinks");
  if (tabLinksContainer) {
      tabLinksContainer.classList.add("hidden");
      tabLinksContainer.style.display = "none";
  }
  
  const menuReferralWrapper = document.getElementById("menuReferralWrapper");
  if (menuReferralWrapper) menuReferralWrapper.style.display = "none";
  
  if (mainApplicationLayout) {
      mainApplicationLayout.classList.add("hidden");
      mainApplicationLayout.style.display = "none";
  }
  if (splashLandingGate) {
      splashLandingGate.style.display = "flex";
  }
  routeSplashNavViews("home");
  showToast("Account profiles successfully signed out.", "✓");
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
  if (savedRefCode && referredByCodeInput) referredByCodeInput.value = savedRefCode;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = e.target.dataset.tab;
      if (target) {
        if (target === 'survey' && window.hasCompletedSurvey) {
            showToast("✅ Survey already completed. Redirecting to Survey Matrix...", "✅");
            routeDashboardTabs('more-surveys');
        } else {
            routeDashboardTabs(target);
        }
        if(optionsPopover) {
          optionsPopover.classList.add("hidden");
          optionsPopover.style.display = "none";
        }
      }
    });
  });

  if (claimToken) {
    if (emailGateSection) { emailGateSection.classList.add("hidden"); emailGateSection.style.display = "none"; }
    if (claimForm) { claimForm.classList.add("hidden"); claimForm.style.display = "none"; }
    if (topProgressBox) { topProgressBox.classList.add("hidden"); topProgressBox.style.display = "none"; }
    if (gatewayScreenSection) { gatewayScreenSection.classList.add("hidden"); gatewayScreenSection.style.display = "none"; }
    if (documentModeSection) { documentModeSection.classList.add("hidden"); documentModeSection.style.display = "none"; }
    if (selfieModeSection) { selfieModeSection.classList.add("hidden"); selfieModeSection.style.display = "none"; }
    
    const dashboardCards = ["rewardDashboardScreen", "tabScreenBadge", "tabScreenReferrals", "tabScreenMoreSurveys"];
    dashboardCards.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.add("hidden"); el.style.display = "none"; }
    });
  } else {
    if (splashLandingGate) {
        splashLandingGate.style.display = "flex";
    }
    if (mainApplicationLayout) {
        mainApplicationLayout.style.display = "none";
        mainApplicationLayout.classList.add("hidden");
    }
    routeSplashNavViews("home");
  }

  if (nextBtn) nextBtn.onclick = () => handleNextSection();
  if (prevBtn) prevBtn.onclick = () => handlePrevSection();
  if (claimForm) {
    claimForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSurveySubmission(e);
    });
  }
  
  if (connectWalletBtn) connectWalletBtn.addEventListener("click", interceptClaimGateActions);
  if (claimConnectWalletBtn) claimConnectWalletBtn.addEventListener("click", interceptClaimGateActions);
  if (executeClaimBtn) executeClaimBtn.addEventListener("click", interceptClaimGateActions);
  if (submitClaimRewardBtn) submitClaimRewardBtn.addEventListener("click", interceptClaimGateActions);
  
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", () => resetApplicationFlowState());
  
  if (copyReferralBtn) {
      copyReferralBtn.onclick = () => {
        if (!referralCodeDisplay) return;
        referralCodeDisplay.select(); 
        referralCodeDisplay.setSelectionRange(0, 99999);
        try {
          navigator.clipboard.writeText(referralCodeDisplay.value);
          const originalText = copyReferralBtn.innerText; 
          copyReferralBtn.innerText = "Copied! ✓";
          setTimeout(() => { copyReferralBtn.innerText = originalText; }, 2000);
        } catch (err) { showToast("Failed to access system registers.", "❌"); }
      }
  }

  if (generateQrBtn) {
    generateQrBtn.addEventListener("click", () => {
      const shopRefCode = localStorage.getItem("referralCode");
      if (!shopRefCode) {
        showToast("Referral link not found. Please log in to your shop account.", "❌");
        return;
      }
      
      qrCodeWrapper.style.display = "flex";
      qrCodeCanvas.innerHTML = "";
      
      const dynamicQrLink = `${BACKEND_URL}/r/${shopRefCode}`;
      
      new QRCode(qrCodeCanvas, {
        text: dynamicQrLink,
        width: 256,
        height: 256,
        colorDark: "#111827",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      qrCodeWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast("Shop QR Code generated!", "✅");
    });
  }

  if (downloadQrBtn) {
    downloadQrBtn.addEventListener("click", () => {
      const originalCanvas = qrCodeCanvas.querySelector("canvas");

      if (!originalCanvas) {
        showToast("Please generate the QR code first.", "❌");
        return;
      }

      const padding = 24; 
      const paddedCanvas = document.createElement("canvas");
      paddedCanvas.width = originalCanvas.width + (padding * 2);
      paddedCanvas.height = originalCanvas.height + (padding * 2);
      
      const ctx = paddedCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
      ctx.drawImage(originalCanvas, padding, padding);

      const downloadUrl = paddedCanvas.toDataURL("image/png");
      
      const tempLink = document.createElement("a");
      tempLink.href = downloadUrl;
      tempLink.download = "Syntrix_Dealer_QR.png";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      showToast("QR Code saved to gallery!", "✅");
    });
  }

  const menuCopyReferralBtn = document.getElementById("menuCopyReferralBtn");
  const menuReferralInputDisplay = document.getElementById("menuReferralInputDisplay");
  if (menuCopyReferralBtn && menuReferralInputDisplay) {
    menuCopyReferralBtn.onclick = (e) => {
      e.stopPropagation();
      const refLink = menuReferralInputDisplay.value;
      if (refLink) {
        navigator.clipboard.writeText(refLink);
        menuCopyReferralBtn.innerText = "Copied!";
        menuCopyReferralBtn.style.background = "#10b981";
        setTimeout(() => { 
            menuCopyReferralBtn.innerText = "Copy"; 
            menuCopyReferralBtn.style.background = "#111827";
        }, 2000);
      }
    };
  }

  if (menuToggleBtn && optionsPopover) {
    menuToggleBtn.onclick = (e) => { 
        e.stopPropagation(); 
        optionsPopover.classList.toggle("hidden"); 
        if(optionsPopover.style.display === "none" || optionsPopover.style.display === "") {
            optionsPopover.style.display = "block";
        } else {
            optionsPopover.style.display = "none";
        }
    };
    document.addEventListener("click", (e) => {
        if(optionsPopover && !optionsPopover.contains(e.target) && e.target !== menuToggleBtn) {
          optionsPopover.classList.add("hidden");
          optionsPopover.style.display = "none";
        }
    });
  }

  if (menuRestartBtn) {
    menuRestartBtn.onclick = () => { 
      if(optionsPopover) {
          optionsPopover.classList.add("hidden"); 
          optionsPopover.style.display = "none";
      }
      if(confirmRestartModal) {
          confirmRestartModal.classList.remove("hidden"); 
          confirmRestartModal.style.display = "flex";
      }
    };
  }
  if (cancelRestartBtn) {
    cancelRestartBtn.onclick = () => {
      if(confirmRestartModal) {
          confirmRestartModal.classList.add("hidden");
          confirmRestartModal.style.display = "none";
      }
    };
  }
  if (confirmRestartBtn) {
    confirmRestartBtn.onclick = () => {
      if(confirmRestartModal) {
          confirmRestartModal.classList.add("hidden");
          confirmRestartModal.style.display = "none";
      }
      resetApplicationFlowState();
    };
  }

  if (menuRecoverBtn && retrieveModal) {
    menuRecoverBtn.onclick = () => {
      if(optionsPopover) {
          optionsPopover.classList.add("hidden"); 
          optionsPopover.style.display = "none";
      }
      retrieveModal.classList.remove("hidden");
      retrieveModal.style.display = "flex";
      if (modalEmailInput) modalEmailInput.value = ""; 
      if (modalStatus) modalStatus.innerHTML = "";
      
      if (confirmRetrieveBtn) {
        confirmRetrieveBtn.onclick = async () => {
          const searchEmail = modalEmailInput ? modalEmailInput.value.trim().toLowerCase() : "";
          if (!searchEmail || !EMAIL_REGEX.test(searchEmail)) {
            showToast("Please provide a valid email structure.", "❌");
            return;
          }
          if (splashLandingGate) splashLandingGate.style.display = "none";
          if (mainApplicationLayout) {
              mainApplicationLayout.classList.remove("hidden");
              mainApplicationLayout.style.display = "flex";
          }
          
          const originalText = confirmRetrieveBtn.innerText;
          confirmRetrieveBtn.innerText = "Searching...";
          confirmRetrieveBtn.disabled = true;
          
          await runProfileLedgerVerification(searchEmail, true);
          
          confirmRetrieveBtn.innerText = originalText;
          confirmRetrieveBtn.disabled = false;
        };
      }
    };
  }

  if (closeModalBtn) closeModalBtn.onclick = () => dismissModal();
  if (cancelModalBtn) cancelModalBtn.onclick = () => dismissModal();

  const langButtons = document.querySelectorAll(".langBtn");
  langButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      langButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active"); currentLanguage = btn.dataset.lang;
      if (typeof translatePage === "function") translatePage();
      updateExcitementBanner(currentSection); 
      if (claimForm && claimForm.style.display !== "none") renderSection();
    });
  });
});

// ================= DOCUMENT MODE API LOGIC =================
const taskTypeSelect = document.getElementById('taskType');
const fileInputCamera = document.getElementById('fileInputCamera');
const fileInputGallery = document.getElementById('fileInputGallery');
const fileInputSelfie = document.getElementById('fileInputSelfie'); 
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');

const submitDocBtn = document.getElementById('submitDocBtn');
const submitSelfieBtn = document.getElementById('submitSelfieBtn'); 

const statusMessage = document.getElementById('statusMessage');
const detailedReasonBox = document.getElementById('detailedReasonBox');
const retryUploadBtn = document.getElementById('retryUploadBtn');

const statusMessageSelfie = document.getElementById('statusMessageSelfie');
const detailedReasonBoxSelfie = document.getElementById('detailedReasonBoxSelfie');
const retryUploadBtnSelfie = document.getElementById('retryUploadBtnSelfie');

let selectedFile = null;
let currentPollInterval = null;
let isUploadingSelfie = false;

window.resetUploadState = function(keepInputs = false) {
    if (!keepInputs) {
      selectedFile = null;
      if (fileInputCamera) fileInputCamera.value = '';
      if (fileInputGallery) fileInputGallery.value = '';
      if (fileInputSelfie) fileInputSelfie.value = '';
      
      if (previewContainer) {
          previewContainer.style.display = 'none';
          previewContainer.classList.add('hidden'); 
      }
      if (imagePreview) {
          imagePreview.src = '';
          imagePreview.classList.add('hidden'); 
      }
      
      const selfieImg = document.getElementById('selfieResultImg');
      if (selfieImg) {
          selfieImg.src = '';
          selfieImg.classList.add('hidden');
          selfieImg.style.display = 'none';
      }

      const scannerOuter = document.querySelector('.scanner-circle-outer');
      const scannerInner = document.querySelector('.scanner-circle-inner');
      if (scannerOuter) scannerOuter.style.display = 'flex';
      if (scannerInner) scannerInner.style.display = 'flex';

      const btnSelfieTextContent = document.getElementById('btnSelfieTextContent');
      if (btnSelfieTextContent) {
          btnSelfieTextContent.innerText = "Take a Photo";
      }

      const clearSelfieBtn = document.getElementById('clearSelfieBtn');
      if (clearSelfieBtn) clearSelfieBtn.style.display = 'none';
    }
    
    if (submitDocBtn) {
        submitDocBtn.disabled = true;
        submitDocBtn.innerText = 'Approve & Submit to Waiting Room';
        submitDocBtn.classList.remove('hidden');
        submitDocBtn.style.display = 'flex'; 
    }

    if (submitSelfieBtn) {
        submitSelfieBtn.disabled = true;
        submitSelfieBtn.innerText = 'Verify & Submit to Waiting Room';
        submitSelfieBtn.classList.remove('hidden');
        submitSelfieBtn.style.display = 'flex'; 
    }
    
    if (statusMessage) {
        statusMessage.innerHTML = '';
        statusMessage.className = 'status-message'; 
    }
    if (statusMessageSelfie) {
        statusMessageSelfie.innerHTML = '';
        statusMessageSelfie.className = 'status-message'; 
    }
    
    if (detailedReasonBox) {
        detailedReasonBox.style.display = 'none';
        detailedReasonBox.classList.add('hidden');
        detailedReasonBox.innerText = '';
        detailedReasonBox.className = 'dynamic-reason-box';
    }
    if (detailedReasonBoxSelfie) {
        detailedReasonBoxSelfie.style.display = 'none';
        detailedReasonBoxSelfie.classList.add('hidden');
        detailedReasonBoxSelfie.innerText = '';
        detailedReasonBoxSelfie.className = 'dynamic-reason-box';
    }
    
    if (retryUploadBtn) {
        retryUploadBtn.style.display = 'none';
        retryUploadBtn.classList.add('hidden');
    }
    if (retryUploadBtnSelfie) {
        retryUploadBtnSelfie.style.display = 'none';
        retryUploadBtnSelfie.classList.add('hidden');
    }
    
    if (currentPollInterval) clearInterval(currentPollInterval);
};

if (retryUploadBtn) {
    retryUploadBtn.addEventListener('click', () => resetUploadState(false));
}
if (retryUploadBtnSelfie) {
    retryUploadBtnSelfie.addEventListener('click', () => resetUploadState(false));
}

function handleFileSelection(e) {
  if (e.target.files && e.target.files.length > 0) {
    const newFile = e.target.files[0];
    resetUploadState(true); 
    selectedFile = newFile;
    
    const isSelfieUpload = e.target.id === 'fileInputSelfie';
    isUploadingSelfie = isSelfieUpload;

    if (isSelfieUpload) {
        if (submitSelfieBtn) {
            submitSelfieBtn.disabled = false;
            submitSelfieBtn.classList.remove('hidden');
        }
        const btnSelfieTextContent = document.getElementById('btnSelfieTextContent');
        if (btnSelfieTextContent) {
            btnSelfieTextContent.innerText = "Retake Photo";
        }
    } else {
        if (submitDocBtn) {
            submitDocBtn.disabled = false;
            submitDocBtn.classList.remove('hidden'); 
            submitDocBtn.style.display = 'flex';
        }
    }
    
    try {
      const url = URL.createObjectURL(selectedFile);
      
      if (isSelfieUpload) {
          const scannerOuter = document.querySelector('.scanner-circle-outer');
          const scannerInner = document.querySelector('.scanner-circle-inner');
          if (scannerOuter) scannerOuter.style.display = 'none';
          if (scannerInner) scannerInner.style.display = 'none';
          
          let selfieImg = document.getElementById('selfieResultImg');
          if (!selfieImg) {
              const container = document.querySelector('.selfie-scanner-container');
              if (container) {
                  selfieImg = document.createElement('img');
                  selfieImg.id = 'selfieResultImg';
                  selfieImg.style.maxWidth = '100%';
                  selfieImg.style.maxHeight = '260px';
                  selfieImg.style.borderRadius = '12px';
                  selfieImg.style.objectFit = 'contain';
                  selfieImg.style.position = 'relative';
                  selfieImg.style.zIndex = '10';
                  container.appendChild(selfieImg);
              }
          }
          if (selfieImg) {
              selfieImg.src = url;
              selfieImg.classList.remove('hidden');
              selfieImg.style.display = 'block';
          }

          const clearSelfieBtn = document.getElementById('clearSelfieBtn');
          if (clearSelfieBtn) {
              clearSelfieBtn.style.display = 'flex';
          }
      } else {
          if (imagePreview) {
              imagePreview.src = url;
              imagePreview.classList.remove('hidden'); 
              imagePreview.style.display = 'block';
          }
          if (previewContainer) {
              previewContainer.classList.remove('hidden'); 
              previewContainer.style.display = 'flex';
          }
      }
    } catch(err) {
      console.error("Preview generation failed:", err);
    }
  }
}

if (fileInputCamera) fileInputCamera.addEventListener('change', handleFileSelection);
if (fileInputGallery) fileInputGallery.addEventListener('change', handleFileSelection);
if (fileInputSelfie) fileInputSelfie.addEventListener('change', handleFileSelection);

function compressImageForBackend(file, maxWidth = 500, quality = 0.4) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality)); 
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

function updateProgressUI(stepText, percent, targetMsgBox) {
    if (!targetMsgBox) return;
    targetMsgBox.innerHTML = `
      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 20px; text-align: center; margin-top: 10px;">
          <div style="display: flex; justify-content: center; margin-bottom: 15px;">
              <div style="width: 40px; height: 40px; border: 3px solid rgba(99, 102, 241, 0.2); border-top-color: #6366f1; border-radius: 50%; animation: aiSpin 1s linear infinite;"></div>
          </div>
          <div style="font-size:12px; color:#a1a1aa; font-weight:700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">AI Processing Pipeline</div>
          <div style="background:#09090b; height:6px; border-radius:4px; overflow:hidden; margin-bottom:15px; border: 1px solid #27272a;">
             <div style="width: ${percent}%; background: linear-gradient(90deg, #6366f1, #a855f7); height:100%; transition: width 0.4s ease; box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);"></div>
          </div>
          <div style="font-weight:800; color:#f4f4f5; font-size:15px;" class="status-text-pulse">${stepText}</div>
      </div>
    `;
}

async function executeUploadLogic(e) {
    const isSelfieSubmit = (e.target && e.target.id === 'submitSelfieBtn') || (this.id === 'submitSelfieBtn');
    const activeStatusMsg = isSelfieSubmit ? statusMessageSelfie : statusMessage;
    const activeReasonBox = isSelfieSubmit ? detailedReasonBoxSelfie : detailedReasonBox;
    const activeRetryBtn = isSelfieSubmit ? retryUploadBtnSelfie : retryUploadBtn;

    if (!selectedFile || !userEmailAddress) { 
      if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ef4444;">⚠️ Please select a file and ensure you are logged in.</span>';
      return;
    }

    const taskType = isSelfieSubmit ? 'selfie' : (taskTypeSelect ? taskTypeSelect.value : 'notes');
    let contentTags = [];
    
    if (taskType === 'notes') {
      const consentSensitive = document.getElementById('consentSensitive');
      const consentCommercial = document.getElementById('consentCommercial');
      if (consentSensitive && !consentSensitive.checked || consentCommercial && !consentCommercial.checked) { 
          if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ef4444;">⚠️ You must agree to the Legal Consents before uploading.</span>';
          return; 
      }
      const docLanguageInput = document.getElementById('docLanguageInput');
      if (docLanguageInput && docLanguageInput.value.trim() === "") { 
          if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ef4444;">⚠️ Please specify the language used in the notes.</span>';
          return; 
      }
      const tagCheckboxes = document.querySelectorAll('.doc-tag:checked');
      tagCheckboxes.forEach(cb => contentTags.push(cb.value));
      if (contentTags.length === 0) { 
          if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ef4444;">⚠️ Please select at least one content tag.</span>';
          return; 
      }
    } else if (taskType === 'selfie') {
      const consentAgeSelfie = document.getElementById('consentAgeSelfie');
      const consentSensitiveSelfie = document.getElementById('consentSensitiveSelfie');
      const consentCommercialSelfie = document.getElementById('consentCommercialSelfie');
      
      if ((consentAgeSelfie && !consentAgeSelfie.checked) || 
          (consentSensitiveSelfie && !consentSensitiveSelfie.checked) || 
          (consentCommercialSelfie && !consentCommercialSelfie.checked)) {
          if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ef4444;">⚠️ You must agree to the Legal Consents before uploading.</span>';
          return; 
      }
    }

    if (submitDocBtn) submitDocBtn.disabled = true;
    if (submitSelfieBtn) submitSelfieBtn.disabled = true;

    updateProgressUI('📤 Compressing and securing payload...', 15, activeStatusMsg);

    try {
      const base64String = await compressImageForBackend(selectedFile, 500, 0.4);
      const payload = {
        email: userEmailAddress,
        userEmail: userEmailAddress, 
        taskType: taskType, 
        fileName: selectedFile.name || 'capture.jpg', 
        imageBase64: base64String,
        contentTags: contentTags.length > 0 ? contentTags : ['none']
      };

      const response = await fetch(`${BACKEND_URL}/api/upload-task`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMsg = 'Upload rejected by server.';
        try {
            const data = await response.json();
            errorMsg = data.error || data.message || `Server blocked request (Status ${response.status})`;
        } catch(err) {
            errorMsg = `Backend Firewall Blocked Request (Status ${response.status}). Payload might be too large.`;
        }
        if (activeStatusMsg) activeStatusMsg.innerHTML = `<span style="color:#ef4444;">❌ <strong>${errorMsg}</strong></span>`;
        if (submitDocBtn) submitDocBtn.disabled = false;
        if (submitSelfieBtn) submitSelfieBtn.disabled = false;
        return;
      }

      let attempts = 0;
      const maxAttempts = 15;
      updateProgressUI('🤖 AI is verifying parameters...', 35, activeStatusMsg);

      currentPollInterval = setInterval(async () => {
          attempts++;
          if(attempts === 2) updateProgressUI('📄 Analyzing vectors and embeddings...', 60, activeStatusMsg);
          if(attempts === 5) updateProgressUI('🔐 Security & anti-spoofing verification...', 85, activeStatusMsg);

          try {
              const res = await fetch(`${BACKEND_URL}/api/check-submission?email=${encodeURIComponent(userEmailAddress)}`);
              const checkData = await res.json();
              
              if (checkData.success && checkData.submission) {
                  const status = checkData.submission.status;
                  const reason = checkData.submission.reason || "System processing error.";
                  
                  if (status === 'verified' || status === 'approved') {
                      clearInterval(currentPollInterval);
                      await runProfileLedgerVerification(userEmailAddress, false, true); 
                      
                      if (submitDocBtn) submitDocBtn.style.display = 'none';
                      if (submitSelfieBtn) submitSelfieBtn.style.display = 'none';
                      
                      const cleanReason = reason.split('|')[0].trim();
                      
                      if (activeStatusMsg) {
                          activeStatusMsg.innerHTML = `
                              <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 25px 20px; text-align: center; animation: slideUpFade 0.5s ease-out; margin-top: 15px;">
                                  <div style="width: 56px; height: 56px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);">
                                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  </div>
                                  <div style="font-weight: 900; color: #10b981; font-size: 20px; margin-bottom: 5px; letter-spacing: -0.5px;">VERIFICATION SUCCESSFUL</div>
                                  <div style="color: #a1a1aa; font-size: 14px; margin-bottom: 20px;">${cleanReason}</div>
                                  <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 12px; display: inline-block;">
                                      <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">+48 SYNX</span>
                                      <span style="color: #71717a; font-size: 11px; display: block; margin-top: 3px; font-weight: 600; text-transform: uppercase;">Tokens Assigned to Ledger</span>
                                  </div>
                              </div>
                          `;
                      }
                      if(activeReasonBox) activeReasonBox.style.display = 'none'; 
                      if (activeRetryBtn) activeRetryBtn.style.display = 'block'; 
                  } 
                  else if (status === 'rejected' || status === 'rejected_pii' || status === 'fraud' || status === 'duplicate') {
                      clearInterval(currentPollInterval);
                      
                      if (submitDocBtn) submitDocBtn.style.display = 'none';
                      if (submitSelfieBtn) submitSelfieBtn.style.display = 'none';
                      
                      if (activeStatusMsg) {
                          activeStatusMsg.innerHTML = `
                              <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 16px; padding: 25px 20px; text-align: center; animation: slideUpFade 0.5s ease-out; margin-top: 15px;">
                                  <div style="width: 56px; height: 56px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);">
                                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  </div>
                                  <div style="font-weight: 900; color: #ef4444; font-size: 20px; margin-bottom: 5px; letter-spacing: -0.5px;">VERIFICATION FAILED</div>
                                  <div style="color: #fca5a5; font-size: 14px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 8px; margin-top: 15px;">${reason}</div>
                              </div>
                          `;
                      }
                      if(activeReasonBox) activeReasonBox.style.display = 'none';
                      if (activeRetryBtn) activeRetryBtn.style.display = 'block';
                  }
              }
              
              if (attempts >= maxAttempts) {
                  clearInterval(currentPollInterval);
                  if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ea580c; font-weight:700;">⚠️ AI timed out. Please check network and try again.</span>';
                  if (submitDocBtn) { submitDocBtn.disabled = false; submitDocBtn.innerText = 'Approve & Submit to Waiting Room'; }
                  if (submitSelfieBtn) { submitSelfieBtn.disabled = false; submitSelfieBtn.innerText = 'Verify & Submit to Waiting Room'; }
                  if (activeRetryBtn) activeRetryBtn.style.display = 'block';
              }
          } catch (e) { console.error("Polling error", e); }
      }, 3000); 

    } catch (error) {
      if (activeStatusMsg) activeStatusMsg.innerHTML = '<span style="color:#ef4444;">⚠️ Network error. Could not establish connection.</span>';
      if (submitDocBtn) submitDocBtn.disabled = false;
      if (submitSelfieBtn) submitSelfieBtn.disabled = false;
    }
}

if (submitDocBtn) submitDocBtn.addEventListener('click', executeUploadLogic);
if (submitSelfieBtn) submitSelfieBtn.addEventListener('click', executeUploadLogic);

function injectPermissionModal() {
    if (document.getElementById('sysPermissionModal')) return;
    const modalHtml = `
    <div id="sysPermissionModal" class="hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;">
        <div style="background: #09090b; border: 1px solid #27272a; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
            <div id="permIcon" style="font-size: 48px; margin-bottom: 15px;">📷</div>
            <h2 id="permTitle" style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 10px;">Camera Access Required</h2>
            <p id="permDesc" style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 25px;">To securely verify your identity, we need temporary access to your camera for a real-time selfie capture.</p>
            <div id="permErrorAlert" class="hidden" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 12px; padding: 12px; color: #fca5a5; font-size: 13px; margin-bottom: 20px; display: none;">
                Camera access was blocked by your browser. Please enable it in your browser settings to continue.
            </div>
            <div id="permActionButtons" style="display: flex; gap: 12px;">
                <button type="button" id="permCancelBtn" style="flex: 1; padding: 14px; background: transparent; border: 1px solid #3f3f46; color: #ffffff; border-radius: 12px; font-weight: 600; cursor: pointer;">Cancel</button>
                <label id="permAllowBtn" for="" style="flex: 1; padding: 14px; background: #ffffff; color: #000000; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: block; margin: 0; text-align: center;">Allow Access</label>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

let pendingTriggerAction = null;
let isApproving = false;
let permissionGranted = { camera: false, gallery: false, selfie: false };

function requestDevicePermissionUX(type) {
    injectPermissionModal();
    pendingTriggerAction = type;
    
    const modal = document.getElementById('sysPermissionModal');
    const title = document.getElementById('permTitle');
    const desc = document.getElementById('permDesc');
    const icon = document.getElementById('permIcon');
    const errorAlert = document.getElementById('permErrorAlert');
    const allowBtn = document.getElementById('permAllowBtn'); 
    
    if (errorAlert) {
        errorAlert.classList.add('hidden');
        errorAlert.style.display = 'none';
    }

    if (type === 'camera') {
        icon.innerText = '🤳';
        title.innerText = 'Camera Access Required';
        desc.innerText = 'Syntrix requires secure camera access to capture a live verification photo.';
        allowBtn.setAttribute('for', 'fileInputCamera');
    } else if (type === 'selfie') {
        icon.innerText = '🤳';
        title.innerText = 'Camera Access Required';
        desc.innerText = 'Syntrix requires secure camera access to capture a live verification photo.';
        allowBtn.setAttribute('for', 'fileInputSelfie');
    } else {
        icon.innerText = '📁';
        title.innerText = 'File Access Required';
        desc.innerText = 'Syntrix needs access to your gallery or files to securely upload your selected document.';
        allowBtn.setAttribute('for', 'fileInputGallery');
    }
    
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

document.addEventListener('mousedown', (e) => {
    if (e.target.id === 'permAllowBtn') isApproving = true;
});
document.addEventListener('touchstart', (e) => {
    if (e.target.id === 'permAllowBtn') isApproving = true;
}, {passive: true});

document.addEventListener('click', (e) => {
    if (e.target.id === 'permCancelBtn') {
        const modal = document.getElementById('sysPermissionModal');
        if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
        isApproving = false;
    }
    
    if (e.target.id === 'permAllowBtn') {
        isApproving = true;
        if (pendingTriggerAction) {
            permissionGranted[pendingTriggerAction] = true;
        }
        const modal = document.getElementById('sysPermissionModal');
        setTimeout(() => {
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }
            isApproving = false;
        }, 800);
    }
});

// =========================================================================
// 🚀 PREMIUM XP PROGRESSION FRONTEND ENGINE
// =========================================================================

const XPAnimator = {
  currentLevel: null,
  lastProfile: null, 
  RANKS: [
    { level: 1, rank: 'Explorer', xpRequired: 0 },
    { level: 2, rank: 'Contributor', xpRequired: 200 },
    { level: 3, rank: 'Analyst', xpRequired: 500 },
    { level: 4, rank: 'Verifier', xpRequired: 900 },
    { level: 5, rank: 'Researcher', xpRequired: 1500 },
    { level: 6, rank: 'Specialist', xpRequired: 2300 },
    { level: 7, rank: 'Strategist', xpRequired: 3300 },
    { level: 8, rank: 'Expert', xpRequired: 4600 },
    { level: 9, rank: 'Innovator', xpRequired: 6200 },
    { level: 10, rank: 'AI Pioneer', xpRequired: 8000 }
  ],

  async fetchAndRenderXP(email) {
    if (!email) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/xp-profile?email=${encodeURIComponent(email)}`);
      const result = await response.json();

      if (result.success && result.profile) {
        if (this.lastProfile && result.profile.totalXP > this.lastProfile.totalXP) {
            const diff = result.profile.totalXP - this.lastProfile.totalXP;
            const latestItem = result.profile.recentHistory[0];
            this.showXPToast(diff, latestItem ? latestItem.reason : "XP Earned!");
        } else if (!this.lastProfile && result.profile.recentHistory && result.profile.recentHistory.length > 0) {
            const latestItem = result.profile.recentHistory[0];
            const itemTime = new Date(latestItem.created_at).getTime();
            if (Date.now() - itemTime < 15000) {
                this.showXPToast(latestItem.amount, latestItem.reason);
            }
        }

        this.lastProfile = result.profile;
        this.updateUI(result.profile, false);
      }
    } catch (err) {
      console.error("[XP Engine] Failed to sync progression data:", err);
    }
  },

  updateUI(profile, forceAnimate = true) {
    if (this.currentLevel !== null && profile.currentLevel > this.currentLevel) {
      this.triggerLevelUpPopup(profile.currentLevel, profile.currentRank);
    }
    this.currentLevel = profile.currentLevel;

    const textMap = {
        "bentoCurrentLevel": profile.currentLevel,
        "bentoCurrentRank": profile.currentRank,
        "bentoTargetAmount": profile.xpRequiredNextLevel,
        "bentoRemainingAmount": profile.xpRemaining,
        "bentoNextLevelNum": profile.currentLevel + 1,
        "bentoTotalXp": profile.totalXP.toLocaleString(),
        "bentoHighestLevel": profile.highestLevel,
        "bentoContributions": (profile.surveyCount + profile.documentCount + profile.selfieCount).toLocaleString(),
        "bentoBadgeNumber": profile.currentLevel,
        "bentoBadgeRank": profile.currentRank,
        "bentoStreakDays": profile.dailyStreak,
        "bentoStatSurveys": profile.surveyCount,
        "bentoStatDocs": profile.documentCount,
        "bentoStatSelfies": profile.selfieCount,
        "bentoStatReferrals": profile.referralCount,
        "bentoStatTotalXp": profile.totalXP.toLocaleString()
    };

    for (const [id, val] of Object.entries(textMap)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    const tabScreenXP = document.getElementById("tabScreenXP");
    if (forceAnimate || (tabScreenXP && tabScreenXP.style.display === "block")) {
        const amt = document.getElementById("bentoCurrentAmount");
        const pct = document.getElementById("bentoProgressPercent");
        if(amt) amt.innerText = "0";
        if(pct) pct.innerText = "0";
        
        const bar = document.getElementById("bentoProgressBar");
        if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            void bar.offsetWidth; 
            bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => { bar.style.width = `${profile.levelProgressPercentage}%`; }, 50);
        }

        this.animateValue("bentoCurrentAmount", 0, profile.totalXP, 1500);
        this.animateValue("bentoProgressPercent", 0, profile.levelProgressPercentage, 1500);
    } else {
        const amt = document.getElementById("bentoCurrentAmount");
        const pct = document.getElementById("bentoProgressPercent");
        if(amt) amt.innerText = profile.totalXP;
        if(pct) pct.innerText = profile.levelProgressPercentage;
        const bar = document.getElementById("bentoProgressBar");
        if (bar) bar.style.width = `${profile.levelProgressPercentage}%`;
    }

    const historyList = document.getElementById("bentoHistoryList");
    if (historyList && profile.recentHistory) {
      historyList.innerHTML = profile.recentHistory.length > 0 ? profile.recentHistory.map(item => {
        let icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"></path></svg>';
        let title = item.reason;
        let desc = "XP Earned";
        if(item.reason.includes("Survey")) { icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'; desc="You have completed a survey"; }
        if(item.reason.includes("Document")) { icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>'; desc="AI verified your document"; }
        if(item.reason.includes("Selfie")) { icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path></svg>'; desc="AI verified your selfie"; }
        if(item.reason.includes("Referral")) { icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>'; desc="Your referral completed the survey"; }
        if(item.reason.includes("Login")) { icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'; desc="You logged in today"; }
        
        return `<div class="xp-hist-item">
            <div class="xp-hist-left">
                <div class="xp-hist-icon">${icon}</div>
                <div class="xp-hist-text"><h4>${title}</h4><p>${desc}</p></div>
            </div>
            <div class="xp-hist-right">
                <div class="xp-hist-amount">+${item.amount} XP</div>
                <div class="xp-hist-time">Recently</div>
            </div>
        </div>`;
      }).join('') : `<div style="font-size:13px; color:#71717a; text-align:left;">No recent activity yet. Complete a task to earn XP!</div>`;
    }

    const roadmapEl = document.getElementById("bentoRoadmap");
    if(roadmapEl) {
        let roadmapHTML = '';
        let startLvl = Math.max(1, profile.currentLevel - 1);
        let endLvl = Math.min(10, profile.currentLevel + 3);
        
        for(let i = startLvl; i <= endLvl; i++) {
            const rankObj = this.RANKS[i-1] || { level: i, rank: 'AI Pioneer', xpRequired: 8000 + ((i-10)*2000) };
            let statusClass = 'locked';
            let statusText = `${rankObj.xpRequired} XP`;
            
            if(i < profile.currentLevel) {
                statusClass = 'completed'; statusText = 'COMPLETED';
            } else if (i === profile.currentLevel) {
                statusClass = 'current'; statusText = `${profile.totalXP} / ${profile.xpRequiredNextLevel} XP<br><span style="color:#a1a1aa; font-weight:600; font-size:11px;">Current Level</span>`;
            }

            roadmapHTML += `
            <div class="xp-road-item ${statusClass}">
                <div class="xp-road-dot">${statusClass === 'completed' ? '✓' : (statusClass === 'current' ? '↑' : '')}</div>
                <div class="xp-road-left"><h4>Level ${i}</h4><p>${rankObj.rank}</p></div>
                <div class="xp-road-right"><div class="xp-road-xp" style="${statusClass==='current' ? 'color:#a855f7;' : ''}">${statusText}</div></div>
            </div>`;
        }
        roadmapEl.innerHTML = roadmapHTML;
    }

    const streakUI = document.getElementById("bentoStreakUI");
    if(streakUI) {
        const days = Array.from(streakUI.children);
        let count = profile.dailyStreak > 7 ? 7 : profile.dailyStreak;
        days.forEach((dayEl, idx) => {
            if(idx < count) dayEl.classList.add('active');
            else dayEl.classList.remove('active');
        });
    }
  },

  replayAnimations() {
     if (this.lastProfile) this.updateUI(this.lastProfile, true);
  },

  showXPToast(amount, reason) {
    const toast = document.getElementById("xpFloatingToast");
    if (!toast) return;
    document.getElementById("xpToastAmount").innerText = `+${amount} XP`;
    document.getElementById("xpToastReason").innerText = reason;
    toast.classList.remove("hidden");
    
    setTimeout(() => { toast.classList.add("show"); }, 10);
    
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 600); 
    }, 4000);
  },

  animateValue(id, start, end, duration) {
    if (start === end) return;
    const obj = document.getElementById(id);
    if(!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      obj.innerHTML = Math.floor(easeProgress * (end - start) + start).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  },

  triggerLevelUpPopup(newLevel, newRank) {
    const overlay = document.getElementById("xpLevelUpOverlay");
    const rankText = document.getElementById("levelUpNewRank");
    const numText = document.getElementById("levelUpBadgeNumber");
    if (overlay && rankText && numText) {
      rankText.innerText = newRank;
      numText.innerText = newLevel;
      overlay.classList.add("active");
    }
  }
};

const originalLedgerVerificationXP = window.runProfileLedgerVerification;
if (typeof originalLedgerVerificationXP === "function") {
  window.runProfileLedgerVerification = async function(email, isFromModal, isBackgroundSync) {
    await originalLedgerVerificationXP(email, isFromModal, isBackgroundSync);
    XPAnimator.fetchAndRenderXP(email);
  };
}

window.addEventListener('DOMContentLoaded', () => {
    const cameraUI = document.querySelector('.doc-btn-white') || document.getElementById('btnCameraText')?.parentElement;
    const galleryUI = document.getElementById('btnGallery');
    const selfieUI = document.getElementById('btnSelfieCamera');

    if (cameraUI && cameraUI.id !== 'btnSelfieCamera') {
        cameraUI.addEventListener('click', (e) => {
            if (isApproving || permissionGranted.camera) return; 
            if (!document.getElementById('fileInputCamera').value) {
                e.preventDefault(); 
                e.stopPropagation();
                requestDevicePermissionUX('camera');
            }
        }, true);
    }
    
    if (galleryUI) {
        galleryUI.addEventListener('click', (e) => {
            if (isApproving || permissionGranted.gallery) return; 
            if (!document.getElementById('fileInputGallery').value) {
                e.preventDefault();
                e.stopPropagation();
                requestDevicePermissionUX('gallery');
            }
        }, true);
    }

    if (selfieUI) {
        selfieUI.addEventListener('click', (e) => {
            if (isApproving || permissionGranted.selfie) return; 
            if (!document.getElementById('fileInputSelfie').value) {
                e.preventDefault();
                e.stopPropagation();
                requestDevicePermissionUX('selfie');
            }
        }, true);
    }
});
