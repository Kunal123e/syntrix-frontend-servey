// data.js
window.getSectionTitle = function(section) { 
  return section.title || "Consumer Research Matrix"; 
};

window.getSurveyData = function() {
  return [
    {
      id: "sec_1",
      title: "Module 1: Product Discovery",
      questions: [
        {
          id: "q_ecommerce_search",
          question: "When looking for a new product, where do you start your search?",
          options: [
            "Technical comparison sites and deep-dive Reddit threads.",
            "Curated Pinterest boards, Instagram aesthetics, or brand lookbooks.",
            "Established retail giants (Amazon/Walmart) with guaranteed buyer protection.",
            "TikTok feeds, YouTube reviews, or what my favorite creators recommend."
          ]
        }
      ]
    },
    {
      id: "sec_2",
      title: "Module 2: The Purchase Trigger",
      questions: [
        {
          id: "q_ecommerce_trigger",
          question: "What is the primary reason you finally hit 'Buy' on an item sitting in your cart?",
          options: [
            "The price dropped to my target threshold based on tracking tools.",
            "It perfectly completes a specific look or aesthetic I am building.",
            "I confirmed the 30-day free return policy, so there is zero risk.",
            "I saw someone in my circle or a trusted influencer successfully using it."
          ]
        }
      ]
    },
    {
      id: "sec_3",
      title: "Module 3: Cart Abandonment",
      questions: [
        {
          id: "q_ecommerce_abandon",
          question: "What instantly makes you abandon a checkout page?",
          options: [
            "Hidden shipping fees or taxes that ruin the total value proposition.",
            "A clunky, ugly checkout interface that feels unbranded or cheap.",
            "Lack of trusted payment gateways (like PayPal/Apple Pay) or missing security badges.",
            "A sudden lack of social proof or bad recent reviews on the product page."
          ]
        }
      ]
    },
    {
      id: "sec_4",
      title: "Module 4: Impulse Buying",
      questions: [
        {
          id: "q_ecommerce_impulse",
          question: "You make an unplanned purchase. What usually causes this?",
          options: [
            "A mathematically unbeatable flash sale or stacking discount codes.",
            "A limited-edition drop with incredible packaging and exclusive design.",
            "A 'buy now, pay later' option with a lifetime guarantee included.",
            "A viral trend that is selling out quickly across my social feeds."
          ]
        }
      ]
    },
    {
      id: "sec_5",
      title: "Module 5: Post-Purchase Loyalty",
      questions: [
        {
          id: "q_ecommerce_loyalty",
          question: "After receiving a product, what makes you a loyal repeat customer?",
          options: [
            "The product strictly meets all advertised benchmarks and longevity claims.",
            "The unboxing experience was premium and the product looks better in person.",
            "Customer service instantly resolved a minor issue with zero friction.",
            "The brand has an active, exclusive community or Discord I can join."
          ]
        }
      ]
    },
    {
      id: "sec_6",
      title: "Module 6: Brand Discovery",
      questions: [
        {
          id: "q_ecommerce_discovery",
          question: "How do you usually discover emerging D2C (Direct-to-Consumer) brands?",
          options: [
            "Algorithmic tech articles, performance blogs, or SEO-driven guides.",
            "High-end digital lookbooks, design awards, or visual ad campaigns.",
            "Verified consumer reports or established marketplace incubators.",
            "Organic viral posts on TikTok or Instagram Reels."
          ]
        }
      ]
    },
    {
      id: "sec_7",
      title: "Module 7: Premium Pricing",
      questions: [
        {
          id: "q_ecommerce_premium",
          question: "You choose a more expensive premium option over a budget alternative. Why?",
          options: [
            "The cost-per-use and material durability justify the higher upfront price.",
            "The silhouette, brand identity, and exclusivity are worth the premium.",
            "It includes an extended warranty and priority customer support.",
            "It carries cultural cachet and is recognized within my social circle."
          ]
        }
      ]
    },
    {
      id: "sec_8",
      title: "Module 8: Review Analysis",
      questions: [
        {
          id: "q_ecommerce_reviews",
          question: "How do you read product reviews before purchasing?",
          options: [
            "I filter by 3-star reviews to find the most objective, detailed pros and cons.",
            "I look exclusively at user-uploaded photos to check the actual color and fit.",
            "I search for terms like 'broken,' 'return,' or 'scam' to audit worst-case scenarios.",
            "I skip text and look for video reviews from creators who share my lifestyle."
          ]
        }
      ]
    }
  ];
};
