// =========================================================================
// SYNTRIX CORE PLATFORM APPLICATION LOGIC ENGINE
// Architecture: Single Page Application Matrix Core
// Security Infrastructure: Web3Auth Embedded OAuth & Ethers Signer Gateway
// =========================================================================

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
    iconHTML: `<img src="BADGES PNG/badge 3.jpeg" alt="Stylist" style="width: 100%; height: 100%; object-fit: cover;">`, 
    color: "#8b5cf6", textColor: "#0f172a"
  },
  Hedger: { 
    title: "HEDGER", 
    sub: "The Thoughtful Planner",
    desc: "You value peace of mind and total reliability! You love knowing your purchases are safe and backed by great guarantees. By choosing trusted paths, you ensure every shopping experience is completely smooth, secure, and worry-free.", 
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

// ================= STAGE 1: EMAIL VERIFICATION GATE =================
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

// ================= STAGE 2: SURVEY RENDER SYSTEM =================
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

// Continued clean pipeline execution loops
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
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">शानदार! आपने अब तक <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">अगला मॉड्यूल पूरा करें Aur <strong style="color: #fbbf24;">8 Aur Paayein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">जारी रखें & दावा करें &gt;</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">अविश्वसनीय! आपने सभी <span style="color: #10b981; font-weight: 900; font-size: 18px;">56 SYNX</span> सुरक्षित कर लिए हैं!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">दावा करने के लिए नीचे सबमिट पर क्लिक करें!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 56 / 56 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">दावा करने के लिए तैयार</div></div>`;
      }
  } else if (currentLanguage === "hinglish") {
      if (sectionIndex < 7) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! Aapne ab tak <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> secure kar liye hain!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Next module complete karein aur <strong style="color: #fbbf24;">8 more payein!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Continue & Claim &gt;</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! Aapne sabhi <span style="color: #10b981; font-weight: 900; font-size: 18px;">56 SYNX</span> secure kar liye hain!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Neeche Submit button par click karke claim karein!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 56 / 56 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Ready to Claim</div></div>`;
      }
  } else {
      if (sectionIndex < 7) {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); animation: floatBox 2s ease-in-out infinite;">🔥</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Great job! You've secured <span style="color: #fbbf24; font-weight: 900; font-size: 18px;">${unlockedTokens} SYNX</span> so far!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Complete the next module to claim <strong style="color: #fbbf24;">8 more!</strong></div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #fbbf24; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ ${unlockedTokens} / ${totalTokens} ]</div><div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 6px; color: #d1d5db; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Continue & Claim &gt;</div></div>`;
      } else {
          banner.innerHTML = `<div style="display: flex; align-items: center; gap: 16px;"><div style="font-size: 38px; filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)); animation: floatBox 2s ease-in-out infinite;">✨</div><div><div style="color: #f3f4f6; font-size: 15px; font-weight: 500;">Incredible! You've secured all <span style="color: #10b981; font-weight: 900; font-size: 18px;">56 SYNX</span>!</div><div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Hit Submit below to transfer them to your wallet!</div></div></div><div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;"><div style="color: #10b981; font-weight: 900; font-size: 20px; letter-spacing: 2px;">[ 56 / 56 ]</div><div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 6px; color: #10b981; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Ready to Claim</div></div>`;
      }
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

      const computedBadgeKey = calculateConsumerPsychologyBadge();
      displayConsumerBadgesUI(computedBadgeKey);

      if (statusResult.exists === true) {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        if (claimForm) claimForm.classList.add("hidden");
        if (topProgressBox) topProgressBox.classList.add("hidden");
        if (rewardDashboardScreen) rewardDashboardScreen.classList.remove("hidden");
        outputTarget.innerHTML = "";

        const activeControls = document.getElementById("dashboardActiveClaimControls");
        const receiptBlock = document.getElementById("dashboardClaimReceiptBlock");

        if (statusResult.status === "whitelisted" || statusResult.isClaimed) {
          if (activeControls) activeControls.classList.add("hidden");
          if (receiptBlock) {
            receiptBlock.classList.remove("hidden");
            receiptBlock.innerHTML = `
              <div style="width: 60px; height: 60px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(245, 158, 11, 0.1); border: 2px solid #f59e0b; color: #f59e0b; font-size: 28px; font-weight: bold;">🔒</div>
              <h3 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">56 SYNX Allocation Whitelisted!</h3>
              <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 0; line-height: 1.4;">Your profile address <strong>${statusResult.walletAddress || ""}</strong> has been added to the genesis block. Redemption airdrop links will launch when the token goes mainnet live!</p>
            `;
          }
        } else {
          if (activeControls) activeControls.classList.remove("hidden");
          if (receiptBlock) receiptBlock.classList.add("hidden");
        }
      } else {
        if (emailGateSection) emailGateSection.classList.add("hidden");
        currentSection = 0;
        renderSection();
        outputTarget.innerHTML = "";
      }
    } else {
      if (!isFromModal) {
        if (emailGateSection) emailGateSection.classList.add("hidden");
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

  document.getElementById("claimForm").classList.add("hidden");
  const excitementBanner = document.getElementById("excitementBanner");
  if(excitementBanner) excitementBanner.style.display = "none";

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
    
    setTimeout(async () => {
      if (animOverlay) animOverlay.style.display = "none";
      if (result.success) {
        if (statusDiv) statusDiv.innerHTML = "";
        await runProfileLedgerVerification(userEmailAddress, false);
      } else {
        document.getElementById("claimForm").classList.remove("hidden"); 
        if (statusDiv) {
          statusDiv.innerHTML = `❌ ${result.error || "Submission rejected by registry backend."}`;
          statusDiv.style.color = "#ff4d4d";
        }
      }
    }, 3500);
  } catch (err) {
    if (animOverlay) animOverlay.style.display = "none";
    document.getElementById("claimForm").classList.remove("hidden");
    if (statusDiv) { statusDiv.innerHTML = "❌ Network transaction failed."; statusDiv.style.color = "#ff4d4d"; }
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
    if (closeBtn) closeBtn.onclick = () => creatorModal.classList.add("hidden");

    if (googleAuthBtn) {
      googleAuthBtn.onclick = null; 
      googleAuthBtn.onclick = async () => {
        if (!window.isWeb3AuthReady || !window.metamaskEmbeddedInstance) {
          if (statusDiv) { statusDiv.innerHTML = `⏳ Web3 Engine is still loading. Please wait a moment and click again.`; statusDiv.style.color = "#f59e0b"; }
          return;
        }
        if (statusDiv) { statusDiv.innerHTML = `⏳ Initializing secure Web3Auth portal via MetaMask parameters...`; statusDiv.style.color = "#a855f7"; }
        
        try {
          const provider = await window.metamaskEmbeddedInstance.connect();
          const EthersProviderClass = (window.ethers && window.ethers.BrowserProvider) || (window.ethers && window.ethers.providers && window.ethers.providers.Web3Provider);
          if (!EthersProviderClass) throw new Error("Ethers provider module not detected globally.");
          
          const ethersProvider = new EthersProviderClass(provider);
          const signer = await ethersProvider.getSigner();
          const realWeb3Address = await signer.getAddress();
          userConnectedWalletAddress = realWeb3Address.toLowerCase();

          if (isDirectClaimFlow) {
            if (claimConnectWalletBtn) claimConnectWalletBtn.classList.add("hidden");
            if (claimWalletConnectedBlock) claimWalletConnectedBlock.classList.remove("hidden");
            if (claimWalletAddressDisplay) claimWalletAddressDisplay.innerText = userConnectedWalletAddress + " (Web3Auth)";
          } else {
            if (dashboardWalletInput) dashboardWalletInput.value = userConnectedWalletAddress;
          }
          if (creatorModal) creatorModal.classList.add("hidden");
          if (statusDiv) { statusDiv.innerHTML = `✅ Authentic Web3 wallet generated and linked successfully!`; statusDiv.style.color = "#57d6c2"; }
        } catch (authErr) {
          console.error("Web3Auth verification abort:", authErr);
          if (statusDiv) { statusDiv.innerHTML = `❌ Connection cancelled or denied.`; statusDiv.style.color = "#ff4d4d"; }
        }
      };
    }
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
      if (dashboardWalletInput) dashboardWalletInput.value = userConnectedWalletAddress;
    }
  } catch (err) { console.error("MetaMask extension handshake failure:", err.message); }
}

