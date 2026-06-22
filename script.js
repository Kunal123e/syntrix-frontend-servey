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
const statusDiv = document.getElementById("status");
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

// ================= TRANSLATION ENGINE & BADGES =================

const langButtons = document.querySelectorAll(".langBtn");
langButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    langButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLanguage = btn.dataset.lang;
    
    translateMainHeadings();
    if (claimForm && !claimForm.classList.contains("hidden")) { 
      renderSection(); 
    }
  });
});

function translateMainHeadings() {
  if (typeof translations !== "undefined" && translations[currentLanguage]) {
    const mainTitleEl = document.getElementById("mainTitle");
    const mainSubtitleEl = document.getElementById("mainSubtitle");
    if (mainTitleEl && translations[currentLanguage].mainTitle) mainTitleEl.innerHTML = translations[currentLanguage].mainTitle;
    if (mainSubtitleEl && translations[currentLanguage].mainSubtitle) mainSubtitleEl.innerHTML = translations[currentLanguage].mainSubtitle;
  }
}

function getUIText(key) {
  const fallbacks = {
    validationRequired: "❌ Please answer all questions before continuing."
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

const BADGE_PROFILES = {
  Analyzer: { title: "ANALYZER", sub: "The Mindful Shopper", desc: "You shop with brilliant clarity! For you, real value and true quality matter most.", color: "#2563eb", textColor: "#0f172a", iconHTML: `<div style='padding:20px; font-size:40px;'>📊</div>` },
  Stylist: { title: "STYLIST", sub: "The Tasteful Explorer", desc: "You have a beautiful eye for design! Shopping is about joy and artistry.", color: "#8b5cf6", textColor: "#0f172a", iconHTML: `<div style='padding:20px; font-size:40px;'>🎨</div>` },
  Hedger: { title: "HEDGER", sub: "The Thoughtful Planner", desc: "You value peace of mind and total reliability! You love metrics and protection rules.", color: "#ea580c", textColor: "#0f172a", iconHTML: `<div style='padding:20px; font-size:40px;'>🛡️</div>` },
  Native: { title: "NATIVE", sub: "The Connected Heart", desc: "You deeply value genuine social connections and direct crowd trust profiles.", color: "#eab308", textColor: "#0f172a", iconHTML: `<div style='padding:20px; font-size:40px;'>🤝</div>` }
};

function displayConsumerBadgesUI(badgeKey) {
  const profile = BADGE_PROFILES[badgeKey] || BADGE_PROFILES.Analyzer;
  const badgeCard = document.getElementById("dashboardPsychologyBadgeCard");
  if (badgeCard) {
    badgeCard.style.background = "#ffffff";
    badgeCard.style.border = `2px solid ${profile.color}30`;
    badgeCard.style.borderRadius = "24px";
    badgeCard.style.padding = "30px";
    badgeCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:20px;">
        ${profile.iconHTML}
        <div>
          <div style="font-size: 11px; text-transform: uppercase; color: ${profile.color}; font-weight: 900; letter-spacing: 1px;">Unlocked Archetype</div>
          <h3 style="font-size: 28px; font-weight: 900; color: ${profile.textColor}; margin: 2px 0;">${profile.title}</h3>
          <p style="font-size: 14px; color: #64748b; line-height: 1.5;">${profile.desc}</p>
        </div>
      </div>`;
  }
}

function normalizeReferralCode(code) {
  if (!code) return "";
  let clean = code.trim().toUpperCase().replace(/\s+/g, "");
  if (!clean.startsWith("SYN-")) clean = "SYN-" + clean.replace("SYN", "");
  return clean;
}

// Navigation Tab Routing
function routeDashboardTabs(targetTab) {
  [tabScreenHub, tabScreenBadge, tabScreenReferrals].forEach(screen => {
    if(screen) screen.classList.add("hidden");
  });
  
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

// ================= STAGE 0 & 1: SESSION FLOW ROUTING =================

// Trigger: Click "Start Analytical Survey" on Landing Splash
if (initializePlatformBtn) {
  initializePlatformBtn.addEventListener("click", () => {
    if(splashLandingGate) splashLandingGate.classList.add("hidden");
    if(mainApplicationLayout) mainApplicationLayout.classList.remove("hidden");
    
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      runProfileLedgerVerification(userEmailAddress); // Bypass email, check backend
    } else {
      if(emailGateSection) emailGateSection.classList.remove("hidden");
    }
  });
}

// Email Verification Form Submit
if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const legalConsent = document.getElementById("legalConsent");
    if (legalConsent && !legalConsent.checked) {
      showToast("You must explicitly agree to the legal terms framework.", "⚖️");
      return;
    }
    
    if (!legalConsentTimestamp) {
      legalConsentTimestamp = new Date().toISOString();
      clientUserAgent = navigator.userAgent;
    }
    
    const emailVal = gateEmailInput.value.trim().toLowerCase();
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
      showToast("Please enter a valid authorized email coordinate.", "❌");
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
    if (otpVal.length !== 6) {
      showToast("Verification format requires exactly 6 characters.", "❌");
      return;
    }

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
        if (referredByCodeInput && referredByCodeInput.value.trim() !== "") {
          localStorage.setItem("referralCode", normalizeReferralCode(referredByCodeInput.value));
        }
        await runProfileLedgerVerification(emailVal);
      } else {
        showToast(result.error || "Cryptographic matching key match failure.", "❌");
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

// ================= STAGE 2: SURVEY LAYOUT ENGINE =================

function getSurveyData() { return typeof surveySections !== "undefined" ? surveySections : []; }

function renderSection() {
  const sections = getSurveyData();
  if (!sections || sections.length === 0 || !surveyContainer) return;
  const currentData = sections[currentSection];
  
  if (topProgressBox) topProgressBox.classList.remove("hidden");
  if (claimForm) claimForm.classList.remove("hidden");
  if (emailGateSection) emailGateSection.classList.add("hidden");

  document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
    if (idx === currentSection) st.classList.add("active");
    else st.classList.remove("active");
  });

  const progressPercent = ((currentSection + 1) / sections.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressText) progressText.innerText = `Progress ${currentSection + 1}/${sections.length}`;

  translateMainHeadings();

  let htmlStr = `<div class="survey-section-card"><h2 class="sectionTitle" style="font-size:24px; font-weight:800; margin-bottom:10px;">${getSectionTitle(currentData)}</h2>`;

  currentData.questions.forEach((q) => {
    const savedAnswer = answers[q.id] || "";
    htmlStr += `<div class="question" style="margin-top:24px;">
      <h3 style="font-weight:700; margin-bottom:12px; color:#1f1f1f;">${getQuestionText(q)}</h3><div class="options">`;

    if (q.type === "textarea") {
      htmlStr += `<textarea onchange="recordSelection('${q.id}', this.value)" placeholder="Type response...">${savedAnswer}</textarea>`;
    } else if (q.options) {
      q.options.forEach((opt) => {
        const isSelected = savedAnswer === opt ? "selected" : "";
        htmlStr += `<label class="option ${isSelected}"><input type="radio" name="${q.id}" value="${opt}" style="display:none;" onchange="recordSelection('${q.id}', this.value)"><span>${getOptionText(opt)}</span></label>`;
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

window.recordSelection = function(questionId, selectedValue) {
  answers[questionId] = selectedValue;
  renderSection();
};

function handleNextSection() {
  const sections = getSurveyData();
  const currentData = sections[currentSection];
  for (let q of currentData.questions) {
    if (!answers[q.id] || answers[q.id].trim === "") {
      showToast(getUIText("validationRequired"), "⚠️");
      return;
    }
  }
  if (currentSection < sections.length - 1) { 
    currentSection++; 
    renderSection(); 
    updateExcitementBanner(); 
  }
}

function handlePrevSection() { 
  if (currentSection > 0) { 
    currentSection--; 
    renderSection(); 
    updateExcitementBanner(); 
  } 
}

function updateExcitementBanner() {
  const banner = document.getElementById("excitementBanner");
  if (!banner) return;
  if (currentSection === 0) { banner.style.display = "none"; return; }
  banner.style.display = "flex";
  banner.innerHTML = `<div style='color:white; font-size:14px;'>Allocated Milestone Node: <strong>${currentSection * 8} / 48 SYNX Accumulated</strong></div>`;
}

// ================= STAGE 3: DASHBOARD LOGIC =================

async function runProfileLedgerVerification(email) {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();

    if (statusResult.success) {
      // User is verified & Survey is submitted
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${(statusResult.pendingRewards || 0)} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

      displayConsumerBadgesUI("Analyzer"); // Default for now

      // UI Switch to Dashboard
      if (emailGateSection) emailGateSection.classList.add("hidden");
      if (claimForm) claimForm.classList.add("hidden");
      if (topProgressBox) topProgressBox.classList.add("hidden");
      if (surveyStepLinks) surveyStepLinks.classList.add("hidden");
      
      if (dashboardTabLinks) dashboardTabLinks.classList.remove("hidden");
      routeDashboardTabs("hub");
    } else {
      // First Time -> Go to Survey
      if (emailGateSection) emailGateSection.classList.add("hidden");
      currentSection = 0;
      renderSection();
    }
  } catch (err) {
    showToast("Ledger interface pipeline authentication error.", "❌");
  }
}

// Submit Survey to Backend
if (claimForm) {
  claimForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    claimForm.classList.add("hidden");
    const overlay = document.getElementById("rewardAnimationOverlay");
    if(overlay) overlay.style.display = "flex";

    const payload = {
      email: userEmailAddress,
      answers: answers,
      referredBy: localStorage.getItem("referralCode") || "",
      legal_consent: true,
      consent_timestamp: legalConsentTimestamp || new Date().toISOString(),
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
        if (result.success) {
          await runProfileLedgerVerification(userEmailAddress);
        } else {
          claimForm.classList.remove("hidden");
          showToast(result.error || "Transaction block validation failure.", "❌");
        }
      }, 3000);
    } catch (err) {
      if(overlay) overlay.style.display = "none";
      showToast("Submission transaction timed out.", "❌");
      claimForm.classList.remove("hidden");
    }
  });
}

// ================= LOCKED WALLET & LOGOUT ROUTERS =================

if (lockedClaimGatewayBtn) {
  lockedClaimGatewayBtn.addEventListener("click", () => {
    showToast("Opening Soon... Settlement gateways will activate upon operational validation phases.", "🔒");
  });
}

if (sidebarLogoutBtn) {
  sidebarLogoutBtn.addEventListener("click", () => {
    // Clear Local Storage Context
    localStorage.removeItem("syntrix_user_email");
    localStorage.removeItem("referralCode");
    
    // Clear Memory
    userEmailAddress = "";
    isOtpSent = false;
    currentSection = 0;
    for (let prop in answers) { delete answers[prop]; }
    
    // UI Hard Reset
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
    if(splashLandingGate) splashLandingGate.classList.remove("hidden");
    
    showToast("Account profile successfully cleared from dashboard local nodes.", "✓");
  });
}

// Event Bindings setup
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = e.target.dataset.tab;
    if (target) routeDashboardTabs(target);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref) localStorage.setItem("referralCode", normalizeReferralCode(ref));

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
