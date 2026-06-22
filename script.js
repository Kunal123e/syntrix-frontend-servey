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

// Language Translation
const langButtons = document.querySelectorAll(".langBtn");
langButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    langButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLanguage = btn.dataset.lang;
    if (claimForm.classList.contains("hidden") === false) { renderSection(); }
  });
});

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

// Navigation Tab Routing
function routeDashboardTabs(targetTab) {
  [tabScreenHub, tabScreenBadge, tabScreenReferrals].forEach(screen => screen.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  
  const clickedBtn = document.querySelector(`[data-tab="${targetTab}"]`);
  if (clickedBtn) clickedBtn.classList.add("active");

  if (targetTab === "hub") tabScreenHub.classList.remove("hidden");
  if (targetTab === "badge") tabScreenBadge.classList.remove("hidden");
  if (targetTab === "referrals") tabScreenReferrals.classList.remove("hidden");
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

// Stage 0: Splash -> Check LocalStorage Auto Login
if (initializePlatformBtn) {
  initializePlatformBtn.addEventListener("click", () => {
    splashLandingGate.classList.add("hidden");
    const savedEmail = localStorage.getItem("syntrix_user_email");
    if (savedEmail) {
      userEmailAddress = savedEmail;
      runProfileLedgerVerification(userEmailAddress); // Bypass email, go to dash
    } else {
      emailGateSection.classList.remove("hidden");
    }
  });
}

// Stage 1: Email Form
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

  let htmlStr = `<div class="survey-section-card"><h2 class="sectionTitle" style="font-size:24px; font-weight:800; margin-bottom:10px;">${currentData.title}</h2>`;

  currentData.questions.forEach((q) => {
    const savedAnswer = answers[q.id] || "";
    htmlStr += `<div class="question" style="margin-top:24px;">
      <h3 style="font-weight:700; margin-bottom:12px; color:#1f1f1f;">${q.question || q.text}</h3><div class="options">`;

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
    nextBtn.classList.add("hidden"); submitClaimBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden"); submitClaimBtn.classList.add("hidden");
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
      showToast("Please respond to all fields inside this analytical register block.", "⚠️");
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

// Fetch dashboard data
async function runProfileLedgerVerification(email) {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const statusResult = await response.json();

    if (statusResult.success) {
      if (statTotalReferrals) statTotalReferrals.innerText = statusResult.referralsCount || "0";
      if (statPendingRewards) statPendingRewards.innerText = `${statusResult.pendingRewards || 0} SYN`;
      if (statTotalEarned) statTotalEarned.innerText = `${(statusResult.pendingRewards || 0)} SYN`;
      if (referralCodeDisplay) referralCodeDisplay.value = `${window.location.origin}/?ref=${statusResult.referralCode || ""}`;

      displayConsumerBadgesUI("Analyzer");

      // UI Switch to Dashboard
      emailGateSection.classList.add("hidden");
      claimForm.classList.add("hidden");
      topProgressBox.classList.add("hidden");
      surveyStepLinks.classList.add("hidden");
      splashLandingGate.classList.add("hidden");
      
      dashboardTabLinks.classList.remove("hidden");
      routeDashboardTabs("hub");
    } else {
      // First Time -> Go to Survey
      emailGateSection.classList.add("hidden");
      splashLandingGate.classList.add("hidden");
      currentSection = 0;
      renderSection();
    }
  } catch (err) {
    showToast("Ledger interface pipeline authentication error.", "❌");
  }
}

// Submit Survey
if (claimForm) {
  claimForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("claimForm").classList.add("hidden");
    document.getElementById("rewardAnimationOverlay").style.display = "flex";

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
        document.getElementById("rewardAnimationOverlay").style.display = "none";
        if (result.success) {
          await runProfileLedgerVerification(userEmailAddress);
        } else {
          document.getElementById("claimForm").classList.remove("hidden");
          showToast(result.error || "Transaction block validation failure.", "❌");
        }
      }, 3000);
    } catch (err) {
      document.getElementById("rewardAnimationOverlay").style.display = "none";
      showToast("Submission transaction timed out.", "❌");
    }
  });
}

// 🚀 LOCKED WALLET ACTION TRIGGER
if (lockedClaimGatewayBtn) {
  lockedClaimGatewayBtn.addEventListener("click", () => {
    showToast("Opening Soon... Settlement gateways will activate upon operational validation phases.", "🔒");
  });
}

// 🚀 LOGOUT FUNCTIONALITY
if (sidebarLogoutBtn) {
  sidebarLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem("syntrix_user_email");
    localStorage.removeItem("referralCode");
    userEmailAddress = "";
    isOtpSent = false;
    currentSection = 0;
    
    // UI Reset
    dashboardTabLinks.classList.add("hidden");
    tabScreenHub.classList.add("hidden");
    tabScreenBadge.classList.add("hidden");
    tabScreenReferrals.classList.add("hidden");
    
    surveyStepLinks.classList.remove("hidden");
    document.getElementById("emailGateForm").reset();
    gateEmailInput.readOnly = false;
    document.getElementById("otpSection").classList.add("hidden");
    startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
    
    splashLandingGate.classList.remove("hidden");
    showToast("Account profile successfully cleared.", "✓");
  });
}

// Listeners
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
      referralCodeDisplay.select();
      navigator.clipboard.writeText(referralCodeDisplay.value);
      copyReferralBtn.innerText = "Copied! ✓";
      setTimeout(() => { copyReferralBtn.innerText = "Copy Link"; }, 2000);
    };
  }
});
