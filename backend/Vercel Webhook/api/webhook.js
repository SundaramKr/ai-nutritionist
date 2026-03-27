import twilio from "twilio";

export default async function handler(req, res) {
  try {
    // Fix 1: Set CORS headers first
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    // Fix 2: Proper CORS preflight handling
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ success: true, message: "CORS preflight successful" });
    }
    
    // =========================
    // 1. VALIDATE EVENT
    // =========================
    const body = req.body;
    
    if (body.event !== "call_analyzed") {
      return res.status(200).json({ success: true, message: "Event ignored" });
    }
    
    const callId = body.call?.call_id;
    
    if (!callId) {
      return res.status(200).json({ success: true, message: "Invalid call ID" });
    }
    
    // ✅ 2. TRY INSERT (dedupe happens here)
    const insertRes = await fetch(`https://eiecdmzgvoagdsivbmzn.functions.supabase.co/save-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ call_id: callId })
    });
    
    if (!insertRes.ok) {
      console.log("Duplicate ignored:", callId);
      return res.status(200).json({ success: true, message: "Duplicate call ID, processing skipped" });
    }
    
    const OPENAI_API_KEY = "..";
    const SUPABASE_URL = "..";
    
    const client = twilio(
      "..",
      ".."
    );
    
    const DEMO_NUMBER = "+916205704391"; 
    
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
      phone: dynamic.phone || null,
      
      wants_whatsapp: data.user_whatsapp || "No"
    };
    
    const userDetails= `
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
`;
    
    // =========================
    // 4. SYSTEM PROMPT
    // =========================
    const systemPromptJson = `
You are an expert Indian nutritionist and diet coach.
    
Your task is to generate highly personalized, practical, and realistic Indian meal plans.
    
CRITICAL RULES (STRICT):
1. ONLY output valid JSON. NO markdown, NO explanations outside JSON.
2. Follow the exact JSON schema provided. DO NOT change structure.
3. Do NOT add extra fields.
4. Do NOT remove any required fields.
5. Do NOT rename keys.
6. Ensure all values are filled (no null unless unavoidable).
7. Numbers must be numbers (not strings).
8. Keep units consistent:
   - calories in kcal
   - protein/carbs/fats in grams
   - prep_time in minutes
   - cost in INR (₹ as number)
9. MAKE SURE you don't miss a single day of the week in the response. Don't do // Remaining days (Wednesday → Sunday) follow the exact same structure. Or examples like this anywhere. Make sure json is complete everywhere.
    
NUTRITION RULES:
1. ONLY suggest Indian foods.
2. Avoid western foods unless explicitly requested.
3. Meals must be simple, affordable, realistic.
4. Respect diet type, allergies, conditions.
5. Align strictly with user's goal.
6. Ensure sufficient protein intake.
7. Avoid repeating meals more than 2 times/week.
8. Consider budget and lifestyle.
    
OUTPUT MUST BE PURE JSON.
`;
    
    const userPromptJson = `
Generate a highly personalized 7-day Indian meal plan.
    
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
STRICT JSON SCHEMA
====================
    
{
  "plan": {
    "goal": "string",
    "diet_type": "string",
    "days": [
      {
        "day": "Monday",
        "meals": {
          "breakfast": {
            "name": "string",
            "ingredients": ["string"],
            "prep_time": number,
            "macros": {
              "calories": number,
              "protein": number,
              "carbs": number,
              "fats": number
            },
            "alternative": "string"
          },
          "lunch": { same structure },
          "dinner": { same structure }
        },
        "totals": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        },
        "micronutrients": ["string"],
        "explanation": "string"
      }
    ]
  },
  "grocery_list": {
    "grains": ["string"],
    "proteins": ["string"],
    "vegetables": ["string"],
    "dairy": ["string"],
    "others": ["string"]
  },
  "cost": {
    "daily": [number],
    "average": number
  },
  "insights": ["string"],
  "tips": ["string"]
}
    
====================
OUTPUT REQUIREMENTS
====================
    
1. Fill all 7 days (Monday → Sunday).
2. Each meal must include:
   - name
   - ingredients
   - prep_time
   - macros
   - alternative option
3. Each day must include:
   - totals
   - micronutrients
   - explanation
4. Grocery list must be grouped correctly.
5. Cost must include 7 daily values + average.
6. Insights: 3–5 points.
7. Tips: exactly 3 points.
    
FINAL RULE:
RETURN ONLY VALID JSON. NO TEXT BEFORE OR AFTER.
`;
    
    
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
    // Fix 3: Correct OpenAI API endpoint and response structure
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPromptJson },
          { role: "user", content: userPromptJson }
        ]
      })
    });
    
    const aiData = await aiRes.json();
    
    let mealPlan = "Failed to generate meal plan.";
    
    try {
      // Fix 4: Correct response structure
      mealPlan = aiData.choices[0].message.content;
    } catch (err) {
      console.error("Parse error:", err);
      console.error("OpenAI response:", JSON.stringify(aiData, null, 2));
    }
    
    // Whatsapp
    const aiResWhatsapp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are generating a WhatsApp-friendly meal plan summary.
            
STRICT RULES:
- MAX 1200 characters TOTAL (hard limit)
- If you exceed, the response is INVALID
- Keep it short, compact, and clean
- No extra explanations
- Use bullet points where possible
- Focus only on key meals and highlights
            
            ${systemPrompt}
`
          },
          {
            role: "user",
            content: `
Create a SHORT WhatsApp version of the meal plan.
            
Compress the full plan into:
- 1-day sample OR summary of pattern
- Highlight protein sources
- Mention goal (weight gain, etc.)
            
USER DATA:
            ${userPrompt}
`
          }
        ]
      })
    });
    
    const aiDataWhatsapp = await aiResWhatsapp.json();
    
    let mealPlanWhatsapp = "Failed";
    
    try {
      // Fix 5: Correct response structure for WhatsApp
      mealPlanWhatsapp = aiDataWhatsapp.choices[0].message.content;
      
      if (mealPlanWhatsapp.length > 1500) {
        mealPlanWhatsapp = mealPlanWhatsapp.substring(0, 1500) + "...";
      }
      
    } catch (err) {
      console.error("WhatsApp Parse error:", err);
      console.error("OpenAI WhatsApp response:", JSON.stringify(aiDataWhatsapp, null, 2));
    }
    
    // =========================
    // 7. SEND TO SUPABASE
    // =========================
    if (user.phone) {
      await fetch(`${SUPABASE_URL}?phone=${user.phone}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "details",
          name: user.name,
          user_details: userDetails
        })
      });
      
      await fetch(`${SUPABASE_URL}?phone=${user.phone}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "plan",
          meal_plan: mealPlan
        })
      });
    }
    
    if (user.wants_whatsapp === "Yes") {
      try {
        await client.messages.create({
          from: "whatsapp:+14155238886",
          to: `whatsapp:${DEMO_NUMBER}`,
          body: `Hi ${user.name}, your AI meal plan is ready 💪\n\n${mealPlanWhatsapp}` 
        });
        
        console.log("WhatsApp sent");
      } catch (err) {
        console.error("WhatsApp error:", err);
      }
    }
    
    // =========================
    // 8. RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      mealPlan: mealPlan.substring(0, 100) + "..." // Send sample for debugging
    });
    
  } catch (error) {
    console.error("Webhook error:", error);
    
    // Fix 6: Only send response if headers haven't been sent
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  }
}
