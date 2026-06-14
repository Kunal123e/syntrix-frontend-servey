// =========================================================================
// SYNTRIX CONSUMER ANCHOR DATA LEDGER SYSTEM
// Contains the full multilingual survey question registry matrix
// =========================================================================

var surveySections = [
  {
    title: "Financial",
    questions: [
      {
        id: "fin_q1",
        question: "How do you usually handle high-priced product configurations?",
        type: "radio",
        options: ["Too Expensive", "Discount", "Always compares prices", "Only if Necessary"]
      },
      {
        id: "fin_q2",
        question: "Which product category do you spend most of your monthly capital reserves on?",
        type: "radio",
        options: ["Electronics & Gadgets", "Fashion & Clothing", "Beauty & Personal Care", "Other"]
      }
    ]
  },
  {
    title: "Checkout",
    questions: [
      {
        id: "chk_q1",
        question: "What is your preferred transaction execution framework method?",
        type: "radio",
        options: ["Cash on Delivery", "Payment Failure protection cards", "Digital Wallets", "Bank Transfer"]
      },
      {
        id: "chk_q2",
        question: "What parameter instantly forces you to abandon an active shopping cart session?",
        type: "radio",
        options: ["Shipping Cost", "Low Trust indicators", "Long Delivery times", "Complicated Checkout"]
      }
    ]
  },
  {
    title: "Discovery",
    questions: [
      {
        id: "dsc_q1",
        question: "Where do you discover new consumer web applications or product trends?",
        type: "radio",
        options: ["Instagram", "YouTube", "Google Search", "Friends & Family"]
      },
      {
        id: "dsc_q2",
        question: "How often do you engage with active social media brand channels?",
        type: "radio",
        options: ["Very Often", "Sometimes", "Rarely", "Never"]
      }
    ]
  },
  {
    title: "Psychology",
    questions: [
      {
        id: "psy_q1",
        question: "What primary core driver motivates you to try out completely unknown brands?",
        type: "radio",
        options: ["I love trying new brands", "I try if reviews are good", "avoid unknown brands", "Friend Recommendation"]
      },
      {
        id: "psy_q2",
        question: "How do you value social status validation when choosing premium items?",
        type: "radio",
        options: ["Brand Reputation", "Limited Stock urgency", "Ratings & Reviews matrix", "No opinion"]
      }
    ]
  },
  {
    title: "Categories",
    questions: [
      {
        id: "cat_q1",
        question: "Which consumer persona structure best describes your day-to-day lifestyle profile?",
        type: "radio",
        options: ["Content Creator", "Influencers", "Thoughtful Planner", "Mindful Explorer"]
      },
      {
        id: "cat_q2",
        question: "What percentage of your retail transactions are completed inside verified digital marketplaces?",
        type: "radio",
        options: ["Above 50%", "Below 50%", "Free Only web solutions", "None"]
      }
    ]
  },
  {
    title: "Post-Purchase",
    questions: [
      {
        id: "pst_q1",
        question: "How do you handle your transactional data footprints across centralized architectures?",
        type: "radio",
        options: ["Keep it Private", "Share on Social Media", "Recommend to Friends", "Don't Care"]
      },
      {
        id: "pst_q2",
        question: "How frequently do you procure retail products specifically intended for family gifting cycles?",
        type: "radio",
        options: ["Very Often", "WhatsApp community recommendations", "rarely try unknown paths", "Never"]
      }
    ]
  },
  {
    title: "Experience",
    questions: [
      {
        id: "exp_q1",
        question: "Provide direct qualitative feedback detailing parameters that maximize transactional execution flow speeds.",
        type: "textarea"
      },
      {
        id: "exp_q2",
        question: "Detail your functional requirements for zero-knowledge privacy layers inside alpha web builds.",
        type: "textarea"
      }
    ]
  }
];

// =========================================================================
// COGNITIVE PSYCHOLOGY BADGE RULES ENGINE
// Evaluates scoring matrices across dynamic global answers
// =========================================================================

function calculateConsumerPsychologyBadge() {
  let scores = { Analyzer: 0, Stylist: 0, Hedger: 0, Native: 0 };

  for (const qId in answers) {
    const ans = String(answers[qId]);
    if (!ans) continue;

    // 📊 ANALYZER: Focuses on data, reviews, price, comparisons, and logic.
    if (
      ans.includes("Too Expensive") || 
      ans.includes("Poor Reviews") || 
      ans.includes("Ratings & Reviews") || 
      ans.includes("I try if reviews are good") || 
      ans.includes("Positive Reviews") || 
      ans.includes("Discount") || 
      ans.includes("Always") || 
      ans.includes("Electronics & Gadgets")
    ) {
      scores.Analyzer += 2;
    }

    // ✨ STYLIST: Focuses on aesthetics, trends, premium experiences, and social platforms.
    if (
      ans.includes("Content Creator") || 
      ans.includes("Above 50%") || 
      ans.includes("Instagram") || 
      ans.includes("YouTube") || 
      ans.includes("Professional Website") || 
      ans.includes("Brand Reputation") || 
      ans.includes("I love trying new brands") || 
      ans.includes("Limited Stock") || 
      ans.includes("Fashion & Clothing") || 
      ans.includes("Beauty & Personal Care")
    ) {
      scores.Stylist += 2;
    }

    // 🛡️ HEDGER: Focuses on safety, avoiding risks, free shipping, COD, and trust.
    if (
      ans.includes("Shipping Cost") || 
      ans.includes("Low Trust") || 
      ans.includes("Payment Failure") || 
      ans.includes("Free Only") || 
      ans.includes("Cash on Delivery") || 
      ans.includes("avoid unknown brands") || 
      ans.includes("rarely try unknown") || 
      ans.includes("Only if Necessary") || 
      ans.includes("Keep it Private")
    ) {
      scores.Hedger += 2;
    }

    // 🌐 NATIVE: Focuses on community, word-of-mouth, gifting, and friends/family.
    if (
      ans.includes("Friends & Family") || 
      ans.includes("Influencers") || 
      ans.includes("WhatsApp") || 
      ans.includes("Friend Recommendation") || 
      ans.includes("Very Often") || 
      ans.includes("Share on Social Media") || 
      ans.includes("Recommend to Friends")
    ) {
      scores.Native += 2;
    }
  }

  // 🚀 FIXED TIE-BREAKER LOGIC: Safely initializes variables to force an explicit fallback configuration tracking layout
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
