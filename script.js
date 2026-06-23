// =========================================================================
// SYNTRIX CUSTOMER ACCOUNT SUITE & SURVEY AUTOMATION GATEWAY
// =========================================================================

const BACKEND_URL = "https://syntrix-airdrop.onrender.com";
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const DEFAULT_TIMEOUT_MS = 60000;

let userEmailAddress = "";
let currentSection = 0;
const answers = {};
let currentLanguage = "en";
let isOtpSent = false;
let legalConsentTimestamp = "";
let clientUserAgent = "";

// Element Selectors
const splashLandingGate = document.getElementById("splashLandingGate");
const initializePlatformBtn = document.getElementById("initializePlatformBtn");
const mainApplicationLayout = document.getElementById("mainApplicationLayout");
const emailGateSection = document.getElementById("emailGateSection");
const emailGateForm = document.getElementById("emailGateForm");
const gateEmailInput = document.getElementById("gateEmail");
const startSurveyBtn = document.getElementById("startSurveyBtn");
const referredByCodeInput = document.getElementById("referredByCode"); 
const surveyStepLinks = document.getElementById("surveyStepLinks");
const dashboardTabLinks = document.getElementById("dashboardTabLinks");

// Splash Sub-Views Control Points
const viewSplashHome = document.getElementById("viewSplashHome");
const viewSplashRewards = document.getElementById("viewSplashRewards");
const viewSplashAbout = document.getElementById("viewSplashAbout");
const linkHomeTab = document.getElementById("linkHomeTab");
const linkRewardsTab = document.getElementById("linkRewardsTab");
const linkAboutTab = document.getElementById("linkAboutTab");

// Tab Screens
const tabScreenHub = document.getElementById("tabScreenHub");
const tabScreenBadge = document.getElementById("tabScreenBadge");
const tabScreenReferrals = document.getElementById("tabScreenReferrals");
const lockedClaimGatewayBtn = document.getElementById("lockedClaimGatewayBtn");
const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

const topProgressBox = document.getElementById("topProgressBox");
const claimForm = document.getElementById("claimForm");
const surveyContainer = document.getElementById("surveyContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitClaimBtn = document.getElementById("submitClaimBtn");
const statTotalReferrals = document.getElementById("statTotalReferrals");
const statPendingRewards = document.getElementById("statPendingRewards");
const statTotalEarned = document.getElementById("statTotalEarned");
const referralCodeDisplay = document.getElementById("referralCodeDisplay");
const copyReferralBtn = document.getElementById("copyReferralBtn");
const progressFill = document.querySelector(".progressFill");
const progressText = document.querySelector(".progressText");

function showToast(message, icon = "⚠️") {
  let toast = document.getElementById("customToast");
  let toastMsg = document.getElementById("toastMessage");
  if (!toast) return;
  toastMsg.innerText = message;
  document.querySelector(".toast-icon").innerText = icon;
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); }, 3500);
}

function openLegalModal() { document.getElementById("legalModal").classList.remove("hidden"); }
function closeLegalModal() { document.getElementById("legalModal").classList.add("hidden"); }

// Navigation Layout Router for Splash Gated Tabs
function routeSplashNavViews(targetView) {
  [viewSplashHome, viewSplashRewards, viewSplashAbout].forEach(view => { if(view) view.classList.add("hidden"); });
  document.querySelectorAll(".nav-splash-tab").forEach(link => link.classList.remove("active"));
  
  if (targetView === "home" && viewSplashHome) { viewSplashHome.classList.remove("hidden"); linkHomeTab.classList.add("active"); }
  if (targetView === "rewards" && viewSplashRewards) { viewSplashRewards.classList.remove("hidden"); linkRewardsTab.classList.add("active"); }
  if (targetView === "about" && viewSplashAbout) { viewSplashAbout.classList.remove("hidden"); linkAboutTab.classList.add("active"); }
}

