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

// ================= COGNITIVE PSYCHOLOGY BADGE RULES ENGINE =================
// 🚀 FIXED: Double declaration removed and image mapping perfectly synchronized
const BADGE_PROFILES = {
  Analyzer: { 
    title: "ANALYZER", 
    sub: "The Mindful Shopper",
    desc: "You shop with brilliant clarity! For you, real value and true quality matter most. By thoughtfully comparing details and trusting genuine reviews, you always make incredibly smart and satisfying choices.", 
    iconHTML: `<img src="BADGES PNG/badge 1 analyzer.jpeg" alt="Analyzer" style="width: 100%; height: 100%; object-fit: cover;">`, 
    color: "#2563eb", textColor: "#0f172a"
  },
  Stylist: { 
    title: "STYLIST", 
    sub: "The Tasteful Explorer",
    desc: "You have a beautiful eye for design! For you, shopping is about joy, artistry, and wonderful experiences. You naturally gravitate towards things that tell a great story and bring an extra touch of elegance into your everyday life.", 
    // 🚀 MAPS TO YOUR TRIANGLE LOGO (badge 3.jpeg)
    iconHTML: `<img src="BADGES PNG/badge 3.jpeg" alt="Stylist" style="width: 100%; height: 100%; object-fit: cover;">`, 
    color: "#8b5cf6", textColor: "#0f172a"
  },
  Hedger: { 
    title: "HEDGER", 
    sub: "The Thoughtful Planner",
    desc: "You value peace of mind and total reliability! You love knowing your purchases are safe and backed by great guarantees. By choosing trusted paths, you ensure every shopping experience is completely smooth, secure, and worry-free.", 
    // 🚀 MAPS TO YOUR ORANGE DESIGN (badge 2.jpeg)
    iconHTML: `<img src="BADGES PNG/badge 2.jpeg" alt="Hedger" style="width: 100%; height: 100%; object-fit: cover;">`, 
    color: "#ea580c", textColor: "#0f172a"
  },
  Native: { 
    title: "NATIVE", 
    sub: "The Connected Heart",
    desc: "You deeply value genuine connections! Your best shopping moments come from trusted recommendations and shared stories. By listening to friends and family, you always bring home products that carry real warmth and authenticity.", 
    iconHTML: `<img src="BADGES PNG/badge 4.jpeg" alt="Native" style="width: 100%; height: 100%; object-fit: cover;">`, 
    color: "#eab308", textColor: "#0f172a"
  }
};

function calculateConsumerPsychologyBadge() {
  let scores = { Analyzer: 0, Stylist: 0, Hedger: 0, Native: 0 };

  for (const qId in answers) {
    const ans = String(answers[qId]);
    if (!ans) continue;

    if (
      ans.includes("Too Expensive") || ans.includes("Poor Reviews") || 
      ans.includes("Ratings & Reviews") || ans.includes("I try if reviews are good") || 
      ans.includes("Positive Reviews") || ans.includes("Discount") || 
      ans.includes("Always") || ans.includes("Electronics & Gadgets")
    ) { scores.Analyzer += 2; }

    if (
      ans.includes("Content Creator") || ans.includes("Above 50%") || 
      ans.includes("Instagram") || ans.includes("YouTube") || 
      ans.includes("Professional Website") || ans.includes("Brand Reputation") || 
      ans.includes("I love trying new brands") || ans.includes("Limited Stock") || 
      ans.includes("Fashion & Clothing") || ans.includes("Beauty & Personal Care")
    ) { scores.Stylist += 2; }

    if (
      ans.includes("Shipping Cost") || ans.includes("Low Trust") || 
      ans.includes("Payment Failure") || ans.includes("Free Only") || 
      ans.includes("Cash on Delivery") || ans.includes("avoid unknown brands") || 
      ans.includes("rarely try unknown") || ans.includes("Only if Necessary") || 
      ans.includes("Keep it Private")
    ) { scores.Hedger += 2; }

    if (
      ans.includes("Friends & Family") || ans.includes("Influencers") || 
      ans.includes("WhatsApp") || ans.includes("Friend Recommendation") || 
      ans.includes("Very Often") || ans.includes("Share on Social Media") || 
      ans.includes("Recommend to Friends")
    ) { scores.Native += 2; }
  }

  let tieBreaker = "Stylist"; 
  let maxScore = 0;
  
  for (const key in scores) {
    if (scores[key] > maxScore) { 
      maxScore = scores[key]; 
      tieBreaker = key; 
    }
  }
  return tieBreaker;
}

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
  if (dropdownBadgeWrapper && dropdownBadgeText) {
    dropdownBadgeWrapper.style.display = "block";
    dropdownBadgeText.innerText = profile.title;
    dropdownBadgeText.style.color = profile.color;
  }
}

// ================= GLOBAL HELPERS & FORM VALIDATION MATRIX =================
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

// ================= REST OF LONGFORM HANDLERS REMAIN INTACT =================
function getUIText(key) {
  const fallbacks = {
    validationRequired: "❌ Please answer all questions before continuing.",
    submitting: "⏳ Storing survey data metrics across secure registers...",
    claiming: "⚡ Appending whitelist configuration parameters...",
    checkingLedger: "🔍 Authenticating communication profile ledger status..."
  };
  if (typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  return fallbacks[key] || key;
}

if (emailGateForm) {
  emailGateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!gateEmailInput) return;
    
    const emailVal = gateEmailInput.value.trim().toLowerCase();
    
    if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
      if (statusDiv) { statusDiv.innerHTML = "❌ Please input a valid email address."; statusDiv.style.color = "#ff4d4d"; }
      return;
    }

    if (!isOtpSent) {
      if (statusDiv) { statusDiv.innerHTML = "⏳ Sending verification code..."; statusDiv.style.color = "#57d6c2"; }
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
          if (statusDiv) { statusDiv.innerHTML = "❌ " + (result.error || "Failed to send code."); statusDiv.style.color = "#ff4d4d"; }
        }
      } catch (err) {
        if (statusDiv) { statusDiv.innerHTML = "❌ Network error. Could not send code."; statusDiv.style.color = "#ff4d4d"; }
      }
      return; 
    }

    const gateOtpInput = document.getElementById("gateOtp");
    const otpVal = gateOtpInput ? gateOtpInput.value.trim() : "";

    if (!otpVal || otpVal.length !== 6) {
      if (statusDiv) { statusDiv.innerHTML = "❌ Please enter the 6-digit verification code."; statusDiv.style.color = "#ff4d4d"; }
      return;
    }

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
        await runProfileLedgerVerification(emailVal, false);
      } else {
        if (statusDiv) { statusDiv.innerHTML = "❌ " + (result.error || "Invalid or expired code."); statusDiv.style.color = "#ff4d4d"; }
      }
    } catch (err) {
      if (statusDiv) { statusDiv.innerHTML = "❌ Network error. Could not verify code."; statusDiv.style.color = "#ff4d4d"; }
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
    alert(getUIText("validationRequired"));
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

// ================= STAGE 2: SURVEY RENDER SYSTEM =================
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

    document.querySelectorAll(".sidebar .step").forEach((st, idx) => {
      if (idx === currentSection) st.classList.add("active");
      else st.classList.remove("active");
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
  const totalTokens = 56;
  banner.style.display = "flex";
  banner.style.animation = 'none'; banner.offsetHeight; banner.style.animation = 'slideDown 0.5s ease-out';

  if (currentLanguage === "hi") {
      if (sectionIndex < 7) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">शानदार! आपने अब तक <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">अगला मॉड्यूल पूरा करें Aur <strong style="color: #fbbf24;">8 Aur Paay
