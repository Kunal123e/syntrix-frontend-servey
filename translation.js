const translations = {
  en: {
    mainTitle: "Syntrix Consumer Analytics Hub",
    mainSubtitle: "Complete all 7 consumer research modules to claim your 10 SYNX token rewards.",
    progress: "Progress",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    textareaPlaceholder: "Write your answer...",
    validationRequired: "❌ Please answer all questions before continuing.",
    fillRequired: "❌ Please fill all required fields.",
    invalidWallet: "❌ Invalid wallet address.",
    submitting: "⏳ Submitting survey..."
  },
  hi: {
    mainTitle: "सिंट्रिक्स कंज्यूमर एनालिटिक्स हब",
    mainSubtitle: "10 SYNX टोकन रिवॉर्ड पाने के लिए सभी 7 कंज्यूमर रिसर्च मॉड्यूल पूरे करें।",
    progress: "प्रगति",
    next: "अगला",
    previous: "पिछला",
    submit: "जमा करें",
    textareaPlaceholder: "अपना उत्तर लिखें...",
    validationRequired: "❌ आगे बढ़ने से पहले सभी प्रश्नों के उत्तर दें।",
    fillRequired: "❌ कृपया सभी आवश्यक जानकारी भरें।",
    invalidWallet: "❌ अमान्य वॉलेट पता।",
    submitting: "⏳ सर्वे जमा किया जा रहा है..."
  }
};

const sectionTranslations = {
  hi: {
    "1. Lifestyle & Spending Profile": "1. जीवनशैली और खर्च प्रोफ़ाइल",
    "2. Checkout Experience": "2. चेकआउट अनुभव",
    "3. Product Discovery & Trust": "3. उत्पाद खोज और भरोसा",
    "4. Buying Behaviour & Decisions": "4. खरीदारी व्यवहार और निर्णय",
    "5. Shopping Categories": "5. खरीदारी श्रेणियाँ",
    "6. Post-Purchase Behaviour": "6. खरीद के बाद का व्यवहार",
    "7. Shopping Experiences": "7. खरीदारी अनुभव"
  }
};

const questionTranslations = {
  hi: {
    monthlySpend: "आप हर महीने ऑनलाइन शॉपिंग पर कितना खर्च करते हैं?",
    locationType: "आप कहाँ रहते हैं?",
    ageGroup: "आपका आयु वर्ग क्या है?",
    userPersona: "आपका सबसे अच्छा वर्णन कौन सा है?",
    luxuryAllocation: "आपकी आय का कितना हिस्सा गैर-जरूरी खरीदारी पर खर्च होता है?",
    purchaseBlocker: "खरीदारी पूरी करने से आपको सबसे अधिक क्या रोकता है?",
    shippingCostTolerance: "आप कितनी डिलीवरी लागत स्वीकार करेंगे?",
    paymentPreference: "आप भुगतान कैसे करना पसंद करते हैं?",
    returnPolicyImportance: "अच्छी रिटर्न या एक्सचेंज नीति कितनी महत्वपूर्ण है?",
    discoveryChannel: "आप आमतौर पर उत्पाद कहाँ खोजते हैं?",
    trustAnchor: "किस वजह से आप किसी उत्पाद पर भरोसा करते हैं?",
    brandRiskTolerance: "नई ब्रांड आज़माने में आप कितने सहज हैं?",
    shoppingDevice: "ऑनलाइन खरीदारी के लिए आप कौन सा डिवाइस उपयोग करते हैं?",
    conversionTrigger: "कौन सी चीज़ रुचि को खरीदारी में बदल देती है?",
    decisionTimeline: "पहली बार उत्पाद देखने के बाद खरीदने में कितना समय लेते हैं?",
    saleParticipation: "क्या आप खरीदारी से पहले सेल का इंतजार करते हैं?",
    giftingBehavior: "क्या आप दूसरों के लिए उपहार खरीदते हैं?",
    priceComparisonBehavior: "क्या आप खरीदने से पहले विभिन्न प्लेटफॉर्म पर कीमतें तुलना करते हैं?",
    peakShoppingTime: "आप सबसे ज्यादा ऑनलाइन खरीदारी कब करते हैं?",
    painPoint: "अपने सबसे खराब ऑनलाइन खरीदारी अनुभव के बारे में बताइए।",
    bestPoint: "अपने सबसे अच्छे ऑनलाइन खरीदारी अनुभव के बारे में बताइए।",
    complementPoint: "हर ऑनलाइन स्टोर को कौन सी न्यूनतम सुविधाएँ देनी चाहिए?",
    referralVoice: "आप किसी उत्पाद की सिफारिश अपने दोस्तों या परिवार को कब करेंगे?",
    shoppingCategories: "आप सबसे अधिक किन श्रेणियों में ऑनलाइन खरीदारी करते हैं?",
    categorySpendCeiling: "अपनी पसंदीदा श्रेणी में प्रति खरीद आप कितना खर्च करते हैं?",
    postPurchaseAction: "कोई पसंदीदा उत्पाद खरीदने के बाद आप क्या करते हैं?",
    returnHistoryReason: "क्या आपने कभी कोई उत्पाद वापस किया है? कारण क्या था?"
  }
};