// Attach listeners cleanly
if (linkHomeTab) linkHomeTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("home"); });
if (linkRewardsTab) linkRewardsTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("rewards"); });
if (linkAboutTab) linkAboutTab.addEventListener("click", (e) => { e.preventDefault(); routeSplashNavViews("about"); });
document.getElementById("navLogoHomeTrigger").addEventListener("click", () => routeSplashNavViews("home"));
document.getElementById("navGetStartedAction").addEventListener("click", () => { if(initializePlatformBtn) initializePlatformBtn.click(); });
document.querySelectorAll(".back-to-home-btn").forEach(btn => btn.addEventListener("click", () => routeSplashNavViews("home")));

// Language Translation hooks
const langButtons = document.querySelectorAll(".langBtn");
langButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    langButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLanguage = btn.dataset.lang;
    if (claimForm && claimForm.classList.contains("hidden") === false) { renderSection(); }
  });
});

const BADGE_PROFILES = {
  Analyzer: { title: "ANALYZER", sub: "The Mindful Shopper", desc: "You shop with brilliant clarity! For you, real value and true quality matter most.", color: "#6366f1", textColor: "#111827", iconHTML: `<div style='padding:20px; font-size:40px;'>📊</div>` }
};

function displayConsumerBadgesUI(badgeKey) {
  const profile = BADGE_PROFILES[badgeKey] || BADGE_PROFILES.Analyzer;
  const badgeCard = document.getElementById("dashboardPsychologyBadgeCard");
  if (badgeCard) {
    badgeCard.style.background = "#ffffff";
    badgeCard.style.border = `1px solid #e5e7eb`;
    badgeCard.style.borderRadius = "24px";
    badgeCard.style.padding = "30px";
    badgeCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:20px;">
        ${profile.iconHTML}
        <div>
          <div style="font-size: 11px; text-transform: uppercase; color: ${profile.color}; font-weight: 900; letter-spacing: 1px;">Unlocked Archetype</div>
          <h3 style="font-size: 28px; font-weight: 900; color: ${profile.textColor}; margin: 2px 0;">${profile.title}</h3>
          <p style="font-size: 14px; color: #4b5563; line-height: 1.5;">${profile.desc}</p>
        </div>
      </div>`;
  }
}

function routeDashboardTabs(targetTab) {
  [tabScreenHub, tabScreenBadge, tabScreenReferrals].forEach(screen => { if(screen) screen.classList.add("hidden"); });
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  const clickedBtn = document.querySelector(`[data-tab="${targetTab}"]`);
  if (clickedBtn) clickedBtn.classList.add("active");

  if (targetTab === "hub" && tabScreenHub) tabScreenHub.classList.remove("hidden");
  if (targetTab === "badge" && tabScreenBadge) tabScreenBadge.classList.remove("hidden");
  if (targetTab === "referrals" && tabScreenReferrals) tabScreenReferrals.classList.remove("hidden");
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

// Session Flow Initiation Router
if (initializePlatformBtn) {
  initializePlatformBtn.addEventListener("click", () => {
    if(splashLandingGate) splashLandingGate.style.display = "none";
    if(mainApplicationLayout) mainApplicationLayout.classList.remove("hidden");
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      runProfileLedgerVerification(userEmailAddress);
    } else {
      if(emailGateSection) emailGateSection.classList.remove("hidden");
    }
  });
}

if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const legalConsent = document.getElementById("legalConsent");
    if (legalConsent && !legalConsent.checked) {
      showToast("You must explicitly agree to the legal terms framework.", "⚖️");
      return;
    }
    
    legalConsentTimestamp = new Date().toISOString();
    clientUserAgent = navigator.userAgent;
    const emailVal = gateEmailInput.value.trim().toLowerCase();
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
      showToast("Please enter a valid authorized email address.", "❌");
      return;
    }

    if (!isOtpSent) {
      startSurveyBtn.disabled = true;
      startSurveyBtn.innerHTML = "⏳ Transmission Processing...";
      try {
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/send-otp`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal })
        });
        const result = await response.json();
        if (result.success) {
          isOtpSent = true;
          document.getElementById("otpSection").classList.remove("hidden");
          startSurveyBtn.innerHTML = "Verify Credentials &rarr;";
          startSurveyBtn.disabled = false;
          gateEmailInput.readOnly = true;
        } else {
          showToast(result.error || "Registry network transmission error.", "❌");
          startSurveyBtn.disabled = false;
          startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
        }
      } catch (err) {
        showToast("Framework link connection failure.", "❌");
        startSurveyBtn.disabled = false;
        startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
      }
      return;
    }

    const otpVal = document.getElementById("gateOtp").value.replace(/[\s-]/g, "");
    if (otpVal.length !== 6) { showToast("Verification format requires exactly 6 characters.", "❌"); return; }

    startSurveyBtn.disabled = true;
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
        await runProfileLedgerVerification(emailVal);
      } else {
        showToast(result.error || "Cryptographic key failure.", "❌");
        startSurveyBtn.disabled = false;
        startSurveyBtn.innerHTML = "Verify Credentials &rarr;";
      }
    } catch (err) {
      showToast("Handshake transmission error.", "❌");
      startSurveyBtn.disabled = false;
      startSurveyBtn.innerHTML = "Verify Credentials &rarr;";
    }
  });
}

