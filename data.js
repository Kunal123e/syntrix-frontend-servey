// =========================================================================
// SYNTRIX CONSUMER ANCHOR DATA LEDGER SYSTEM
// Contains the full multilingual survey question registry matrix (6-Section Array)
// =========================================================================

const surveySections = [
  {
    title: "1. Financial Power & Demographics",
    questions: [
      {
        id: "monthlySpend",
        question: "What is your monthly online shopping spend?",
        type: "radio",
        options: ["Under ₹500", "₹500 - ₹2,000", "₹2,000 - ₹5,000", "₹5,000 - ₹15,000", "Above ₹15,000"]
      },
      {
        id: "locationType",
        question: "Which city tier are you from?",
        type: "radio",
        options: [
          "Metro City (Mumbai, Delhi, Bengaluru, Chennai)",
          "Large City (Ahmedabad, Surat, Jaipur, Vadodara)",
          "Small City / District City (Rajkot, Udaipur, Bhavnagar, Kota)",
          "Town / Village (Kalol, Gangapur and similar areas)"
        ]
      },
      {
        id: "ageGroup",
        question: "What is your age group?",
        type: "radio",
        options: ["Under 18", "18-24", "25-34", "35-44", "Above 44"]
      },
      {
        id: "userPersona",
        question: "What best describes you?",
        type: "radio",
        options: ["Student", "Salaried Employee", "Business Owner", "Freelancer", "Content Creator", "Trader / Investor"]
      },
      {
        id: "luxuryAllocation",
        question: "How much of your income goes to non-essential / fun purchases?",
        type: "radio",
        options: ["Under 5%", "5% - 15%", "15% - 30%", "30% - 50%", "Above 50%"]
      }
    ]
  },
  {
    title: "2. Checkout Friction & Drop-Off Killers",
    questions: [
      {
        id: "purchaseBlocker",
        question: "What most often stops you from completing a purchase?",
        type: "radio",
        options: ["Shipping Cost", "Too Expensive", "Low Trust", "Poor Reviews", "Slow Delivery", "Payment Failure"]
      },
      {
        id: "shippingCostTolerance",
        question: "How much shipping cost will you accept before abandoning?",
        type: "radio",
        options: ["Free Only", "Under ₹50", "Under ₹100", "Under ₹300", "Any if Product is Worth It"]
      },
      {
        id: "paymentPreference",
        question: "How do you prefer to pay?",
        type: "radio",
        options: ["UPI", "Cash on Delivery (COD)", "Debit / Credit Card", "Net Banking", "Buy Now Pay Later / EMI", "Crypto"]
      },
      {
        id: "returnPolicyImportance",
        question: "How important is a good return / exchange policy to you?",
        type: "radio",
        options: ["Extremely Important", "Important", "Neutral", "Not Important"]
      }
    ]
  },
  {
    title: "3. Discovery Engines & Trust Anchors",
    questions: [
      {
        id: "discoveryChannel",
        question: "Where do you usually first discover a new product you end up buying?",
        type: "radio",
        options: ["Instagram", "YouTube", "Online Ads", "Google Search", "Influencers", "Friends & Family", "WhatsApp"]
      },
      {
        id: "trustAnchor",
        question: "What finally makes you trust a product enough to buy?",
        type: "radio",
        options: ["Ratings & Reviews", "Influencer Review", "Friend Recommendation", "Brand Reputation", "Professional Website", "Money Back Guarantee"]
      },
      {
        id: "brandRiskTolerance",
        question: "How do you feel about trying brands you have never heard of?",
        type: "radio",
        options: [
          "I love trying new brands",
          "I try if reviews are good",
          "I rarely try unknown brands",
          "I avoid unknown brands completely"
        ]
      },
      {
        id: "shoppingDevice",
        question: "Which device do you mostly use to shop online?",
        type: "radio",
        options: ["Android Smartphone", "iPhone", "Laptop", "Tablet", "Desktop Computer"]
      }
    ]
  },
  {
    title: "4. Buying Psychology & Timelines",
    questions: [
      {
        id: "conversionTrigger",
        question: "What most directly makes you go from 'I want this' to actually buying?",
        type: "radio",
        options: ["Discount", "Urgency / FOMO", "Positive Reviews", "Limited Stock", "Bundle Offer"]
      },
      {
        id: "decisionTimeline",
        question: "How long does it usually take from first seeing a product to buying it?",
        type: "radio",
        options: ["Instantly", "Same Day", "1-3 Days", "1 Week", "1 Month", "Only if Necessary"]
      },
      {
        id: "giftingBehavior",
        question: "Do you ever buy products as gifts for others?",
        type: "radio",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
      },
      {
        id: "priceComparisonBehavior",
        question: "Before buying, do you compare prices across multiple platforms?",
        type: "radio",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
      },
      {
        id: "peakShoppingTime",
        question: "When do you shop the most online?",
        type: "radio",
        options: ["Morning", "Afternoon", "Evening", "Late Night", "During Sales"]
      }
    ]
  },
  {
    title: "5. Niche Vertical - Shopping Categories",
    questions: [
      {
        id: "shoppingCategories",
        question: "Which categories do you shop online most?",
        type: "radio",
        options: ["Fashion & Clothing", "Beauty & Personal Care", "Electronics & Gadgets", "Gaming", "Fitness & Sports", "Books & Education", "Home & Kitchen", "Jewellery & Accessories", "Groceries & Daily Needs"]
      },
      {
        id: "categorySpendCeiling",
        question: "How much do you typically spend per purchase in your main category?",
        type: "radio",
        options: ["Under ₹300", "₹300 - ₹800", "₹800 - ₹2,000", "₹2,000 - ₹5,000", "₹5,000 - ₹15,000", "Above ₹15,000"]
      }
    ]
  },
  {
    title: "6. Post-Purchase Behavior",
    questions: [
      {
        id: "postPurchaseAction",
        question: "After buying something you love, what do you usually do?",
        type: "radio",
        options: ["Share on Social Media", "Recommend to Friends", "Leave a Review", "Buy Again", "Keep it Private"]
      },
      {
        id: "returnHistoryReason",
        question: "Have you ever returned a product? What was the reason?",
        type: "radio",
        options: ["Poor Quality", "Wrong Size", "Damaged Product", "Fake Product", "Different from Photos", "Never Returned"]
      }
    ]
  }
];

