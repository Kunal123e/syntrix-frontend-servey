// data.js
function getSurveyData() {
  return [
    {
      title: "1. Hardware & Setup",
      subtitle: "How do you approach buying new tech hardware?",
      questions: [
        {
          id: "q_hardware_choice",
          type: "radio",
          text: "When buying a new device, what is your primary focus?",
          options: [
            "I compare specs, benchmarks, and performance metrics.",
            "I care about how beautiful and sleek it looks on my desk.",
            "I only buy if it has a solid warranty and reliable track record.",
            "I buy what my favorite creators and community use."
          ]
        }
      ]
    },
    {
      title: "2. E-Commerce & Checkout",
      subtitle: "What drives your online shopping habits?",
      questions: [
        {
          id: "q_ecom_checkout",
          type: "radio",
          text: "You are at checkout for an expensive item. What makes you click buy?",
          options: [
            "Finding a 20% discount code after searching multiple coupon sites.",
            "The unboxing experience and premium brand packaging.",
            "A flexible return policy and extended buyer protection.",
            "Seeing a viral TikTok review proving it works."
          ]
        }
      ]
    },
    {
      title: "3. AI Tools & Adoption",
      subtitle: "How are you adapting to the AI revolution?",
      questions: [
        {
          id: "q_ai_adoption",
          type: "radio",
          text: "When a new AI tool launches, how do you react?",
          options: [
            "I read the technical whitepaper and test its API limits.",
            "I generate creative assets to see how good the output looks.",
            "I wait 6 months until the enterprise security flaws are patched.",
            "I immediately integrate it into my daily workflow like second nature."
          ]
        }
      ]
    },
    {
      title: "4. Subscription Audit",
      subtitle: "Managing recurring expenses.",
      questions: [
        {
          id: "q_subscription_audit",
          type: "radio",
          text: "How do you handle your monthly digital subscriptions?",
          options: [
            "I track them in a meticulous spreadsheet to optimize ROI.",
            "I keep them if they make my digital life feel curated and premium.",
            "I use virtual cards with strict limits so I never get overcharged.",
            "I share accounts with my squad and split the bills."
          ]
        }
      ]
    },
    {
      title: "5. Brand Loyalty",
      subtitle: "What keeps you coming back?",
      questions: [
        {
          id: "q_brand_loyalty",
          type: "radio",
          text: "Why do you stay loyal to a specific tech brand?",
          options: [
            "They consistently offer the best price-to-performance ratio.",
            "Their design language and UX are unmatched in the industry.",
            "They prioritize my privacy and offer great customer support.",
            "Everyone in my network uses them, so it's easier to collaborate."
          ]
        }
      ]
    },
    {
      title: "6. Flash Decisions",
      subtitle: "The impulse factor.",
      questions: [
        {
          id: "q_decision_speed",
          type: "radio",
          text: "You have 5 minutes to decide on a major software purchase. You...",
          options: [
            "Skim the feature list and pricing tiers to calculate value.",
            "Watch their promo video to get a feel for the interface.",
            "Check Reddit or Trustpilot for any major red flags.",
            "Just buy it. I can always cancel later if it's trash."
          ]
        }
      ]
    }
  ];
}
