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
      ans.includes("Always") || // Always compares prices
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
      ans.includes("Very Often") || // Gifting very often
      ans.includes("Share on Social Media") || 
      ans.includes("Recommend to Friends")
    ) {
      scores.Native += 2;
    }
  }

  // Find the persona with the highest score
  let tieBreaker = "Analyzer"; // Default fallback
  let maxScore = -1;
  
  for (const key in scores) {
    if (scores[key] > maxScore) { 
      maxScore = scores[key]; 
      tieBreaker = key; 
    }
  }
  
  return tieBreaker;
}