async function handleManualClaimExecution() {
  if (!dashboardWalletInput) return;
  const targetWallet = dashboardWalletInput.value.trim();

  if (!WALLET_REGEX.test(targetWallet)) {
    alert("❌ Invalid EVM public address format.");
    return;
  }
  if (statusDiv) { statusDiv.innerHTML = `⚡ Ingesting reward request to transactional queue registers...`; statusDiv.style.color = "#a855f7"; }

  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/claim-reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmailAddress, walletAddress: targetWallet })
    });
    const result = await response.json();
    if (result.success) {
      if (statusDiv) { statusDiv.innerHTML = "✨ Address safely whitelisted for token launch deployment cycles."; statusDiv.style.color = "#57d6c2"; }
      if (dashboardWalletInput) dashboardWalletInput.value = "";
      setTimeout(async () => { await runProfileLedgerVerification(userEmailAddress, false); }, 4000);
    } else {
      if (statusDiv) { statusDiv.innerHTML = `❌ ${result.error || "Claim system execution failed."}`; statusDiv.style.color = "#ff4d4d"; }
    }
  } catch (err) {
    if (statusDiv) { statusDiv.innerHTML = "❌ Token execution communication gateway failure."; statusDiv.style.color = "#ff4d4d"; }
  }
}

async function initializeClaimSection(token) {
  if (!claimScreenSection) return;
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/claim-details?token=${encodeURIComponent(token)}`);
    const details = await response.json();
    const gear = document.getElementById("claimLoadingGear");
    if (gear) gear.classList.add("hidden");

    if (details.success) {
      const staticIcon = document.getElementById("claimStaticIcon");
      const title = document.getElementById("claimScreenTitle");
      const sub = document.getElementById("claimInfoSubtitle");
      const detailsBox = document.getElementById("claimRewardDetails");
      const panel = document.getElementById("claimActionPanel");

      if (staticIcon) staticIcon.classList.remove("hidden");
      if (title) title.innerText = "Claim Authorized Successfully";
      if (sub) sub.innerText = "Please authenticate ledger registry requirements below via message validation structures.";
      if (detailsBox) detailsBox.classList.remove("hidden");
      if (panel) panel.classList.remove("hidden");

      if (document.getElementById("claimInfoEmail")) document.getElementById("claimInfoEmail").innerText = details.email;
      if (document.getElementById("claimInfoType")) document.getElementById("claimInfoType").innerText = details.type || "Airdrop Claim";
      if (document.getElementById("claimInfoAmount")) document.getElementById("claimInfoAmount").innerText = `${details.amount || 56} SYNX`;
      
      claimScreenSection.dataset.email = details.email; claimScreenSection.dataset.token = token;
    } else {
      showClaimScreenError("Link Expired or Invalid", details.error || "The credential profile matches an invalid registration framework.");
    }
  } catch (err) { 
    const gear = document.getElementById("claimLoadingGear");
    if (gear) gear.classList.add("hidden"); 
    showClaimScreenError("Network Error", "Failed to retrieve registration records."); 
  }
}

function showClaimScreenError(title, subtitle) {
  const staticIcon = document.getElementById("claimStaticIcon");
  const heading = document.getElementById("claimScreenTitle");
  const sub = document.getElementById("claimInfoSubtitle");
  const errBox = document.getElementById("claimErrorBox");
  const detailsBox = document.getElementById("claimRewardDetails");
  const panel = document.getElementById("claimActionPanel");

  if (staticIcon) staticIcon.classList.add("hidden");
  if (heading) heading.innerText = title;
  if (sub) sub.innerText = subtitle;
  if (errBox) errBox.classList.remove("hidden");
  if (detailsBox) detailsBox.classList.add("hidden");
  if (panel) panel.classList.add("hidden");
}

async function handleSignatureTokenRelease() {
  if (!claimScreenSection) return;
  const email = claimScreenSection.dataset.email;
  const token = claimScreenSection.dataset.token;
  if (!userConnectedWalletAddress) { alert("Please re-establish MetaMask structural configurations."); return; }

  try {
    const message = `Authenticating Token Core distribution protocols on email registry node: ${email}`;
    let signature;
    if (window.ethereum && typeof window.ethereum.request === "function") {
      signature = await window.ethereum.request({ method: "personal_sign", params: [message, userConnectedWalletAddress] });
    } else {
      const provider = window.metamaskEmbeddedInstance.provider;
      signature = await provider.request({ method: "personal_sign", params: [message, userConnectedWalletAddress] });
    }

    const panel = document.getElementById("claimActionPanel");
    const detailsBox = document.getElementById("claimRewardDetails");
    const heading = document.getElementById("claimScreenTitle");
    const sub = document.getElementById("claimInfoSubtitle");
    const gear = document.getElementById("claimLoadingGear");

    if (panel) panel.classList.add("hidden");
    if (detailsBox) detailsBox.classList.add("hidden");
    if (heading) heading.innerText = "Processing Verification Pipeline...";
    if (sub) sub.innerText = "Appending distribution requests directly to transaction loop blocks...";
    if (gear) gear.classList.remove("hidden");

    const response = await fetchWithTimeout(`${BACKEND_URL}/api/execute-claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token, signature: signature, walletAddress: userConnectedWalletAddress })
    });

    const txResult = await response.json();
    if (gear) gear.classList.add("hidden");

    if (txResult.success) {
      const staticIcon = document.getElementById("claimStaticIcon");
      if (staticIcon) staticIcon.classList.add("hidden");
      if (heading) heading.innerText = "Claim Received Successfully!";
      if (sub) sub.innerHTML = "✨ Your distribution is currently being written into our block processing layers.";
    } else { showClaimScreenError("Transaction Revoked", txResult.error || "The processing smart contract rejected token asset distributions."); }
  } catch (err) { 
    const gear = document.getElementById("claimLoadingGear");
    if (gear) gear.classList.add("hidden"); 
    alert("Cryptographic signature process rejected or timed out."); 
  }
}