function getSurveyData() { return typeof surveySections !== "undefined" ? surveySections : []; }

function renderSection() {
  const sections = getSurveyData();
  if (!sections || sections.length === 0 || !surveyContainer) return;
  const currentData = sections[currentSection];
  
  if(topProgressBox) topProgressBox.classList.remove("hidden");
  if(claimForm) claimForm.classList.remove("hidden");
  if(emailGateSection) emailGateSection.classList.add("hidden");

  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === currentSection) st.classList.add("active");
    else st.classList.remove("active");
  });

  const progressPercent = ((currentSection + 1) / sections.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

  let htmlStr = `<div class="survey-section-card"><h2 class="sectionTitle">${currentData.title}</h2>`;

  currentData.questions.forEach((q) => {
    const savedAnswer = answers[q.id] || "";
    htmlStr += `<div class="question">
      <h3>${q.question || q.text}</h3><div class="options">`;

    if (q.type === "textarea") {
      htmlStr += `<textarea onchange="recordSelection('${q.id}', this.value)" placeholder="Type response...">${savedAnswer}</textarea>`;
    } else if (q.options) {
      q.options.forEach((opt) => {
        const isSelected = savedAnswer === opt ? "selected" : "";
        htmlStr += `<label class="option ${isSelected}"><input type="radio" name="${q.id}" value="${opt}" style="display:none;" onchange="recordSelection('${q.id}', this.value)"><span>${opt}</span></label>`;
      });
    }
    htmlStr += `</div></div>`;
  });

  htmlStr += `</div>`;
  surveyContainer.innerHTML = htmlStr;

  if (prevBtn) prevBtn.style.visibility = currentSection === 0 ? "hidden" : "visible";
  if (currentSection === sections.length - 1) {
    if(nextBtn) nextBtn.classList.add("hidden"); 
    if(submitClaimBtn) submitClaimBtn.classList.remove("hidden");
  } else {
    if(nextBtn) nextBtn.classList.remove("hidden"); 
    if(submitClaimBtn) submitClaimBtn.classList.add("hidden");
  }
}

window.recordSelection = function(questionId, selectedValue) { answers[questionId] = selectedValue; renderSection(); };

function handleNextSection() {
  const sections = getSurveyData();
  const currentData = sections[currentSection];
  for (let q of currentData.questions) {
    if (!answers[q.id] || answers[q.id].trim() === "") {
      showToast("Please respond to all fields inside this analytical block.", "⚠️");
      return;
    }
  }
  if (currentSection < sections.length - 1) { currentSection++; renderSection(); updateExcitementBanner(); }
}

function handlePrevSection() { if (currentSection > 0) { currentSection--; renderSection(); updateExcitementBanner(); } }

