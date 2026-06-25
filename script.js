showToast(getUIText("validationRequired"), "⚠️"); return; }
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
  const unlockedTokens = sectionIndex * 8; const totalTokens = 48;
  banner.style.display = "flex";
  banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! You've secured <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> so far!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Complete the next module to claim <strong style="color: #fbbf24;">8 more!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px;">[ ${unlockedTokens} / ${totalTokens} ]</div></div>`;
}

async function runProfileLedgerVerification(email, isFromModal = false) {
  const outputTarget = isFromModal ? modalStatus : statusDiv;
  if (!outputTarget) return;

  outputTarget.innerHTML = `⏳ ${getUIText("checkingLedger")}`;
  outputTarget.style.color = "#57d6c2";

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();
    if (isFromModal && retrieveModal) retrieveModal.style.display = "none";

    if (statusResult.success) {
      userEmailAddress = email;
      localStorage.setItem("syntrix_user_email", email);
      
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

      displayConsumerBadgesUI("Analyzer");

      if (statusResult.exists === true) {
        if (emailGateSection) emailGateSection.style.display = "none";
        if (claimForm) claimForm.style.display = "none";
        if (topProgressBox) topProgressBox.style.display = "none";
        
        const surveyStepLinks = document.getElementById("surveyStepLinks");
        if (surveyStepLinks) surveyStepLinks.style.display = "none";
        
        if (dashboardTabLinks) dashboardTabLinks.style.display = "flex";
        routeDashboardTabs("hub");
        outputTarget.innerHTML = "";
      } else {
        if (emailGateSection) emailGateSection.style.display = "none";
        currentSection = 0; renderSection(); outputTarget.innerHTML = "";
      }
    } else {
      if (!isFromModal) {
        if (emailGateSection) emailGateSection.style.display = "block";
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

  if(claimForm) claimForm.style.display = "none";
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
        if(claimForm) claimForm.style.display = "block";
        showToast(`${result.error || "Submission rejected."}`, "❌");
      }
    }, 3500);
  } catch (err) {
    if (animOverlay) animOverlay.style.display = "none";
    if(claimForm) claimForm.style.display = "block";
    showToast("Network transaction failed.", "❌");
  }
}

if (lockedClaimGatewayBtn) lockedClaimGatewayBtn.addEventListener("click", () => { showToast("Opening Soon... Settlement gateways will activate upon validation.", "🔒"); });

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email"); localStorage.removeItem("referralCode");
  if (statusDiv) statusDiv.innerHTML = "";
  userEmailAddress = ""; currentSection = 0; isOtpSent = false;
  legalConsentTimestamp = ""; clientUserAgent = ""; 
  const otpSection = document.getElementById("otpSection"); if (otpSection) otpSection.style.display = "none";
  if (startSurveyBtn) startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
  if (gateEmailInput) gateEmailInput.readOnly = false;
  for (const prop in answers) { if (Object.prototype.hasOwnProperty.call(answers, prop)) delete answers[prop]; }
  
  if (dashboardTabLinks) dashboardTabLinks.style.display = "none";
  if (tabScreenHub) tabScreenHub.style.display = "none";
  if (tabScreenBadge) tabScreenBadge.style.display = "none";
  if (tabScreenReferrals) tabScreenReferrals.style.display = "none";
  
  const surveyStepLinks = document.getElementById("surveyStepLinks");
  if (surveyStepLinks) surveyStepLinks.style.display = "flex";
  
  if (mainApplicationLayout) mainApplicationLayout.style.display = "none";
  if (splashLandingGate) splashLandingGate.style.display = "flex";
  routeSplashNavViews("home");
  showToast("Account successfully signed out.", "✓");
}

