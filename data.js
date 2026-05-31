const surveySections = [
  {
    title: "1. Lifestyle & Spending Profile",
    questions: [
      {
        id: "monthlySpend",
        text: "How much do you usually spend on online shopping each month?",
        options: [
          "Under ₹500",
          "₹500 - ₹2,000",
          "₹2,000 - ₹5,000",
          "₹5,000 - ₹15,000",
          "Above ₹15,000"
        ]
      },
      {
        id: "locationType",
        text: "Which best describes where you live?",
        options: [
          "🏙️ Metro City (Mumbai, Delhi, Bengaluru, Chennai)",
          "🌆 Large City (Ahmedabad, Surat, Jaipur, Vadodara)",
          "🏘️ Small City / District City (Rajkot, Udaipur, Bhavnagar, Kota)",
          "🌿 Town / Village (Kalol, Gangapur and similar areas)"
        ]
      },
      {
        id: "ageGroup",
        text: "What is your age group?",
        options: [
          "16-20",
          "21-25",
          "26-30",
          "31-40",
          "41-50",
          "50+"
        ]
      },
      {
        id: "userPersona",
        text: "Which best describes you?",
        options: [
          "Student",
          "Salaried Employee",
          "Business Owner",
          "Freelancer",
          "Content Creator",
          "Trader / Investor"
        ]
      },
      {
        id: "luxuryAllocation",
        text: "How much of your income is spent on non-essential or fun purchases?",
        options: [
          "Under 5%",
          "5% - 15%",
          "15% - 30%",
          "30% - 50%",
          "Above 50%"
        ]
      }
    ]
  },
  {
    title: "2. Checkout Experience",
    questions: [
      {
        id: "purchaseBlocker",
        text: "What most often stops you from completing a purchase?",
        options: [
          "Shipping Cost",
          "Too Expensive",
          "Low Trust",
          "Poor Reviews",
          "Slow Delivery",
          "Payment Failure"
        ]
      },
      {
        id: "shippingCostTolerance",
        text: "How much shipping cost will you accept before leaving?",
        options: [
          "Free Only",
          "Under ₹50",
          "Under ₹100",
          "Under ₹300",
          "Any if Product is Worth It"
        ]
      },
      {
        id: "paymentPreference",
        text: "How do you usually prefer to pay?",
        options: [
          "UPI",
          "Cash on Delivery (COD)",
          "Debit / Credit Card",
          "Net Banking",
          "Buy Now Pay Later / EMI",
          "Crypto"
        ]
      },
      {
        id: "returnPolicyImportance",
        text: "How important is a good return or exchange policy?",
        options: [
          "Extremely Important",
          "Important",
          "Neutral",
          "Not Important"
        ]
      }
    ]
  },
  {
    title: "3. Product Discovery & Trust",
    questions: [
      {
        id: "discoveryChannel",
        text: "Where do you usually discover products you end up buying?",
        options: [
          "Instagram",
          "YouTube",
          "Google Search",
          "Friends & Family",
          "Influencers",
          "WhatsApp",
          "Online Ads"
        ]
      },
      {
        id: "trustAnchor",
        text: "What makes you trust a product enough to buy it?",
        options: [
          "Ratings & Reviews",
          "Influencer Review",
          "Friend Recommendation",
          "Brand Reputation",
          "Professional Website",
          "Money Back Guarantee"
        ]
      },
      {
        id: "brandRiskTolerance",
        text: "How comfortable are you trying a brand you've never heard of?",
        options: [
          "I love trying new brands",
          "I try if reviews are good",
          "I rarely try unknown brands",
          "I avoid unknown brands completely"
        ]
      },
      {
        id: "shoppingDevice",
        text: "Which device do you mostly use for online shopping?",
        options: [
          "Android Smartphone",
          "iPhone",
          "Laptop",
          "Tablet",
          "Desktop Computer"
        ]
      }
    ]
  },
  {
    title: "4. Buying Behaviour & Decisions",
    questions: [
      {
        id: "conversionTrigger",
        text: "What most often turns interest into a purchase?",
        options: [
          "Discount",
          "Urgency / FOMO",
          "Positive Reviews",
          "Friend Recommendation",
          "Limited Stock",
          "Bundle Offer"
        ]
      },
      {
        id: "decisionTimeline",
        text: "How long does it usually take you to buy after first seeing a product?",
        options: [
          "Instantly",
          "Same Day",
          "1-3 Days",
          "1 Week",
          "1 Month",
          "Only if Necessary"
        ]
      },
      {
        id: "saleParticipation",
        text: "Do you actively wait for sales before buying?",
        options: [
          "Always",
          "Often",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },
      {
        id: "giftingBehavior",
        text: "Do you buy products as gifts for others?",
        options: [
          "Very Often",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },
      {
        id: "priceComparisonBehavior",
        text: "Before buying, do you compare prices across multiple platforms?",
        options: [
          "Always",
          "Most of the Time",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },
      {
        id: "peakShoppingTime",
        text: "When do you shop online the most?",
        options: [
          "Morning",
          "Afternoon",
          "Evening",
          "Late Night",
          "During Sales"
        ]
      }
    ]
  },
  {
    title: "5. Shopping Categories",
    questions: [
      {
        id: "shoppingCategories",
        text: "Which categories do you shop online most often?",
        multiple: true,
        options: [
          "Fashion & Clothing",
          "Beauty & Personal Care",
          "Electronics & Gadgets",
          "Gaming",
          "Fitness & Sports",
          "Books & Education",
          "Home & Kitchen",
          "Jewellery & Accessories",
          "Groceries & Daily Needs"
        ]
      },
      {
        id: "categorySpendCeiling",
        text: "How much do you typically spend per purchase in your favourite category?",
        options: [
          "Under ₹300",
          "₹300 - ₹800",
          "₹800 - ₹2,000",
          "₹2,000 - ₹5,000",
          "₹5,000 - ₹15,000",
          "Above ₹15,000"
        ]
      }
    ]
  },
  {
    title: "6. Post-Purchase Behaviour",
    questions: [
      {
        id: "postPurchaseAction",
        text: "After buying something you love, what do you usually do?",
        options: [
          "Share on Social Media",
          "Recommend to Friends",
          "Leave a Review",
          "Buy Again",
          "Keep it Private"
        ]
      },
      {
        id: "returnHistoryReason",
        text: "Have you ever returned a product? What was the reason?",
        options: [
          "Poor Quality",
          "Wrong Size",
          "Damaged Product",
          "Fake Product",
          "Different from Photos",
          "Never Returned"
        ]
      }
    ]
  },
  {
    title: "7. Shopping Experiences",
    questions: [
      {
        id: "painPoint",
        text: "Tell us about the worst online shopping experience you've had.",
        type: "textarea"
      },
      {
        id: "bestPoint",
        text: "Tell us about the best online shopping experience you've had.",
        type: "textarea"
      },
      {
        id: "complementPoint",
        text: "What are the minimum things every online store should provide?",
        type: "textarea"
      },
      {
        id: "referralVoice",
        text: "What would make you recommend a product to your friends or family?",
        type: "textarea"
      }
    ]
  }
];