function updateExcitementBanner() {
  const banner = document.getElementById("excitementBanner");
  if (!banner) return;
  if (currentSection === 0) { banner.style.display = "none"; return; }
  banner.style.display = "flex";
  banner.innerHTML = `<div style='color:white; font-size:14px;'>Allocated Milestone Node: <strong>${currentSection * 8} / 48 SYNX Accumulated</strong></div>`;
}

async function runProfileLedgerVerification(email) {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();

    if (statusResult.success) {
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

      displayConsumerBadgesUI("Analyzer");

      if(emailGateSection) emailGateSection.classList.add("hidden");
      if(claimForm) claimForm.classList.add("hidden");
      if(topProgressBox) topProgressBox.classList.add("hidden");
      if(surveyStepLinks) surveyStepLinks.classList.add("hidden");
      if(splashLandingGate) splashLandingGate.style.display = "none";
      
      if(dashboardTabLinks) dashboardTabLinks.classList.remove("hidden");
      routeDashboardTabs("hub");
    } else {
      if(emailGateSection) emailGateSection.classList.remove("hidden");
      currentSection = 0;
      renderSection();
    }
  } catch (err) {
    showToast("Ledger verification mapping error.", "❌");
  }
}

if (claimForm) {
  claimForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    claimForm.classList.add("hidden");
    const overlay = document.getElementById("rewardAnimationOverlay");
    if(overlay) overlay.style.display = "flex";

    const payload = {
      email: userEmailAddress, answers: answers,
      referredBy: localStorage.getItem("referralCode") || "",
      legal_consent: true, consent_timestamp: legalConsentTimestamp || new Date().toISOString(),
      user_agent: clientUserAgent || navigator.userAgent
    };

    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/submit-survey`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      setTimeout(async () => {
        if(overlay) overlay.style.display = "none";
        if (result.success) { await runProfileLedgerVerification(userEmailAddress); } 
        else { claimForm.classList.remove("hidden"); showToast(result.error || "Submission failure.", "❌"); }
      }, 3000);
    } catch (err) {
      if(overlay) overlay.style.display = "none";
      showToast("Submission transaction timed out.", "❌");
    }
  });
}

if (lockedClaimGatewayBtn) {
  lockedClaimGatewayBtn.addEventListener("click", () => {
    showToast("Opening Soon... Settlement gateways will activate upon operational validation phases.", "🔒");
  });
}

if (sidebarLogoutBtn) {
  sidebarLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem("syntrix_user_email");
    localStorage.removeItem("referralCode");
    userEmailAddress = ""; isOtpSent = false; currentSection = 0;
    
    if(dashboardTabLinks) dashboardTabLinks.classList.add("hidden");
    if(tabScreenHub) tabScreenHub.classList.add("hidden");
    if(tabScreenBadge) tabScreenBadge.classList.add("hidden");
    if(tabScreenReferrals) tabScreenReferrals.classList.add("hidden");
    
    if(surveyStepLinks) surveyStepLinks.classList.remove("hidden");
    if(emailGateForm) emailGateForm.reset();
    if(gateEmailInput) gateEmailInput.readOnly = false;
    const otpSec = document.getElementById("otpSection");
    if(otpSec) otpSec.classList.add("hidden");
    if(startSurveyBtn) startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
    
    if(mainApplicationLayout) mainApplicationLayout.classList.add("hidden");
    if(splashLandingGate) splashLandingGate.style.display = "flex";
    routeSplashNavViews("home");
    showToast("Account profiles successfully signed out.", "✓");
  });
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = e.target.dataset.tab;
    if (target) routeDashboardTabs(target);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (nextBtn) nextBtn.onclick = () => handleNextSection();
  if (prevBtn) prevBtn.onclick = () => handlePrevSection();
  if (copyReferralBtn) {
    copyReferralBtn.onclick = () => {
      if(referralCodeDisplay) {
        referralCodeDisplay.select();
        navigator.clipboard.writeText(referralCodeDisplay.value);
        copyReferralBtn.innerText = "Copied! ✓";
        setTimeout(() => { copyReferralBtn.innerText = "Copy Link"; }, 2000);
      }
    };
  }
});
