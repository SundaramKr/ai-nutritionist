export default async function handler(req, res) {
  try {
    // =========================
    // 1. VALIDATE EVENT
    // =========================
    const body = req.body;

    if (body.event !== "call_analyzed") {
      return res.status(200).json({
        success: true,
        message: "Ignored event"
      });
    }

    const OPENAI_API_KEY = dotenv.OPENAI_API_KEY;
    const WEBHOOK_2_URL = dotenv.WEBHOOK_2_URL;

    // =========================
    // 2. EXTRACT DATA
    // =========================
    const call = body.call || {};
    const analysis = call.call_analysis || {};
    const data = analysis.custom_analysis_data || {};
    const dynamic = call.retell_llm_dynamic_variables || {};
    // =========================
    // 3. NORMALIZE USER DATA
    // =========================
    const user = {
      age: data.user_age || "unknown",
      height: data.user_height || "unknown",
      weight: data.user_weight || "unknown",
      gender: data.user_gender ||"not specified",

      goal: data.user_goal || "general fitness",
      diet: data.user_diet || "mixed",

      conditions: data.user_health || "none",
      allergies: data.user_allergies || "none",

      activity_level: data.user_activity || "moderate",
      workout_type: data.user_workout || "none",
      profession: data.user_profession || "not specified",

      current_meals: data.user_current_meal || "3",
      preferred_meals: data.user_preferred_meal || "3",
      outside_food_freq: data.user_eatout || "occasionally",

      body_fat: data.user_bodyfat || "unknown",
      budget: data.user_budget || "no constraint",
      water_intake: data.user_waterintake || "not specified",
      sleep_quality: data.user_sleepquality || "not specified",
      cuisine: data.user_preferences || "mixed",
      dislikes: data.user_dislikes || "none",
      meal_prep: data.user_mealprep || "no preference",

      custom_notes: data.user_additional || "none",

      name: dynamic.firstName || "User",
      phone: dynamic.phone || null
    };

    // =========================
    // 4. SYSTEM PROMPT
    // =========================
    const systemPrompt = `
You are an expert Indian nutritionist and diet coach.

Your goal is to generate highly personalized, practical, and realistic Indian meal plans based on user data.

You must strictly follow these rules:

1. ONLY suggest Indian foods (North Indian, South Indian, or common Indian household meals).
2. Avoid western foods like quinoa, avocado toast, salads-only diets unless explicitly requested.
3. Meals must be simple, affordable, and easy to prepare.
4. Respect all dietary restrictions (vegetarian, eggitarian, non-vegetarian, Jain, allergies).
5. Adapt plans based on health conditions (diabetes, PCOS, thyroid, etc).
6. Ensure the plan aligns with the user's goal (fat loss, weight gain, muscle building, maintenance).
7. Ensure sufficient protein intake for muscle-related goals.
8. Avoid repeating the same dish more than 2 times per week.
9. Keep the user's budget and lifestyle constraints in mind.
10. Prefer realistic Indian meal timings and combinations.

Your response must be:
- Structured
- Clear
- Practical
- Personalized

Do NOT give generic advice.
Do NOT skip any required section.`;

    // =========================
    // 5. USER PROMPT
    // =========================
    const userPrompt = `
Generate a highly personalized 7-day Indian meal plan for the following user.

====================
USER PROFILE
====================

Basic Details:
- Age: ${user.age}
- Height: ${user.height}
- Weight: ${user.weight}
- Gender: ${user.gender}

Goal:
- Primary Goal: ${user.goal}

Diet:
- Diet Type: ${user.diet}

Health:
- Medical Conditions: ${user.conditions}
- Allergies: ${user.allergies}

Lifestyle:
- Activity Level: ${user.activity_level}
- Workout Type: ${user.workout_type}
- Profession: ${user.profession}

Eating Habits:
- Current Meals per Day: ${user.current_meals}
- Preferred Meals per Day: ${user.preferred_meals}
- Eats Outside Frequency: ${user.outside_food_freq}

Advanced Preferences:
- Body Fat %: ${user.body_fat}
- Budget: ${user.budget}
- Water Intake: ${user.water_intake}
- Sleep Quality: ${user.sleep_quality}
- Cuisine Preference: ${user.cuisine}
- Foods to Avoid: ${user.dislikes}
- Meal Prep: ${user.meal_prep}

Additional Notes:
${user.custom_notes}

====================
OUTPUT REQUIREMENTS
====================

1. Create a 7-day meal plan (Monday to Sunday)

2. For EACH DAY include along with the macros of the food:
- Breakfast
- Lunch
- Dinner

3. For EACH DAY include:
- Total Calories (kcal)
- Protein (grams)
- Carbohydrates (grams)
- Fats (grams)
- Micronutrients

4. For EACH DAY include a short explanation:
- Why these meals were chosen
- How they help the user achieve their goal

5. Ensure:
- Meals are realistic for Indian households
- Budget is respected
- Variety is maintained (no excessive repetition)
- Meals match user's lifestyle and activity level

6. Add for each meal:
- Approx preparation time (in minutes)

7. At the END include:

A. Weekly Grocery List grouped by:
- Grains
- Proteins
- Vegetables
- Dairy
- Others

B. Approx Daily Cost Estimate (₹)

C. Key Insights (3-5 bullet points):
- Calorie strategy (deficit/surplus)
- Protein adequacy
- Any health-specific notes

D. 3 Smart Tips:
- Practical advice (e.g., eating out, hydration, consistency)

====================
FORMATTING RULES
====================

- Use clean headings
- Keep it readable
- Do NOT output JSON
- Do NOT be verbose
- Keep explanations concise but meaningful

Additionally:

- Highlight high-protein meals clearly.
- Suggest 1 alternative option for each meal (for flexibility).
- Ensure at least 1 regional variation (North/South Indian mix) if preference is mixed.
`;

    // =========================
    // 6. CALL OPENAI
    // =========================
    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const aiData = await aiRes.json();

    let mealPlan = "Failed to generate meal plan.";

    try {
      mealPlan = aiData.output[0].content[0].text;
    } catch (err) {
      console.error("Parse error:", err);
    }

    // =========================
    // 7. SEND TO WEBHOOK 2
    // =========================
    await fetch(WEBHOOK_2_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        name: user.name,
        phone: user.phone,
        mealPlan
      })
    });

    // =========================
    // 8. RESPONSE
    // =========================
    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}