// ================= LIFE CYCLE EVENT ROUTERS =================
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
      } catch (err) { showToast("Failed to copy link.", "❌"); }
    }
  }

  if (menuToggleBtn && optionsPopover) {
    menuToggleBtn.onclick = (e) => { 
      e.stopPropagation(); 
      if(optionsPopover.style.display === "none") { optionsPopover.style.display = "block"; } 
      else { optionsPopover.style.display = "none"; }
    };
    document.addEventListener("click", () => optionsPopover.style.display = "none");
  }

  if (menuRestartBtn && confirmRestartModal) menuRestartBtn.onclick = () => { optionsPopover.style.display = "none"; confirmRestartModal.style.display = "flex"; };
  if (cancelRestartBtn && confirmRestartModal) cancelRestartBtn.onclick = () => confirmRestartModal.style.display = "none";
  if (confirmRestartBtn && confirmRestartModal) confirmRestartBtn.onclick = () => { confirmRestartModal.style.display = "none"; resetApplicationFlowState(); };

  if (menuRecoverBtn && retrieveModal) {
    menuRecoverBtn.onclick = () => {
      retrieveModal.style.display = "flex";
      if (modalEmailInput) modalEmailInput.value = "";
      if (modalStatus) modalStatus.innerHTML = "";
      
      if (confirmRetrieveBtn) {
        confirmRetrieveBtn.onclick = async () => {
          const searchEmail = modalEmailInput ? modalEmailInput.value.trim().toLowerCase() : "";
          if (!searchEmail || !EMAIL_REGEX.test(searchEmail)) { showToast("Please provide a valid email.", "❌"); return; }
          // Trigger splash to hide and App body to open directly on recovery
          splashLandingGate.style.display = "none";
          mainApplicationLayout.style.display = "flex";
          await runProfileLedgerVerification(searchEmail, true);
        };
      }
    };
  }

  if (closeModalBtn) closeModalBtn.onclick = () => { if(retrieveModal) retrieveModal.style.display = "none"; };
  if (cancelModalBtn) cancelModalBtn.onclick = () => { if(retrieveModal) retrieveModal.style.display = "none"; };

  const langButtons = document.querySelectorAll(".langBtn");
  langButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      langButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active"); currentLanguage = btn.dataset.lang;
      // Handle Translations here if needed
      updateExcitementBanner(currentSection); 
      if (claimForm && claimForm.style.display !== "none") renderSection();
    });
  });
});
// =========================================================================
// SYNTRIX CORE PLATFORM APPLICATION LOGIC ENGINE
// =========================================================================

const BACKEND_URL = "https://syntrix-airdrop.onrender.com";
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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

const statTotalReferrals = document.getElementById("statTotalReferrals");
const statPendingRewards = document.getElementById("statPendingRewards");
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
  if (!toast) return;
  toastMsg.innerText = message;
  toast.style.display = "flex";
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); setTimeout(()=>toast.style.display="none", 500); }, 3500);
}

// ================= MODAL DISPLAY LOGIC =================
function openLegalModal() { 
  const modal = document.getElementById("legalModal");
  if(modal) { modal.style.display = "flex"; }
}
function closeLegalModal() { 
  const modal = document.getElementById("legalModal");
  if(modal) { modal.style.display = "none"; }
}

// ================= 🚀 SPLASH PAGE ISOLATED ROUTING (FIXED STACKING) =================
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
document.getElementById("navLogoHomeTrigger").addEventListener("click", () => routeSplashNavViews("home"));
document.querySelectorAll(".back-to-home-btn").forEach(btn => btn.addEventListener("click", () => routeSplashNavViews("home")));

if (navGetStartedAction) {
  navGetStartedAction.addEventListener("click", () => {
    document.getElementById("initializePlatformBtn").click();
  });
}

if (document.getElementById("initializePlatformBtn")) {
  document.getElementById("initializePlatformBtn").addEventListener("click", () => {
    if(splashLandingGate) splashLandingGate.style.display = "none"; 
    if(mainApplicationLayout) mainApplicationLayout.style.display = "flex"; 
    
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      runProfileLedgerVerification(userEmailAddress, false);
    } else {
      if (emailGateSection) emailGateSection.style.display = "block";
    }
  });
}

// ================= DASHBOARD APP TABS (FIXED STACKING) =================
function routeDashboardTabs(targetTab) {
  if (tabScreenHub) tabScreenHub.style.display = "none";
  if (tabScreenBadge) tabScreenBadge.style.display = "none";
  if (tabScreenReferrals) tabScreenReferrals.style.display = "none";
  
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  const clickedBtn = document.querySelector(`[data-tab="${targetTab}"]`);
  if (clickedBtn) clickedBtn.classList.add("active");

  if (targetTab === "hub" && tabScreenHub) tabScreenHub.style.display = "block";
  if (targetTab === "badge" && tabScreenBadge) tabScreenBadge.style.display = "block";
  if (targetTab === "referrals" && tabScreenReferrals) tabScreenReferrals.style.display = "block";
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = e.target.dataset.tab;
    if (target) routeDashboardTabs(target);
  });
});

