// ================= CONFIGURATION =================
const API_BASE_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://localhost:5000"
  : window.location.origin; // Adapts to production backend automatically

// State Variables
let userEmail = "";
let userReferralCode = "";
let currentStep = 0; // 0 = Email Gate, 1 to 7 = Survey Sections
let selectedLanguage = "en"; // en, hi, hinglish
let surveyAnswers = {};

// ================= UTILITIES =================
function showStatus(type, message) {
  const statusDiv = document.getElementById("status");
  if (!statusDiv) return;
  
  statusDiv.className = `alert alert-${type}`;
  statusDiv.innerHTML = `
    <div style="padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; font-weight: 500; text-align: left;
      ${type === 'success' ? 'background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981;' : 
        type === 'danger' ? 'background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444;' : 
        'background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); color: #6366f1;'}">
      <span>${type === 'success' ? '✅' : type === 'danger' ? '❌' : 'ℹ️'}</span> ${message}
    </div>
  `;
  statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearStatus() {
  const statusDiv = document.getElementById("status");
  if (statusDiv) statusDiv.innerHTML = "";
}

// ================= SPA ROUTER AND GATEKEEPER =================
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const claimToken = urlParams.get("token");
  const refParam = urlParams.get("ref");
  
  // Phase 3: Check and store referral code from URL parameter
  if (refParam) {
    localStorage.setItem("referralCode", refParam.trim().toUpperCase());
    // Strip query parameters for clean URL aesthetic
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // Fill referredByCode input if code exists in localStorage
  const savedRefCode = localStorage.getItem("referralCode");
  const refInput = document.getElementById("referredByCode");
  if (savedRefCode && refInput) {
    refInput.value = savedRefCode;
  }
  
  // Check if router needs to load claim screen (Phase 9)
  const isClaimPath = window.location.pathname.includes("/claim") || claimToken;
  
  if (isClaimPath && claimToken) {
    // Hide standard workflow, display claims screen
    document.getElementById("emailGateSection").classList.add("hidden");
    document.getElementById("claimForm").classList.add("hidden");
    document.getElementById("rewardDashboardScreen").classList.add("hidden");
    document.getElementById("claimScreenSection").classList.remove("hidden");
    
    // De-activate sidebar step tracking
    document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
    
    initializeClaimSection(claimToken);
  } else {
    // Normal onboarding setup
    document.getElementById("claimScreenSection").classList.add("hidden");
    initializeSurveyDashboard();
  }
});