// =========================================================================
// PERSONA CALCULATION ENGINE
// =========================================================================

function calculateConsumerPsychologyBadge() {
  let scores = { Analyzer: 0, Stylist: 0, Hedger: 0, Native: 0 };
  const activeAnswers = typeof answers !== "undefined" ? answers : (window.answers || {});

  for (const qId in activeAnswers) {
    const ans = String(activeAnswers[qId]).toLowerCase().trim();
    if (!ans) continue;

    if (
      ans.includes("expensive") || ans.includes("poor reviews") || 
      ans.includes("ratings") || ans.includes("reviews are good") || 
      ans.includes("positive reviews") || ans.includes("discount") || 
      ans.includes("compare prices") || ans.includes("electronics") || 
      ans.includes("gadgets") || ans.includes("always")
    ) {
      scores.Analyzer += 2;
    }

    if (
      ans.includes("creator") || ans.includes("above 50%") || 
      ans.includes("instagram") || ans.includes("youtube") || 
      ans.includes("reputation") || ans.includes("trying new brands") || 
      ans.includes("limited stock") || ans.includes("fashion") || 
      ans.includes("clothing") || ans.includes("beauty") || 
      ans.includes("personal care")
    ) {
      scores.Stylist += 2;
    }

    if (
      ans.includes("shipping cost") || ans.includes("delivery charge") || 
      ans.includes("low trust") || ans.includes("failure") || 
      ans.includes("free only") || ans.includes("cash on delivery") || 
      ans.includes("avoid unknown") || ans.includes("rarely try") || 
      ans.includes("necessary") || ans.includes("private")
    ) {
      scores.Hedger += 2;
    }

    if (
      ans.includes("friends") || ans.includes("family") || 
      ans.includes("influencer") || ans.includes("whatsapp") || 
      ans.includes("recommendation") || ans.includes("very often") || 
      ans.includes("share on social") || ans.includes("recommend")
    ) {
      scores.Native += 2;
    }
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

// =========================================================================
// MULTI-LANGUAGE TRANSLATION DICTIONARY
// =========================================================================

const translations = {
  en: {
    mainTitle: "Syntrix Web3 Verification",
    mainSubtitle: "Complete tasks to earn SYNX tokens.",
    emailSectionTitle: "Enter your email to begin",
    btnStart: "Send Verification Code &rarr;",
    previous: "Back",
    next: "Next",
    submit: "Submit to AI Verification",
    claimTitle: "Claim Your Rewards",
    rewardSubtitle: "Transfer SYNX directly to your wallet.",
    metaMaskLabel: "Connect MetaMask",
    manualLabel: "Or Enter Wallet Manually",
    btnExecute: "Execute Claim",
    referralTitle: "Refer & Earn",
    referralSub: "Share your link to earn 10 SYNX per active user.",
    btnCopy: "Copy Link",
    modalTitle: "Account Recovery",
    modalSub: "Enter your email to retrieve your profile.",
    modalDetailsTitle: "What is recovered?",
    modalDetails1: "XP & Persona Badges",
    modalDetails2: "Pending SYNX Tokens",
    modalDetails3: "Referral Network Data",
    modalInputLabel: "Account Email",
    btnCancel: "Cancel",
    btnSearch: "Search Ledger",
    validationRequired: "Please answer all questions before continuing.",
    submitting: "⏳ Storing survey data metrics across secure registers...",
    claiming: "⚡ Appending whitelist configuration parameters...",
    checkingLedger: "⏳ Setting up your exclusive premium experience..."
  },
  hi: {
    mainTitle: "सिंट्रिक्स वेब3 सत्यापन",
    mainSubtitle: "SYNX टोकन अर्जित करने के लिए कार्य पूरे करें।",
    emailSectionTitle: "शुरू करने के लिए अपना ईमेल दर्ज करें",
    btnStart: "सत्यापन कोड भेजें &rarr;",
    previous: "पीछे",
    next: "अगला",
    submit: "एआई सत्यापन के लिए सबमिट करें",
    claimTitle: "अपने पुरस्कारों का दावा करें",
    rewardSubtitle: "SYNX को सीधे अपने वॉलेट में ट्रांसफर करें।",
    metaMaskLabel: "मेटामास्क कनेक्ट करें",
    manualLabel: "या मैन्युअल रूप से वॉलेट दर्ज करें",
    btnExecute: "दावा निष्पादित करें",
    referralTitle: "रेफर करें और कमाएं",
    referralSub: "प्रति सक्रिय उपयोगकर्ता 10 SYNX कमाने के लिए अपना लिंक साझा करें।",
    btnCopy: "लिंक कॉपी करें"
  },
  hinglish: {
    mainTitle: "Syntrix Web3 Verification",
    mainSubtitle: "Tasks complete karein aur SYNX tokens kamayein.",
    emailSectionTitle: "Start karne ke liye email enter karein",
    btnStart: "Verification Code Bhejein &rarr;",
    previous: "Peeche",
    next: "Aage",
    submit: "AI Verification ke liye Submit karein",
    claimTitle: "Apne Rewards Claim Karein",
    rewardSubtitle: "SYNX ko seedhe apne wallet mein transfer karein.",
    metaMaskLabel: "MetaMask Connect Karein",
    manualLabel: "Ya Manually Wallet Enter Karein",
    btnExecute: "Claim Execute Karein",
    referralTitle: "Refer Karein & Kamayein",
    referralSub: "Har active user par 10 SYNX kamane ke liye link share karein.",
    btnCopy: "Link Copy Karein"
  }
};
