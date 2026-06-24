// =========================================================================
// SYNTRIX CORE PLATFORM APPLICATION LOGIC ENGINE
// =========================================================================

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
let legalConsentTimestamp = "";
let clientUserAgent = "";

// Dom Connectors - Application Main Shells
const splashLandingGate = document.getElementById("splashLandingGate");
const mainApplicationLayout = document.getElementById("mainApplicationLayout");

// Splash Sub-Views Selectors
const viewSplashHome = document.getElementById("viewSplashHome");
const viewSplashRewards = document.getElementById("viewSplashRewards");
const viewSplashAbout = document.getElementById("viewSplashAbout");
const linkHomeTab = document.getElementById("linkHomeTab");
const linkRewardsTab = document.getElementById("linkRewardsTab");
const linkAboutTab = document.getElementById("linkAboutTab");
const navGetStartedAction = document.getElementById("navGetStartedAction");

// App Survey & Core Selectors
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

// Dashboards Selectors
const dashboardTabLinks = document.getElementById("dashboardTabLinks");
const tabScreenHub = document.getElementById("rewardDashboardScreen");
const tabScreenBadge = document.getElementById("tabScreenBadge");
const tabScreenReferrals = document.getElementById("tabScreenReferrals");
const lockedClaimGatewayBtn = document.getElementById("lockedClaimGatewayBtn");
const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

const dashboardWalletInput = document.getElementById("dashboardWalletInput");
const executeClaimBtn = document.getElementById("executeClaimBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const claimScreenSection = document.getElementById("claimScreenSection");
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
const statusDiv = document.getElementById("status");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");

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
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); }, 3500);
}

function openLegalModal() { 
  const modal = document.getElementById("legalModal");
  if(modal) { modal.classList.remove("hidden"); modal.style.display = "flex"; }
}
function closeLegalModal() { 
  const modal = document.getElementById("legalModal");
  if(modal) { modal.classList.add("hidden"); modal.style.display = "none"; }
}

// ================= SPLASH PAGE ROUTING =================
function routeSplashNavViews(targetView) {
  [viewSplashHome, viewSplashRewards, viewSplashAbout].forEach(view => { if(view) view.classList.add("hidden"); });
  document.querySelectorAll(".nav-splash-tab").forEach(link => link.classList.remove("active"));
  
  if (targetView === "home" && viewSplashHome) { viewSplashHome.classList.remove("hidden"); if(linkHomeTab) linkHomeTab.classList.add("active"); }
  if (targetView === "rewards" && viewSplashRewards) { viewSplashRewards.classList.remove("hidden"); if(linkRewardsTab) linkRewardsTab.classList.add("active"); }
  if (targetView === "about" && viewSplashAbout) { viewSplashAbout.classList.remove("hidden"); if(linkAboutTab) linkAboutTab.classList.add("active"); }
}

if (linkHomeTab) linkHomeTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("home"); });
if (linkRewardsTab) linkRewardsTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("rewards"); });
if (linkAboutTab) linkAboutTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("about"); });
document.getElementById("navLogoHomeTrigger").addEventListener("click", () => routeSplashNavViews("home"));
document.querySelectorAll(".back-to-home-btn").forEach(btn => btn.addEventListener("click", () => routeSplashNavViews("home")));

// Master Engine Hook: "Get Started" moves from Dark Splash to Light Survey App
if (navGetStartedAction) {
  navGetStartedAction.addEventListener("click", () => {
    document.getElementById("initializePlatformBtn").click();
  });
}

if (document.getElementById("initializePlatformBtn")) {
  document.getElementById("initializePlatformBtn").addEventListener("click", () => {
    splashLandingGate.style.display = "none"; // Shut down dark matrix overlay
    mainApplicationLayout.classList.remove("hidden"); // Open standard app body
    
    // Check saved token logic
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      runProfileLedgerVerification(userEmailAddress, false);
    } else {
      if (emailGateSection) emailGateSection.classList.remove("hidden");
    }
  });
}