// ================= ONBOARDING SURVEY & DASHBOARD FLOW =================
function initializeSurveyDashboard() {
  // Restore logged-in session if applicable
  const savedEmail = localStorage.getItem("syntrix_user_email");
  if (savedEmail) {
    userEmail = savedEmail;
    loadDashboard(savedEmail);
  }
  
  // Onboarding gate submission (Phase 4 & 5)
  const emailGateForm = document.getElementById("emailGateForm");
  if (emailGateForm) {
    emailGateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearStatus();
      
      const emailVal = document.getElementById("gateEmail").value.trim();
      const refCodeVal = document.getElementById("referredByCode") ? document.getElementById("referredByCode").value.trim() : "";
      
      if (!emailVal) return;
      
      userEmail = emailVal.toLowerCase();
      
      try {
        // Authenticate/Retrieve existing record (Phase 2 ledger check)
        const res = await fetch(`${API_BASE_URL}/api/dashboard-auth?email=${encodeURIComponent(userEmail)}&ref=${encodeURIComponent(refCodeVal)}`);
        const data = await res.json();
        
        if (data.exists) {
          // If already filled, skip survey and route directly to dashboard
          localStorage.setItem("syntrix_user_email", userEmail);
          showStatus("success", "Email profile verified. Loading your dashboard...");
          setTimeout(() => {
            loadDashboard(userEmail);
          }, 1000);
        } else {
          // Load onboarding survey questions (Start survey)
          document.getElementById("emailGateSection").classList.add("hidden");
          document.getElementById("claimForm").classList.remove("hidden");
          
          currentStep = 1;
          updateProgress();
          renderStepQuestions();
        }
      } catch (err) {
        showStatus("danger", "Failed to connect to authentication server.");
      }
    });
  }

  // Survey navigation controls
  document.getElementById("prevBtn")?.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateProgress();
      renderStepQuestions();
    }
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    if (validateCurrentStepAnswers()) {
      saveStepAnswers();
      if (currentStep < 7) {
        currentStep++;
        updateProgress();
        renderStepQuestions();
      }
    }
  });

  // Survey Form Submission
  const claimForm = document.getElementById("claimForm");
  if (claimForm) {
    claimForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearStatus();
      
      if (!validateCurrentStepAnswers()) return;
      saveStepAnswers();
      
      const refInputVal = document.getElementById("referredByCode") ? document.getElementById("referredByCode").value.trim() : "";
      
      // Combine all payload responses
      const payload = {
        email: userEmail,
        referredByCode: refInputVal,
        monthlySpend: surveyAnswers["monthlySpend"] || "100_500",
        locationType: surveyAnswers["locationType"] || "tier_2",
        ageGroup: surveyAnswers["ageGroup"] || "25_34",
        userPersona: surveyAnswers["userPersona"] || "value_seeker",
        shoppingDevice: surveyAnswers["shoppingDevice"] || "mobile",
        discoveryChannel: surveyAnswers["discoveryChannel"] || "social_media",
        shoppingCategories: surveyAnswers["shoppingCategories"] || "Fashion, Tech",
        painPoint: surveyAnswers["painPoint"] || "sizing",
        bestPoint: surveyAnswers["bestPoint"] || "cashback",
        // Default properties to fill schema
        luxuryAllocation: "medium",
        purchaseBlocker: "none",
        shippingCostTolerance: "low",
        paymentPreference: "card",
        returnPolicyImportance: "high",
        trustAnchor: "reviews",
        brandRiskTolerance: "medium",
        conversionTrigger: "discount",
        decisionTimeline: "day",
        giftingBehavior: "occasional",
        priceComparisonBehavior: "active",
        peakShoppingTime: "evening",
        complementPoint: "none",
        referralVoice: "neutral",
        categorySpendCeiling: "500",
        postPurchaseAction: "none",
        returnHistoryReason: "size"
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/claim-airdrop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to submit survey questions.");
        }

        showStatus("success", "Survey answers successfully logged! Redirecting to Dashboard.");
        localStorage.setItem("syntrix_user_email", userEmail);
        localStorage.removeItem("referralCode"); // Keep referral code until survey completed (completed)
        
        setTimeout(() => {
          loadDashboard(userEmail);
        }, 1500);

      } catch (err) {
        showStatus("danger", err.message);
      }
    });
  }

  // Dashboard Copy Referral Link button
  const copyBtn = document.getElementById("copyReferralBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const codeDisplay = document.getElementById("referralCodeDisplay");
      if (codeDisplay) {
        codeDisplay.select();
        document.execCommand("copy");
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy Link";
        }, 2000);
      }
    });
  }

  // Multi-Language translation selections
  document.querySelectorAll(".langBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".langBtn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedLanguage = e.target.getAttribute("data-lang");
      
      // Re-translate title texts
      updateStaticTranslations();
      if (currentStep > 0 && currentStep <= 7) {
        renderStepQuestions();
      }
    });
  });

  // Options Menu controls
  const menuToggle = document.getElementById("menuToggleBtn");
  const optionsPopover = document.getElementById("optionsPopover");
  if (menuToggle && optionsPopover) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      optionsPopover.classList.toggle("hidden");
    });
    
    document.addEventListener("click", () => {
      optionsPopover.classList.add("hidden");
    });
  }

  // Restart Survey button
  document.getElementById("menuRestartBtn")?.addEventListener("click", () => {
    localStorage.removeItem("syntrix_user_email");
    localStorage.removeItem("referralCode");
    window.location.reload();
  });

  // Modal retrieval toggle button
  document.getElementById("menuRecoverBtn")?.addEventListener("click", () => {
    document.getElementById("retrieveModal").classList.remove("hidden");
  });

  // Close modals
  const closeModal = () => {
    document.getElementById("retrieveModal").classList.add("hidden");
    document.getElementById("modalStatus").innerHTML = "";
  };
  document.getElementById("closeModalBtn")?.addEventListener("click", closeModal);
  document.getElementById("cancelModalBtn")?.addEventListener("click", closeModal);

  // Modal search ledger recovery
  const confirmBtn = document.getElementById("confirmRetrieveBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      const modalEmail = document.getElementById("modalEmailInput").value.trim();
      const statusDiv = document.getElementById("modalStatus");
      if (!modalEmail) {
        statusDiv.innerHTML = `<span style="color: #ef4444;">Please input your email.</span>`;
        return;
      }
      
      statusDiv.innerHTML = `<span style="color: #6366f1;">Searching ledger database...</span>`;
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard-auth?email=${encodeURIComponent(modalEmail)}`);
        const data = await res.json();
        
        if (data.exists) {
          localStorage.setItem("syntrix_user_email", modalEmail.toLowerCase());
          userEmail = modalEmail.toLowerCase();
          statusDiv.innerHTML = `<span style="color: #10b981;">Registry found! Loading dashboard...</span>`;
          setTimeout(() => {
            closeModal();
            loadDashboard(userEmail);
          }, 1000);
        } else {
          statusDiv.innerHTML = `<span style="color: #ef4444;">No registered records found for this email address.</span>`;
        }
      } catch (err) {
        statusDiv.innerHTML = `<span style="color: #ef4444;">Server communication failure.</span>`;
      }
    });
  }

  // Direct Referral Email Invitation Sender
  const refInviteForm = document.getElementById("referralInviteForm");
  if (refInviteForm) {
    refInviteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const friendEmail = document.getElementById("inviteFriendEmail").value.trim();
      const statusMessage = document.getElementById("referralStatusMessage");
      
      statusMessage.textContent = "Sending notification email invite...";
      statusMessage.className = "referral-status";
      
      try {
        const link = document.getElementById("referralCodeDisplay").value;
        const res = await fetch(`${API_BASE_URL}/api/send-invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referrerEmail: userEmail,
            friendEmail: friendEmail.toLowerCase(),
            referralLink: link
          })
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          statusMessage.textContent = `Invitation email successfully dispatched to ${friendEmail}!`;
          statusMessage.className = "referral-status success";
          document.getElementById("inviteFriendEmail").value = "";
        } else {
          throw new Error(data.error || "Failed to dispatch email.");
        }
      } catch (err) {
        statusMessage.textContent = err.message;
        statusMessage.className = "referral-status error";
      }
    });
  }
}

