const surveySections = [

{
title: "1. Financial Power & Demographics",

questions: [

{
id: "monthlySpend",
text: "What is your monthly online shopping spend?",
options: [
"Under ₹500",
"₹500 - ₹2k",
"₹2k - ₹5k",
"₹5k - ₹15k",
"Above ₹15k"
]
},

{
id: "cityTier",
text: "Which city tier are you from?",
options: [
"Metro City",
"Tier 2 City",
"Tier 3 City",
"Rural Area"
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
text: "What best describes you?",
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
text: "How much of your income goes to non-essential / fun purchases?",
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
title: "2. Checkout Friction & Drop-Off Killers",

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
text: "How much shipping cost will you accept before abandoning?",
options: [
"Free Only",
"Under ₹50",
"Under ₹100",
"Under ₹300",
"Any if Product is Worth it"
]
},

{
id: "paymentPreference",
text: "How do you prefer to pay?",
options: [
"UPI",
"Cash on Delivery",
"Debit/Credit Card",
"Net Banking",
"BNPL / EMI",
"Crypto"
]
},

{
id: "returnPolicyImportance",
text: "How important is a good return / exchange policy to you?",
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
title: "3. Discovery Engines & Trust Anchors",

questions: [

{
id: "discoveryChannel",
text: "Where do you usually first discover a new product you end up buying?",
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
text: "What finally makes you trust a product enough to buy?",
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
text: "How do you feel about trying brands you have never heard of?",
options: [
"I love trying new brands",
"I try if reviews are good",
"I rarely try unknown brands",
"I avoid unknown brands completely"
]
},

{
id: "shoppingDevice",
text: "Which device do you mostly use to shop online?",
options: [
"Android Phone",
"iPhone",
"Laptop",
"Tablet",
"Desktop PC"
]
}

]
},

{
title: "4. Buying Psychology & Timelines",

questions: [

{
id: "conversionTrigger",
text: "What most directly makes you go from 'I want this' to actually buying?",
options: [
"Discount",
"Urgency/FOMO",
"Positive Reviews",
"Friend Recommendation",
"Limited Stock",
"Bundle Offer"
]
},

{
id: "decisionTimeline",
text: "How long does it usually take from first seeing a product to buying it?",
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
id: "giftingBehavior",
text: "Do you ever buy products as gifts for others?",
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
text: "When do you shop the most online?",
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
title: "5. High-Fidelity Sentiment (Written Experience)",

questions: [

{
id: "painPoint",
text: "What makes you leave a 1-star review? Describe your worst experience.",
type: "textarea"
},

{
id: "bestPoint",
text: "What makes you a loyal customer? Describe your best purchase experience.",
type: "textarea"
},

{
id: "complementPoint",
text: "What is the bare minimum you expect from any online purchase?",
type: "textarea"
},

{
id: "referralVoice",
text: "Describe the last time you recommended a product to someone. What did you say?",
type: "textarea"
}

]
},

{
title: "6. Niche Vertical - Shopping Categories",

questions: [

{
id: "shoppingCategories",
text: "Which categories do you shop online most?",
multiple: true,
options: [
"Fashion",
"Beauty",
"Electronics",
"Gaming",
"Fitness",
"Books",
"Home Decor",
"Jewellery",
"Groceries"
]
},

{
id: "categorySpendCeiling",
text: "How much do you typically spend per purchase in your main category?",
options: [
"Under ₹300",
"₹300 - ₹800",
"₹800 - ₹2k",
"₹2k - ₹5k",
"₹5k - ₹15k",
"Above ₹15k"
]
}

]
},

{
title: "7. Post-Purchase Behavior",

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
}

];