const optionTranslations = {
  hi: {
    // Lifestyle Spending options
    "Under ₹500": "₹500 से कम",
    "₹500 - ₹2,000": "₹500 - ₹2,000",
    "₹2,000 - ₹5,000": "₹2,000 - ₹5,000",
    "₹5,000 - ₹15,000": "₹5,000 - ₹15,000",
    "Above ₹15,000": "₹15,000 से अधिक",
    
    // Location options
    "🏙️ Metro City (Mumbai, Delhi, Bengaluru, Chennai)": "🏙️ मेट्रो शहर (मुंबई, दिल्ली, बेंगलुरु, चेन्नई)",
    "🌆 Large City (Ahmedabad, Surat, Jaipur, Vadodara)": "🌆 बड़ा शहर (अहमदाबाद, सूरत, जयपुर, वडोदरा)",
    "🏘️ Small City / District City (Rajkot, Udaipur, Bhavnagar, Kota)": "🏘️ छोटा शहर / जिला शहर (राजकोट, उदयपुर, भावनगर, कोटा)",
    "🌿 Town / Village (Kalol, Gangapur and similar areas)": "🌿 कस्बा / गाँव (कलोल, गंगापुर और समान क्षेत्र)",
    
    // User Persona options
    "Student": "विद्यार्थी",
    "Salaried Employee": "वेतनभोगी कर्मचारी",
    "Business Owner": "व्यवसाय मालिक",
    "Freelancer": "फ्रीलांसर",
    "Content Creator": "कंटेंट क्रिएटर",
    "Trader / Investor": "ट्रेडर / निवेशक",
    
    // Luxury Allocation options
    "Under 5%": "5% से कम",
    "5% - 15%": "5% - 15%",
    "15% - 30%": "15% - 30%",
    "30% - 50%": "30% - 50%",
    "Above 50%": "50% से अधिक",

    // Purchase Blockers options
    "Shipping Cost": "डिलीवरी शुल्क",
    "Too Expensive": "बहुत महंगा",
    "Low Trust": "कम भरोसा",
    "Poor Reviews": "खराब समीक्षाएँ",
    "Slow Delivery": "धीमी डिलीवरी",
    "Payment Failure": "भुगतान विफल",

    // Shipping tolerance options
    "Free Only": "केवल मुफ्त",
    "Under ₹50": "₹50 से कम",
    "Under ₹100": "₹100 से कम",
    "Under ₹300": "₹300 से कम",
    "Any if Product is Worth It": "यदि उत्पाद इसके लायक है तो कुछ भी",

    // Payment options
    "UPI": "यूपीआई",
    "Cash on Delivery (COD)": "कैश ऑन डिलीवरी",
    "Debit / Credit Card": "डेबिट / क्रेडिट कार्ड",
    "Net Banking": "नेट बैंकिंग",
    "Buy Now Pay Later / EMI": "अभी खरीदें बाद में भुगतान करें / ईएमआई",
    "Crypto": "क्रिप्टो",

    // Importance options
    "Extremely Important": "बहुत महत्वपूर्ण",
    "Important": "महत्वपूर्ण",
    "Neutral": "तटस्थ",
    "Not Important": "महत्वपूर्ण नहीं",

    // Discovery choices
    "Friends & Family": "दोस्त और परिवार",
    "Online Ads": "ऑनलाइन विज्ञापन",
    "Google Search": "गूगल सर्च",
    "Influencers": "इन्फ्लुएंसर्स",
    "WhatsApp": "व्हाट्सएप",

    // Trust Anchors
    "Ratings & Reviews": "रेटिंग और समीक्षाएँ",
    "Influencer Review": "इन्फ्लुएंसर समीक्षा",
    "Friend Recommendation": "दोस्त की सिफारिश",
    "Brand Reputation": "ब्रांड की प्रतिष्ठा",
    "Professional Website": "पेशेवर वेबसाइट",
    "Money Back Guarantee": "पैसे वापस गारंटी",

    // Brand Risk
    "I love trying new brands": "मुझे नई ब्रांड आज़माना पसंद है",
    "I try if reviews are good": "अच्छी समीक्षा होने पर कोशिश करता हूँ",
    "I rarely try unknown brands": "अज्ञान ब्रांड कम आज़माता हूँ",
    "I avoid unknown brands completely": "अज्ञात ब्रांड से बचता हूँ",

    // Devices
    "Android Smartphone": "एंड्रॉइड स्मार्टफोन",
    "iPhone": "आईफोन",
    "Laptop": "लैपटॉप",
    "Tablet": "टैबलेट",
    "Desktop Computer": "डेस्कटॉप कंप्यूटर",

    // Conversion Triggers
    "Discount": "छूट",
    "Urgency / FOMO": "जल्दी करने का दबाव",
    "Positive Reviews": "सकारात्मक समीक्षाएँ",
    "Limited Stock": "सीमित स्टॉक",
    "Bundle Offer": "बंडल ऑफर",

    // Timeline choices
    "Instantly": "तुरंत",
    "Same Day": "उसी दिन",
    "1-3 Days": "1-3 दिन",
    "1 Week": "1 सप्ताह",
    "1 Month": "1 महीना",
    "Only if Necessary": "केवल आवश्यकता होने पर",

    // Frequencies
    "Always": "हमेशा",
    "Often": "अक्सर",
    "Sometimes": "कभी-कभी",
    "Rarely": "शायद ही कभी",
    "Never": "कभी नहीं",
    "Most of the Time": "ज्यादातर समय",
    "Very Often": "बहुत अक्सर",

    // Times
    "Morning": "सुबह",
    "Afternoon": "दोपहर",
    "Evening": "शाम",
    "Late Night": "देर रात",
    "During Sales": "सेल के दौरान",

    // Categories
    "Fashion & Clothing": "फैशन और कपड़े",
    "Beauty & Personal Care": "सौंदर्य और व्यक्तिगत देखभाल",
    "Electronics & Gadgets": "इलेक्ट्रॉनिक्स और गैजेट्स",
    "Gaming": "गेमिंग",
    "Fitness & Sports": "फिटनेस और खेल",
    "Books & Education": "पुस्तकें और शिक्षा",
    "Home & Kitchen": "घर और रसोई",
    "Jewellery & Accessories": "आभूषण और एक्सेसरीज़",
    "Groceries & Daily Needs": "किराना और दैनिक आवश्यकताएँ",

    // Category spend ceilings
    "Under ₹300": "₹300 से कम",
    "₹300 - ₹800": "₹300 - ₹800",
    "₹800 - ₹2,000": "₹800 - ₹2,000",

    // Actions
    "Share on Social Media": "सोशल मीडिया पर साझा करें",
    "Recommend to Friends": "दोस्तों को सुझाव दें",
    "Leave a Review": "समीक्षा लिखें",
    "Buy Again": "फिर से खरीदें",
    "Keep it Private": "निजी रखें",

    // Return Reasons
    "Poor Quality": "खराब गुणवत्ता",
    "Wrong Size": "गलत आकार",
    "Damaged Product": "क्षतिग्रस्त उत्पाद",
    "Fake Product": "नकली उत्पाद",
    "Different from Photos": "फोटो से अलग",
    "Never Returned": "कभी वापस नहीं किया"
  }
};