// ================= DYNAMIC QUESTION RENDERER =================
function renderStepQuestions() {
  const container = document.getElementById("surveyContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Render based on step index (Step 1 = Index 1, etc.)
  let stepQuestionsHTML = "";
  
  // Questions mapper structure corresponding to steps
  const stepKeys = {
    1: { id: "monthlySpend", type: "select", label: "Monthly online spend limits" },
    2: { id: "locationType", type: "select", label: "Location profile tier details" },
    3: { id: "ageGroup", type: "select", label: "Age demographics classification" },
    4: { id: "userPersona", type: "select", label: "Primary e-commerce consumer profile" },
    5: { id: "shoppingDevice", type: "select", label: "Favorite checkout browsing device" },
    6: { id: "discoveryChannel", type: "select", label: "Product and brand discovery channel" },
    7: { id: "shoppingCategories", type: "text", label: "Categories of interest (comma separated)" }
  };
  
  const stepMeta = stepKeys[currentStep];
  if (!stepMeta) return;
  
  // Retrieve option arrays from data.js
  const options = SURVEY_OPTIONS[stepMeta.id] || [];
  
  let optionsHTML = "";
  if (stepMeta.type === "select") {
    options.forEach(opt => {
      const selected = surveyAnswers[stepMeta.id] === opt.value || opt.default ? "selected" : "";
      optionsHTML += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
    });
  }
  
  const savedValue = surveyAnswers[stepMeta.id] || "";
  
  stepQuestionsHTML = `
    <div class="survey-module-card" style="padding: 20px 0;">
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 15px; color: #ffffff;">
        Module ${currentStep}: ${stepMeta.label}
      </h3>
      
      <div class="form-group">
        <label for="${stepMeta.id}" style="color: var(--text-secondary); font-size: 13px; font-weight: bold; margin-bottom: 10px; display: block;">
          Please specify your answer:
        </label>
        ${stepMeta.type === "select" ? 
          `<select id="${stepMeta.id}" required style="width: 100%;">${optionsHTML}</select>` : 
          `<input type="text" id="${stepMeta.id}" required value="${savedValue || 'Fashion, Tech'}" style="width: 100%;" placeholder="e.g. Wellness, Apparel">`
        }
      </div>
    </div>
  `;
  
  container.innerHTML = stepQuestionsHTML;
}

function validateCurrentStepAnswers() {
  const stepKeys = {
    1: "monthlySpend",
    2: "locationType",
    3: "ageGroup",
    4: "userPersona",
    5: "shoppingDevice",
    6: "discoveryChannel",
    7: "shoppingCategories"
  };
  const key = stepKeys[currentStep];
  if (!key) return true;
  
  const element = document.getElementById(key);
  if (element && !element.value.trim()) {
    showStatus("danger", "Please answer the module question before moving forward.");
    return false;
  }
  return true;
}

function saveStepAnswers() {
  const stepKeys = {
    1: "monthlySpend",
    2: "locationType",
    3: "ageGroup",
    4: "userPersona",
    5: "shoppingDevice",
    6: "discoveryChannel",
    7: "shoppingCategories"
  };
  const key = stepKeys[currentStep];
  if (!key) return;
  
  const element = document.getElementById(key);
  if (element) {
    surveyAnswers[key] = element.value.trim();
  }
}

// ================= PROGRESS BAR SYNCS =================
function updateProgress() {
  // Update sidebar classes active
  document.querySelectorAll(".steps .step").forEach((stepEl, idx) => {
    if (idx === currentStep) {
      stepEl.classList.add("active");
    } else {
      stepEl.classList.remove("active");
    }
  });

  const progressBox = document.getElementById("topProgressBox");
  if (!progressBox) return;
  
  if (currentStep > 0 && currentStep <= 7) {
    progressBox.classList.remove("hidden");
    const percent = Math.round((currentStep / 7) * 100);
    progressBox.querySelector(".progressText").textContent = `Module Process ${currentStep}/7`;
    progressBox.querySelector(".progressFill").style.width = `${percent}%`;
    
    // Toggle nav visibility buttons
    document.getElementById("prevBtn").classList.toggle("hidden", currentStep === 1);
    document.getElementById("nextBtn").classList.toggle("hidden", currentStep === 7);
    document.getElementById("submitClaimBtn").classList.toggle("hidden", currentStep !== 7);
  } else {
    progressBox.classList.add("hidden");
  }
}

// ================= LOAD DASHBOARD METRICS (PHASE 7) =================
async function loadDashboard(email) {
  document.getElementById("emailGateSection").classList.add("hidden");
  document.getElementById("claimForm").classList.add("hidden");
  document.getElementById("rewardDashboardScreen").classList.remove("hidden");
  
  // Set sidebar to Experience (Finished state)
  document.querySelectorAll(".steps .step").forEach(s => s.classList.remove("active"));
  document.getElementById("step-7")?.classList.add("active");
  
  clearStatus();
  
  // Query stats
  try {
    const res = await fetch(`${API_BASE_URL}/api/referral/dashboard?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    
    if (res.ok && data.success) {
      document.getElementById("statTotalReferrals").textContent = data.totalReferrals;
      document.getElementById("statPendingRewards").textContent = `${data.pendingRewards} SYN`;
      document.getElementById("statClaimedRewards").textContent = `${data.claimedRewards} SYN`;
      document.getElementById("statTotalEarned").textContent = `${data.totalEarned} SYN`;
      
      // Referral link parsing
      userReferralCode = data.referralCode;
      const currentUrl = window.location.origin;
      document.getElementById("referralCodeDisplay").value = `${currentUrl}/?ref=${data.referralCode}`;
    }
  } catch (err) {
    console.error("Dashboard statistics loading failure:", err);
  }
  
  // Initialize survey token claims dispenser interaction (lazy survey claims setup)
  initializeSurveyClaimDispenser(email);
}

function initializeSurveyClaimDispenser(email) {
  const connectBtn = document.getElementById("connectWalletBtn");
  const walletInput = document.getElementById("dashboardWalletInput");
  const executeBtn = document.getElementById("executeClaimBtn");
  
  if (!connectBtn || !executeBtn) return;
  
  // 1. MetaMask Connector button trigger
  connectBtn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      showStatus("danger", "MetaMask wallet browser extension not detected. Input address manually.");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        walletInput.value = accounts[0];
        showStatus("success", "MetaMask pairing active. Execute distribution below.");
      }
    } catch (err) {
      showStatus("danger", "MetaMask connection rejected.");
    }
  });

  // 2. Submit payout request dispenser
  executeBtn.onclick = async () => {
    const walletAddress = walletInput.value.trim();
    if (!walletAddress || walletAddress.length < 42) {
      showStatus("danger", "Please specify a valid EVM network public address (0x...)");
      return;
    }
    
    clearStatus();
    executeBtn.disabled = true;
    executeBtn.textContent = "Processing Blockchain Transfer...";
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/claim-reward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, walletAddress })
      });
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Claim request was rejected.");
      }
      
      showStatus("success", `Survey rewards distributed! Transaction hash successfully registered.`);
      const container = document.querySelector(".manualWalletWrapper");
      if (container) {
        container.innerHTML = `
          <div style="font-weight: 700; color: #10b981; margin: 15px 0;">🎉 SURVEY REWARD CLAIMED SUCCESSFULLY!</div>
          <a target="_blank" href="https://polygonscan.com/tx/${result.transactionHash}" style="color: #6366f1; text-decoration: none; font-family: monospace; word-break: break-all;">
            ${result.transactionHash}
          </a>
        `;
      }
      
      // Update statistics
      loadDashboard(email);
      
    } catch (err) {
      showStatus("danger", err.message);
      executeBtn.disabled = false;
      executeBtn.textContent = "Execute Token Distribution";
    }
  };
}

// ================= EMAIL LINK CLAIMS PANEL WORKFLOW (PHASE 9) =================
function initializeClaimSection(token) {
  const loadingGear = document.getElementById("claimLoadingGear");
  const staticIcon = document.getElementById("claimStaticIcon");
  const screenTitle = document.getElementById("claimScreenTitle");
  const subtitle = document.getElementById("claimInfoSubtitle");
  
  const rewardDetails = document.getElementById("claimRewardDetails");
  const actionPanel = document.getElementById("claimActionPanel");
  const connectBtn = document.getElementById("claimConnectWalletBtn");
  const connectedBlock = document.getElementById("claimWalletConnectedBlock");
  const addressDisplay = document.getElementById("claimWalletAddressDisplay");
  const submitClaimBtn = document.getElementById("submitClaimRewardBtn");
  
  let claimWallet = "";
  
  // 1. Fetch credentials details on-load
  fetch(`${API_BASE_URL}/api/rewards/claim-info?token=${encodeURIComponent(token)}`)
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Claim verification parameters invalid.");
      
      if (data.status !== "pending") {
        throw new Error(`This reward allocation is already marked as ${data.status.toUpperCase()}.`);
      }
      
      // Bind information to details table
      document.getElementById("claimInfoEmail").textContent = data.email;
      document.getElementById("claimInfoType").textContent = data.rewardType;
      document.getElementById("claimInfoAmount").textContent = `${data.amount} SYN`;
      
      // Open panels
      loadingGear.classList.add("hidden");
      staticIcon.classList.remove("hidden");
      screenTitle.textContent = "Claim Your Earned Reward";
      subtitle.textContent = "Confirm details and connect MetaMask to execute claim.";
      
      rewardDetails.classList.remove("hidden");
      actionPanel.classList.remove("hidden");
    })
    .catch(err => {
      loadingGear.classList.add("hidden");
      document.getElementById("claimErrorBox").classList.remove("hidden");
      screenTitle.textContent = "Claim Attempt Blocked";
      subtitle.textContent = err.message;
    });

  // 2. MetaMask pairing
  connectBtn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      showStatus("danger", "MetaMask not detected. Install the browser plugin to claim rewards.");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      claimWallet = accounts[0];
      
      addressDisplay.textContent = claimWallet;
      connectBtn.classList.add("hidden");
      connectedBlock.classList.remove("hidden");
      clearStatus();
    } catch (err) {
      showStatus("danger", "MetaMask connection rejected.");
    }
  });

  // 3. Signature verification & payout transfer submission
  submitClaimBtn.addEventListener("click", async () => {
    if (!claimWallet) return;
    
    clearStatus();
    submitClaimBtn.disabled = true;
    submitClaimBtn.textContent = "Sign Message in MetaMask...";
    
    try {
      // Build Verification Message
      const message = `Claiming SYNTRIX Reward\nToken: ${token}\nWallet: ${claimWallet}`;
      
      // Request signature from user MetaMask provider
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, claimWallet]
      });
      
      submitClaimBtn.textContent = "Processing On-Chain Settlement...";
      
      const response = await fetch(`${API_BASE_URL}/api/rewards/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          walletAddress: claimWallet,
          signature: signature
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Claim transaction rejected.");
      }
      
      // Open Success Screen
      rewardDetails.classList.add("hidden");
      actionPanel.classList.add("hidden");
      document.getElementById("claimSuccessPanel").classList.remove("hidden");
      
      screenTitle.textContent = "Settlement Finalized!";
      subtitle.textContent = "Your SYN tokens have been transferred successfully.";
      
      const txHashLink = document.getElementById("claimTxHashLink");
      txHashLink.textContent = result.transactionHash;
      txHashLink.href = `https://polygonscan.com/tx/${result.transactionHash}`;
      
      showStatus("success", "Reward successfully transferred! Balance updated.");

    } catch (err) {
      showStatus("danger", err.message);
      submitClaimBtn.disabled = false;
      submitClaimBtn.textContent = "✍️ Sign Message & Claim Tokens";
    }
  });
}

// ================= LANGUAGE DICTIONARY SYNCS =================
function updateStaticTranslations() {
  const dict = TRANSLATIONS[selectedLanguage] || TRANSLATIONS["en"];
  
  // Fallback mappings to update titles
  document.getElementById("mainTitle").textContent = dict.title || "Syntrix Consumer Analytics Hub";
  document.getElementById("mainSubtitle").textContent = dict.surveySubtitle || "Complete all 7 modules to claim rewards.";
  
  const sectionTitle = document.querySelector("#emailGateSection .sectionTitle");
  if (sectionTitle) sectionTitle.textContent = dict.emailSectionTitle || "Enter Communication Profile";
}
