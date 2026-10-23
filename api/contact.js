const nodemailer = require('nodemailer');

// Helper to escape HTML to prevent injection
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Fallback for form-urlencoded
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }
    body = body || {};

    const name = body.name || body.Name || '';
    const email = body.email || body.Email || '';
    const phone = body.phone || body.Phone || body['Phone number'] || '';
    const message = body.message || body.Message || '';
    const subject = body.subject || body.Subject || '';
    const formType = body.formType || body.form_type || '';
    // Honeypot spam fields
    const website = body.website || body.company_hp || body.feedback || body.notes || body.details || body.remarks || body.comments;

    // Honeypot spam protection: if bot filled hidden field, reject silently
    if (website) {
      console.warn('Spam honeypot triggered. Silently discarding.');
      return res.status(200).json({ success: true, message: 'Message received.' });
    }

    // Basic validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const cleanEmail = escapeHtml(email.trim());
    const cleanName = escapeHtml((name || 'Website Visitor').trim());
    const cleanPhone = escapeHtml((phone || 'Not provided').trim());
    const cleanMessage = escapeHtml((message || 'No message provided').trim());
    const isNewsletter = formType === 'newsletter' || (!message && !phone);

    console.log(`[Form Submission] Type: ${isNewsletter ? 'Newsletter' : 'Contact'}, From: ${cleanName} <${cleanEmail}>`);

    // SMTP Configuration
    let smtpHost = process.env.SMTP_HOST;
    let smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, ''); // strip any spaces from app password
    const isGmail = (smtpHost && smtpHost.includes('gmail')) || (smtpUser && smtpUser.toLowerCase().endsWith('@gmail.com'));

    if (isGmail && !smtpHost) {
      smtpHost = 'smtp.gmail.com';
    }

    const secure = process.env.SMTP_SECURE === 'true' || smtpPort === 465 || isGmail;

    // Recipient email address
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.RECIPIENT_EMAIL || smtpUser || 'ahmedzulfiqar.dev@gmail.com';

    // If SMTP credentials are configured, send real email via Nodemailer
    if ((smtpHost || isGmail) && smtpUser && smtpPass) {
      const transportConfig = isGmail
        ? {
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          }
        : {
            host: smtpHost,
            port: smtpPort,
            secure: secure,
            auth: {
              user: smtpUser,
              pass: smtpPass
            },
            tls: {
              rejectUnauthorized: false
            }
          };

      const transporter = nodemailer.createTransport(transportConfig);

      const mailSubject = isNewsletter
        ? `[Amprex Newsletter] New subscriber: ${cleanEmail}`
        : `[Amprex Inquiry] New contact from ${cleanName} (${cleanEmail})`;

      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121614; color: #f3ffc9; border-radius: 12px; overflow: hidden; border: 1px solid #363d35;">
          <div style="background-color: #1a201d; padding: 24px; border-bottom: 1px solid #363d35;">
            <h1 style="color: #f3ffc9; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.01em;">AMPREX — New ${isNewsletter ? 'Newsletter Subscription' : 'Inquiry'}</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #a9ad9b; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a9ad9b;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${cleanEmail}" style="color: #f3ffc9;">${cleanEmail}</a></td>
              </tr>
              ${!isNewsletter ? `
              <tr>
                <td style="padding: 8px 0; color: #a9ad9b;">Phone:</td>
                <td style="padding: 8px 0; color: #ffffff;">${cleanPhone}</td>
              </tr>
              ` : ''}
            </table>
            
            ${!isNewsletter ? `
            <div style="margin-top: 20px; padding: 16px; background-color: rgba(243, 255, 201, 0.05); border-radius: 8px; border: 1px solid rgba(243, 255, 201, 0.15);">
              <div style="color: #a9ad9b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Message:</div>
              <div style="color: #f3ffc9; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${cleanMessage}</div>
            </div>
            ` : ''}
          </div>
          <div style="padding: 16px 24px; background-color: #161a18; border-top: 1px solid #363d35; font-size: 12px; color: #a9ad9b; text-align: center;">
            Sent automatically from amprexhq.com
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Amprex Notifications" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: cleanEmail,
        subject: mailSubject,
        html: htmlContent,
        text: `New ${isNewsletter ? 'Subscription' : 'Inquiry'}\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone}\n\nMessage:\n${cleanMessage}`
      });

      console.log(`[SMTP Success] Email delivered to ${recipientEmail}`);
      return res.status(200).json({
        success: true,
        message: isNewsletter
          ? 'Thank you for subscribing! You are now on the list.'
          : 'Thank you! Your message has been received. Our team will reach out shortly.'
      });
    } else {
      // SMTP not yet configured in environment variables
      console.warn('[SMTP Notice] SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) are not set. The inquiry has been logged above.');
      return res.status(200).json({
        success: true,
        warning: 'SMTP_CREDENTIALS_PENDING',
        message: isNewsletter
          ? 'Thank you for subscribing!'
          : 'Thank you! Your message has been received. We will get back to you shortly.'
      });
    }
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process inquiry. Please try again later or email us directly.'
    });
  }
};