// ================= REGULAR FUNCTIONS =================
const BADGE_PROFILES = {
  Analyzer: { title: "ANALYZER", sub: "The Mindful Shopper", desc: "You shop with brilliant clarity! For you, real value and true quality matter most.", color: "#2563eb", textColor: "#0f172a", iconHTML: `📊` }
};

function displayConsumerBadgesUI(badgeKey) {
  const profile = BADGE_PROFILES[badgeKey] || BADGE_PROFILES.Analyzer;
  const badgeCard = document.getElementById("dashboardPsychologyBadgeCard");
  if (badgeCard) {
    badgeCard.style.display = "flex";
    badgeCard.style.background = "#ffffff";
    badgeCard.style.border = `2px solid ${profile.color}30`;
    badgeCard.style.borderRadius = "24px";
    badgeCard.style.padding = "30px";
    badgeCard.style.marginBottom = "35px";
    badgeCard.style.alignItems = "center";
    badgeCard.style.gap = "30px";
    badgeCard.style.textAlign = "left";
    badgeCard.innerHTML = `<div style="font-size: 50px;">${profile.iconHTML}</div><div><div style="font-size: 11px; text-transform: uppercase; color: ${profile.color}; font-weight: 900;">Persona Unlocked</div><h3 style="font-size: 32px; font-weight: 900; color: ${profile.textColor};">${profile.title}</h3><p style="font-size: 15px; color: #64748b;">${profile.desc}</p></div>`;
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

// ================= STAGE 1: EMAIL VERIFICATION =================
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
          if (otpSection) otpSection.style.display = "block";
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
function getSectionTitle(section) { if (typeof sectionTranslations !== "undefined" && sectionTranslations[currentLanguage]) { return sectionTranslations[currentLanguage][section.title] || section.title; } return section.title || ""; }
function getQuestionText(q) { if (typeof questionTranslations !== "undefined" && questionTranslations[currentLanguage]) { return questionTranslations[currentLanguage][q.id] || q.text || q.id; } return q.question || q.id; }
function getOptionText(opt) { if (typeof optionTranslations !== "undefined" && optionTranslations[currentLanguage]) { return optionTranslations[currentLanguage][opt] || opt; } return opt; }

function validateCurrentSectionAnswers() {
  const sections = getSurveyData();
  const currentData = sections[currentSection];
  if (!currentData) return false;
  for (let q of currentData.questions) { 
    if (q.type === "textarea") { if (!answers[q.id] || answers[q.id].trim() === "") return false; } else { if (!answers[q.id]) return false; }
  }
  return true;
}

function renderSection() {
  const sections = getSurveyData();
  if (!sections || sections.length === 0 || !surveyContainer) return;
  const currentData = sections[currentSection];
  
  if (topProgressBox) topProgressBox.style.display = "block";
  if (claimForm) claimForm.style.display = "block";
  if (emailGateSection) emailGateSection.style.display = "none";

  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === currentSection) st.classList.add("active"); else st.classList.remove("active");
  });

  const progressPercent = ((currentSection + 1) / sections.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

  let htmlStr = `<div class="survey-section-card animate-fade-in"><h2 class="sectionTitle" style="font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 5px;">${getSectionTitle(currentData)}</h2>`;

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

  if (prevBtn) prevBtn.style.display = currentSection === 0 ? "none" : "block";
  if (currentSection === sections.length - 1) {
    if (nextBtn) nextBtn.style.display = "none";
    if (submitClaimBtn) submitClaimBtn.style.display = "block";
  } else {
    if (nextBtn) nextBtn.style.display = "block";
    if (submitClaimBtn) submitClaimBtn.style.display = "none";
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
  const unlockedTokens = sectionIndex * 8; const totalTokens = 48;
  banner.style.display = "flex";
  banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! You've secured <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> so far!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Complete the next module to claim <strong style="color: #fbbf24;">8 more!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px;">[ ${unlockedTokens} / ${totalTokens} ]</div></div>`;
}

async function runProfileLedgerVerification(email, isFromModal = false) {
  const outputTarget = isFromModal ? modalStatus : statusDiv;
  if (!outputTarget) return;

  outputTarget.innerHTML = `⏳ ${getUIText("checkingLedger")}`;
  outputTarget.style.color = "#57d6c2";

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();
    if (isFromModal && retrieveModal) retrieveModal.style.display = "none";

    if (statusResult.success) {
      userEmailAddress = email;
      localStorage.setItem("syntrix_user_email", email);
      
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

      displayConsumerBadgesUI("Analyzer");

      if (statusResult.exists === true) {
  
