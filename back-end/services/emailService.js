const brevo = require("@getbrevo/brevo");
require("dotenv").config();

function renderKeyValues(data, { exclude = [] } = {}) {
  return Object.entries(data)
    .filter(([k]) => !exclude.includes(k))
    .map(
      ([k, v]) =>
        `<div style="margin-bottom:6px;">
           <strong>${k}:</strong> ${v ?? ""}
         </div>`
    )
    .join("");
}
async function sendEmail({
  subject,
  to, // { email, name } | Array<{ email, name }>
  html, // optional: full HTML string (wins if provided)
  keyValues, // optional: object to render as rows
  excludeKeys = [], // keys to exclude when rendering keyValues
  title = "Migdalor", // email title header
}) {
  const sender_mail = process.env.BREVO_SENDER_MAIL;
  const apiKey = process.env.BREVO_API_KEY;
  if (!sender_mail || !apiKey) {
    console.error("❌ Missing BREVO credentials");
    return;
  }

  const recipients = Array.isArray(to) ? to : [to];

  const emailAPI = new brevo.TransactionalEmailsApi();
  emailAPI.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

  const msg = new brevo.SendSmtpEmail();
  msg.subject = subject;
  msg.sender = { name: "MigdalOr", email: sender_mail };
  msg.to = recipients;

  const content =
    html ??
    `
      <div style="padding:10px;border:1px solid #ccc;border-radius:5px;">
        ${renderKeyValues(keyValues || {}, { exclude: excludeKeys })}
      </div>
    `;

  msg.htmlContent = `
    <html>
      <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
        <h1>${title}</h1>
        ${content}
      </body>
    </html>
  `;

  const res = await emailAPI.sendTransacEmail(msg);
  return res?.body;
}

module.exports = {
  sendEmail,
};