function handleReferralLinkCopy() {
  if (!referralCodeDisplay) return;
  referralCodeDisplay.select(); referralCodeDisplay.setSelectionRange(0, 99999);
  try {
    navigator.clipboard.writeText(referralCodeDisplay.value);
    if (copyReferralBtn) {
      const originalText = copyReferralBtn.innerText; copyReferralBtn.innerText = "Copied! ✓";
      setTimeout(() => { copyReferralBtn.innerText = originalText; }, 2000);
    }
  } catch (err) { alert("Failed to access system registers."); }
}

const dismissModal = () => { if (retrieveModal) retrieveModal.classList.add("hidden"); };

function resetApplicationFlowState() {
  if (emailGateForm) emailGateForm.reset();
  localStorage.removeItem("syntrix_user_email"); localStorage.removeItem("referralCode");
  if (statusDiv) statusDiv.innerHTML = "";
  userEmailAddress = ""; currentSection = 0; isOtpSent = false;
  const otpSection = document.getElementById("otpSection"); if (otpSection) otpSection.classList.add("hidden");
  if (startSurveyBtn) startSurveyBtn.innerHTML = "Send Verification Code &rarr;";
  if (gateEmailInput) gateEmailInput.readOnly = false;
  for (const prop in answers) { if (Object.prototype.hasOwnProperty.call(answers, prop)) delete answers[prop]; }
  if (emailGateSection) emailGateSection.classList.remove("hidden");
  if (claimForm) claimForm.classList.add("hidden"); if (topProgressBox) topProgressBox.classList.add("hidden");
  if (rewardDashboardScreen) rewardDashboardScreen.classList.add("hidden");
  document.querySelectorAll(".step").forEach((st, idx) => { if (idx === 0) st.classList.add("active"); else st.classList.remove("active"); });
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

  if (claimToken) {
    if (emailGateSection) emailGateSection.classList.add("hidden"); if (claimForm) claimForm.classList.add("hidden");
    if (topProgressBox) topProgressBox.classList.add("hidden"); if (rewardDashboardScreen) rewardDashboardScreen.classList.add("hidden");
    await initializeClaimSection(claimToken);
  } else {
    const localSavedEmail = localStorage.getItem("syntrix_user_email");
    if (localSavedEmail) { userEmailAddress = localSavedEmail; await runProfileLedgerVerification(userEmailAddress, false); }
  }

  if (nextBtn) nextBtn.onclick = () => handleNextSection();
  if (prevBtn) prevBtn.onclick = () => handlePrevSection();
  if (claimForm) {
    claimForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSurveySubmission(e);
    });
  }
  if (executeClaimBtn) executeClaimBtn.onclick = () => handleManualClaimExecution();
  
  if (connectWalletBtn) connectWalletBtn.onclick = () => connectWallet(false);
  if (claimConnectWalletBtn) claimConnectWalletBtn.onclick = () => connectWallet(true);
  
  if (submitClaimRewardBtn) submitClaimRewardBtn.onclick = () => handleSignatureTokenRelease();
  if (copyReferralBtn) copyReferralBtn.onclick = () => handleReferralLinkCopy();

  if (menuToggleBtn && optionsPopover) {
    menuToggleBtn.onclick = (e) => { e.stopPropagation(); optionsPopover.classList.toggle("hidden"); };
    document.addEventListener("click", () => optionsPopover.classList.add("hidden"));
  }
  if (menuRestartBtn) {
    menuRestartBtn.onclick = () => { if (confirm("Clear session progress?")) resetApplicationFlowState(); };
  }

  if (menuRecoverBtn && retrieveModal) {
    menuRecoverBtn.onclick = () => {
      retrieveModal.classList.remove("hidden");
      if (modalEmailInput) modalEmailInput.value = "";
      if (modalStatus) modalStatus.innerHTML = "";
      
      if (confirmRetrieveBtn) {
        confirmRetrieveBtn.onclick = async () => {
          const searchEmail = modalEmailInput ? modalEmailInput.value.trim().toLowerCase() : "";
          if (!searchEmail || !EMAIL_REGEX.test(searchEmail)) {
            if (modalStatus) { modalStatus.innerHTML = "❌ Please provide a valid email structure."; modalStatus.style.color = "#ff4d4d"; }
            return;
          }
          await runProfileLedgerVerification(searchEmail, true);
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
      if (claimForm && !claimForm.classList.contains("hidden")) renderSection();
    });
  });
});
