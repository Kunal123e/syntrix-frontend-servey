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
"Metro",
"Tier 2",
"Tier 3"
]
},
{
id: "ageGroup",
text: "What is your age group?",
options: [
"16-20",
"21-25",
"26-30",
"31-36",
"37-45",
"45+"
]
},
{
id: "userPersona",
text: "What best describes you?",
options: [
"Student",
"Salaried Private",
"Salaried Govt",
"Freelancer",
"Self Employed"
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
"Shipping cost",
"Too expensive",
"No reviews",
"No easy return",
"Payment unavailable"
]
},

```
  {
    id: "paymentPreference",
    text: "How do you prefer to pay?",
    options: [
      "UPI",
      "COD",
      "Cards",
      "BNPL",
      "Net Banking"
    ]
  }
]
```

},

{
title: "3. Discovery Engines & Trust Anchors",
questions: [
{
id: "discoveryChannel",
text: "Where do you discover products?",
options: [
"Instagram Reels",
"YouTube",
"Google",
"Friends",
"WhatsApp"
]
},

```
  {
    id: "trustAnchor",
    text: "What makes you trust a product?",
    options: [
      "Photo Reviews",
      "4.2+ Ratings",
      "Influencer",
      "Friend Bought",
      "Known Brand"
    ]
  }
]
```

},

{
title: "4. Buying Psychology & Timelines",
questions: [
{
id: "conversionTrigger",
text: "What triggers your purchase?",
options: [
"Discount",
"Review Video",
"Friend Recommendation",
"FOMO",
"Bundle Offer"
]
},

```
  {
    id: "decisionTimeline",
    text: "How long before buying?",
    options: [
      "Instant",
      "1-3 Days",
      "1 Week",
      "1 Month",
      "Only if Needed"
    ]
  }
]
```

},

{
title: "5. Written Experience",
questions: [
{
id: "painPoint",
text: "Worst shopping experience?",
type: "textarea"
},

```
  {
    id: "bestPoint",
    text: "Best shopping experience?",
    type: "textarea"
  },

  {
    id: "complementPoint",
    text: "Minimum expectation?",
    type: "textarea"
  },

  {
    id: "referralVoice",
    text: "Last recommendation?",
    type: "textarea"
  }
]
```

},

{
title: "6. Shopping Categories",
questions: [
{
id: "shoppingCategories",
text: "Which categories do you shop most?",
options: [
"Beauty",
"Fashion",
"Electronics",
"Fitness",
"Books",
"Jewellery"
]
},

```
  {
    id: "categorySpendCeiling",
    text: "How much do you spend per purchase?",
    options: [
      "Under ₹300",
      "₹300 - ₹800",
      "₹800 - ₹2k",
      "₹2k - ₹5k",
      "Above ₹5k"
    ]
  }
]
```

},

{
title: "7. Post Purchase Behavior",
questions: [
{
id: "postPurchaseAction",
text: "What do you do after buying something you love?",
options: [
"Share Stories",
"Tell Friends",
"Leave Review",
"Buy Again Quietly",
"Nothing"
]
},

```
  {
    id: "returnHistoryReason",
    text: "Reason for returning products?",
    options: [
      "Different from Photos",
      "Poor Quality",
      "Wrong Size",
      "Damaged",
      "Never Returned"
    ]
  }
]
```

}
];
