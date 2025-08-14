const brevo = require("@getbrevo/brevo");
require("dotenv").config();

const register_content = (data) => {
  let content = "";
  for (const [key, value] of Object.entries(data)) {
    if (key === "subject") continue; // skip subject
    content += `<div style="margin-bottom:6px;"><strong>${key}:</strong> ${value}</div>`;
  }
  return content;
};

const send_mail = async (data) => {
  const sender_mail = process.env.BREVO_SENDER_MAIL;
  const brevo_api_key = process.env.BREVO_API_KEY;
  if (!brevo_api_key || !sender_mail) {
    console.error(
      "❌ brevo API-key or sender mail environment variable is not set"
    );
    return;
  }
  const emailAPI = new brevo.TransactionalEmailsApi();
  emailAPI.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevo_api_key);

  const msg = new brevo.SendSmtpEmail();
  const content = register_content(data);
  msg.subject = data.subject;
  msg.htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h1>Hello from Brevo</h1>
        <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
          ${content}
        </div>
      </body>
    </html>
  `;
  msg.sender = { name: "MigdalOr", email: sender_mail }; // must be a verified domain
  msg.to = [
    { name: `${data.first_name} ${data.last_name}`, email: data.email },
  ];

  try {
    const res = await emailAPI.sendTransacEmail(msg);
    console.log("✅ Sent:", JSON.stringify(res.body));
  } catch (err) {
    console.error("❌ Brevo error:", err?.body || err);
  }
};

/*
const data = {
  subject: "Welcome to MigdalOr!",
  username: "maher_s",
  password: "securePass123",
  first_name: "Maher",
  last_name: "Salman",
  email: "mahersal001@gmail.com",
  phone_number: "+972501234567",
};

*/
module.exports = {
  send_mail,
};