// ================= BADGE INTEGRATIONS =================
const BADGE_PROFILES = {
  Analyzer: { 
    title: "ANALYZER", sub: "The Mindful Shopper",
    desc: "You shop with brilliant clarity! For you, real value and true quality matter most.", 
    iconHTML: `<img src="BADGES%20PNG/badge%201%20analyzer.jpeg" alt="Analyzer" style="width: 100%; height: 100%; object-fit: cover;">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    color: "#2563eb", textColor: "#0f172a"
  },
  Stylist: { 
    title: "STYLIST", sub: "The Tasteful Explorer",
    desc: "You have a beautiful eye for design! For you, shopping is about joy, artistry, and wonderful experiences.", 
    iconHTML: `<img src="BADGES%20PNG/badge%203.jpeg" alt="Stylist" style="width: 100%; height: 100%; object-fit: cover;">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z"></path></svg>`,
    color: "#8b5cf6", textColor: "#0f172a"
  },
  Hedger: { 
    title: "HEDGER", sub: "The Thoughtful Planner",
    desc: "You value peace of mind and total reliability! You love knowing your purchases are safe and backed by guarantees.", 
    iconHTML: `<img src="BADGES%20PNG/badge%202.jpeg" alt="Hedger" style="width: 100%; height: 100%; object-fit: cover;">`, 
    menuIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    color: "#ea580c", textColor: "#0f172a"
  },
  Native: { 
    title: "NATIVE", sub: "The Connected Heart",
    desc: "You deeply value genuine connections! Your best shopping moments come from trusted recommendations.", 
    iconHTML: `<img src="BADGES%20PNG/badge%204.jpeg" alt="Native" style="width: 100%; height: 100%; object-fit: cover;">`, 
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
  let clean = code.trim().toUpperCase().replace(/\s+/g, "");
  if (!clean.startsWith("SYN-")) clean = clean.startsWith("SYN") ? "SYN-" + clean.substring(3) : "SYN-" + clean;
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
    checkingLedger: "🔍 Authenticating communication profile ledger status..."
  };
  if (typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return fallbacks[key] || key;
}

// Dashboard Tabs Engine
function routeDashboardTabs(targetTab) {
  [tabScreenHub, tabScreenBadge, tabScreenReferrals].forEach(screen => { if(screen) screen.classList.add("hidden"); });
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  
  const clickedBtn = document.querySelector(`[data-tab="${targetTab}"]`);
  if (clickedBtn) clickedBtn.classList.add("active");

  if (targetTab === "hub" && tabScreenHub) tabScreenHub.classList.remove("hidden");
  if (targetTab === "badge" && tabScreenBadge) tabScreenBadge.classList.remove("hidden");
  if (targetTab === "referrals" && tabScreenReferrals) tabScreenReferrals.classList.remove("hidden");
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
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) { showToast("Please input a valid email address.", "❌"); return; }

    if (!isOtpSent) {
      if (startSurveyBtn.disabled) return; 
      startSurveyBtn.disabled = true;
      const originalText = startSurveyBtn.innerHTML;
      startSurveyBtn.innerHTML = "⏳ Sending Code...";
      
      try {
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/send-otp`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal })
        });
        const result = await response.json();
        if (result.success) {
          isOtpSent = true;
          const otpSection = document.getElementById("otpSection");
          if (otpSection) otpSection.classList.remove("hidden");
          startSurveyBtn.innerHTML = "Verify & Enter &rarr;";
          startSurveyBtn.disabled = false;
          gateEmailInput.readOnly = true; 
          if(legalConsent && legalConsent.parentElement) legalConsent.parentElement.style.display = "none";
        } else {
          showToast(result.error || "Failed to send code.", "❌");
          startSurveyBtn.disabled = false; startSurveyBtn.innerHTML = originalText;
        }
      } catch (err) {
        showToast("Network error. Could not send code.", "❌");
        startSurveyBtn.disabled = false; startSurveyBtn.innerHTML = originalText;
      }
      return; 
    }

    const gateOtpInput = document.getElementById("gateOtp");
    const rawOtpVal = gateOtpInput ? gateOtpInput.value : "";
    const otpVal = rawOtpVal.replace(/[\s-]/g, "");
    if (!otpVal || otpVal.length !== 6) { showToast("Please enter the 6-digit verification code.", "❌"); return; }

    if (startSurveyBtn.disabled) return;
    startSurveyBtn.disabled = true;
    const originalVerifyText = startSurveyBtn.innerHTML;
    startSurveyBtn.innerHTML = "⏳ Verifying...";

    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, otp: otpVal })
      });
      const result = await response.json();
      if (result.success) {
        userEmailAddress = emailVal;
        localStorage.setItem("syntrix_user_email", emailVal);
        if (referredByCodeInput && referredByCodeInput.value.trim() !== "") {
          localStorage.setItem("referralCode", normalizeReferralCode(referredByCodeInput.value));
        }
        startSurveyBtn.disabled = false;
        await runProfileLedgerVerification(emailVal, false);
      } else {
        showToast(result.error || "Invalid or expired code.", "❌");
        startSurveyBtn.disabled = false; startSurveyBtn.innerHTML = originalVerifyText;
      }
    } catch (err) {
      showToast("Network error. Could not verify code.", "❌");
      startSurveyBtn.disabled = false; startSurveyBtn.innerHTML = originalVerifyText;
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

function getQuestionText(q) {
  if (typeof questionTranslations !== "undefined" && questionTranslations[currentLanguage]) {
    return questionTranslations[currentLanguage][q.id] || q.text || q.id;
  }
  return q.question || q.id;
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
    if (topProgressBox) topProgressBox.classList.remove("hidden");
    if (claimForm) claimForm.classList.remove("hidden");
    if (emailGateSection) emailGateSection.classList.add("hidden");

    const sidebarSteps = document.querySelectorAll(".sidebar .step");
    sidebarSteps.forEach((st, idx) => {
      if (idx === currentSection) st.classList.add("active");
      else st.classList.remove("active");
      if (sections[idx]) {
        const titleText = sections[idx].title.split(".")[1] || sections[idx].title;
        const stepLabel = st.querySelector(".stepLabel") || st;
        if (stepLabel) stepLabel.innerText = titleText.trim();
      }
    });

    const progressPercent = ((currentSection + 1) / sections.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

    let htmlStr = `<div class="survey-section-card animate-fade-in">
      <h2 class="surveySectionTitle" style="font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 5px;">${getSectionTitle(currentData)}</h2>`;

    if (currentData && currentData.questions) {
        currentData.questions.forEach((q) => {
          const savedAnswer = answers[q.id] || "";
          htmlStr += `<div class="question-block" style="margin-top:30px; text-align:left;">
            <p class="questionText" style="font-weight:800; margin-bottom:16px; font-size:17px; color:#1f1f1f;">${getQuestionText(q)}</p>
            <div class="options">`; 

          if (q.type === "textarea") {
               htmlStr += `<textarea id="${q.id}" placeholder="Type your answer here..." onchange="recordSelection('${q.id}', this.value)" style="width:100%; border:2px solid #e2e8f0; border-radius:14px; padding:16px; font-size:15px; font-family:inherit;">${savedAnswer}</textarea>`;
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

    if (prevBtn) prevBtn.style.visibility = currentSection === 0 ? "hidden" : "visible";
    if (currentSection === sections.length - 1) {
      if (nextBtn) nextBtn.classList.add("hidden");
      if (submitClaimBtn) submitClaimBtn.classList.remove("hidden");
    } else {
      if (nextBtn) nextBtn.classList.remove("hidden");
      if (submitClaimBtn) submitClaimBtn.classList.add("hidden");
    }
  } catch (err) {
    surveyContainer.innerHTML = `<div style="background:#fee2e2; border: 2px solid #ef4444; color:#991b1b; padding: 20px; border-radius: 12px; font-weight:bold; margin-top:20px;">🚨 System Error: ${err.message}</div>`;
  }
}

window.recordSelection = function(questionId, selectedValue) { answers[questionId] = selectedValue; renderSection(); };

function handleNextSection() {
  const sections = getSurveyData();
  if (!validateCurrentSectionAnswers()) { showToast(getUIText("validationRequired"), "⚠️"); return; }
  if (currentSection < sections.length - 1) {
    currentSection++; renderSection(); updateExcitementBanner(currentSection);
  }
}

function handlePrevSection() {
  if (currentSection > 0) { currentSection--; renderSection(); updateExcitementBanner(currentSection); }
}

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
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">शानदार! आपने अब तक <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">अगला मॉड्यूल पूरा करें Aur <strong style="color: #fbbf24;">8 Aur Paayein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px;">[ ${unlockedTokens} / ${totalTokens} ]</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">अविश्वसनीय! आपने सभी <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">दावा करने के लिए नीचे सबमिट पर क्लिक करें!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px;">[ 48 / 48 ]</div></div>`;
      }
  } else {
      if (sectionIndex < 5) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! You've secured <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> so far!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Complete the next module to claim <strong style="color: #fbbf24;">8 more!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px;">[ ${unlockedTokens} / ${totalTokens} ]</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! You've secured all <span style="color: #10b981; font-weight: 900; font-size: 18px;">48 SYNX</span>!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Hit Submit below to transfer them to your wallet!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px;">[ 48 / 48 ]</div></div>`;
      }
  }
}

