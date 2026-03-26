const RETELL_API_KEY = dotenv.RETELL_API_KEY;
const FROM_NUMBER = "+13186162139";
const AGENT_ID = "agent_06ec6b99b1437632316bc34f2c";

function onFormSubmit(e) {
  try {
    const formData = {
      timestamp: e.values[0],
      firstName: e.values[1],
      phone: e.values[2],
      preferredLanguage: e.values[3]
    };
    
    const payload = {
      from_number: FROM_NUMBER,
      to_number: formData.phone,
      agent_id: AGENT_ID,
      retell_llm_dynamic_variables: formData
    };
    
    const response = UrlFetchApp.fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "post",
      contentType: "application/json",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    Logger.log("Payload sent: " + JSON.stringify(payload));
    Logger.log("Retell response: " + response.getContentText());
    
  } catch (error) {
    Logger.log(`Error: ${error}`);
  }
}