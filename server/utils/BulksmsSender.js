const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendBulkSMS = async (phoneNumbers, message) => {
  for (const phone of phoneNumbers) {
    if (!phone) continue;

    try {
      // console.log("TWILIO_PHONE:", process.env.TWILIO_PHONE,process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_FROM || undefined,
        // messagingServiceSid: process.env.TWILIO_MESSAGING_SID || undefined,
        to: "+91" + phone
      });
      console.log(`✅ SMS sent to ${phone}`);
    } catch (err) {
      console.error(`❌ Failed to send SMS to ${phone}:`, err.message);
    }
  }
};

module.exports = { sendBulkSMS };