const dismissModal = () => { if (retrieveModal) retrieveModal.classList.add("hidden"); };

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

      displayConsumerBadgesUI("Analyzer"); // Can implement badge dynamic fetch logic here later

      if (statusResult.exists === true) {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        if (claimForm) claimForm.classList.add("hidden");
        if (topProgressBox) topProgressBox.classList.add("hidden");
        if (surveyStepLinks) surveyStepLinks.classList.add("hidden");
        
        if (dashboardTabLinks) dashboardTabLinks.classList.remove("hidden");
        routeDashboardTabs("hub");
        outputTarget.innerHTML = "";
      } else {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        currentSection = 0; renderSection(); outputTarget.innerHTML = "";
      }
    } else {
      if (!isFromModal) {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        currentSection = 0; renderSection(); outputTarget.innerHTML = "";
      } else { showToast("Profile ledger entry not found.", "❌"); }
    }
  } catch (err) {
    showToast("Communication framework offline.", "❌");
  }
}

async function handleSurveySubmission(e) {
  if (e) e.preventDefault();
  if (!validateCurrentSectionAnswers()) { showToast(getUIText("validationRequired"), "⚠️"); return; }

  document.getElementById("claimForm").classList.add("hidden");
  const excitementBanner = document.getElementById("excitementBanner");
  if(excitementBanner) excitementBanner.style.display = "none";

  const animOverlay = document.getElementById("rewardAnimationOverlay");
  if (animOverlay) animOverlay.style.display = "flex";

  const referralCodeUsed = localStorage.getItem("referralCode") || "";
  const finalPayload = {
    email: userEmailAddress, answers: answers, referredBy: referralCodeUsed,
    legal_consent: true, consent_timestamp: legalConsentTimestamp || new Date().toISOString(),
    user_agent: clientUserAgent || navigator.userAgent
  };

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/submit-survey`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload)
    });
    const result = await response.json();
    
    setTimeout(async () => {
      if (animOverlay) animOverlay.style.display = "none";
      if (result.success) {
        if (statusDiv) statusDiv.innerHTML = "";
        await runProfileLedgerVerification(userEmailAddress, false);
      } else {
        document.getElementById("claimForm").classList.remove("hidden"); 
        showToast(`${result.error || "Submission rejected by registry backend."}`, "❌");
      }
    }, 3500);
  } catch (err) {
    if (animOverlay) animOverlay.style.display = "none";
    document.getElementById("claimForm").classList.remove("hidden");
    showToast("Network transaction failed.", "❌");
  }
}

if (lockedClaimGatewayBtn) lockedClaimGatewayBtn.addEventListener("click", () => { showToast("Opening Soon... Settlement gateways will activate upon operational validation phases.", "🔒"); });

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email"); localStorage.removeItem("referralCode");
  if (statusDiv) statusDiv.innerHTML = "";
  userEmailAddress = ""; currentSection = 0; isOtpSent = false;
  legalConsentTimestamp = ""; clientUserAgent = ""; 
  const otpSection = document.getElementById("otpSection"); if (otpSection) otpSection.classList.add("hidden");
  if (startSurveyBtn) startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
  if (gateEmailInput) gateEmailInput.readOnly = false;
  for (const prop in answers) { if (Object.prototype.hasOwnProperty.call(answers, prop)) delete answers[prop]; }
  
  if (dashboardTabLinks) dashboardTabLinks.classList.add("hidden");
  if (tabScreenHub) tabScreenHub.classList.add("hidden");
  if (tabScreenBadge) tabScreenBadge.classList.add("hidden");
  if (tabScreenReferrals) tabScreenReferrals.classList.add("hidden");
  
  if (surveyStepLinks) surveyStepLinks.classList.remove("hidden");
  if (mainApplicationLayout) mainApplicationLayout.classList.add("hidden");
  if (splashLandingGate) splashLandingGate.style.display = "flex";
  routeSplashNavViews("home");
  showToast("Account profiles successfully signed out.", "✓");
}

if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", () => resetApplicationFlowState());

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = e.target.dataset.tab;
    if (target) routeDashboardTabs(target);
  });
});

// ================= LIFE CYCLE REGISTRATION RUNNERS & EVENT ROUTERS =================
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get("ref");
  
  if (refParam) {
    localStorage.setItem("referralCode", normalizeReferralCode(refParam));
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  const savedRefCode = localStorage.getItem("referralCode");
  if (savedRefCode && referredByCodeInput) referredByCodeInput.value = savedRefCode;

  if (nextBtn) nextBtn.onclick = () => handleNextSection();
  if (prevBtn) prevBtn.onclick = () => handlePrevSection();
  if (claimForm) {
    claimForm.addEventListener("submit", (e) => { e.preventDefault(); handleSurveySubmission(e); });
  }

  if (copyReferralBtn) {
    copyReferralBtn.onclick = () => {
      if (!referralCodeDisplay) return;
      referralCodeDisplay.select(); referralCodeDisplay.setSelectionRange(0, 99999);
      try {
        navigator.clipboard.writeText(referralCodeDisplay.value);
        const originalText = copyReferralBtn.innerText; copyReferralBtn.innerText = "Copied! ✓";
        setTimeout(() => { copyReferralBtn.innerText = originalText; }, 2000);
      } catch (err) { showToast("Failed to access system registers.", "❌"); }
    }
  }

  if (menuToggleBtn && optionsPopover) {
    menuToggleBtn.onclick = (e) => { e.stopPropagation(); optionsPopover.classList.toggle("hidden"); };
    document.addEventListener("click", () => optionsPopover.classList.add("hidden"));
  }

  if (menuRestartBtn && confirmRestartModal) menuRestartBtn.onclick = () => { optionsPopover.classList.add("hidden"); confirmRestartModal.classList.remove("hidden"); };
  if (cancelRestartBtn && confirmRestartModal) cancelRestartBtn.onclick = () => confirmRestartModal.classList.add("hidden");
  if (confirmRestartBtn && confirmRestartModal) confirmRestartBtn.onclick = () => { confirmRestartModal.classList.add("hidden"); resetApplicationFlowState(); };

  if (menuRecoverBtn && retrieveModal) {
    menuRecoverBtn.onclick = () => {
      retrieveModal.classList.remove("hidden");
      if (modalEmailInput) modalEmailInput.value = "";
      if (modalStatus) modalStatus.innerHTML = "";
      
      if (confirmRetrieveBtn) {
        confirmRetrieveBtn.onclick = async () => {
          const searchEmail = modalEmailInput ? modalEmailInput.value.trim().toLowerCase() : "";
          if (!searchEmail || !EMAIL_REGEX.test(searchEmail)) { showToast("Please provide a valid email structure.", "❌"); return; }
          // Trigger splash to hide and App body to open directly on recovery
          splashLandingGate.style.display = "none";
          mainApplicationLayout.classList.remove("hidden");
          await runProfileLedgerVerification(searchEmail, true);
        };
      }
    };
  }

  if (closeModalBtn) closeModalBtn.onclick = () => dismissModal();
  if (cancelModalBtn) cancelModalBtn.onclick = () => dismissModal();
});
