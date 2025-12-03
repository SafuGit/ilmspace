import { Theme } from "next-auth";
import { createTransport } from "nodemailer"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendVerificationRequest(params: { identifier: any; url: any; provider: any; theme: any }) {
  console.log('\n========== EMAIL VERIFICATION REQUEST ==========');
  console.log('📧 Starting email verification process...');
  
  const { identifier, url, provider, theme } = params
  
  console.log('\n[1] REQUEST PARAMETERS:');
  console.log('   → Recipient:', identifier);
  console.log('   → URL:', url);
  console.log('   → Provider from:', provider.from);
  console.log('   → Theme:', theme);
  
  const { host } = new URL(url)
  console.log('\n[2] PARSED HOST:', host);
  
  console.log('\n[3] SMTP SERVER CONFIG:');
  console.log('   → Host:', provider.server.host);
  console.log('   → Port:', provider.server.port);
  console.log('   → User:', provider.server.auth?.user);
  console.log('   → Password:', provider.server.auth?.pass ? '***' + provider.server.auth.pass.slice(-4) : 'NOT SET');
  console.log('   → Secure:', provider.server.secure);
  console.log('   → TLS:', provider.server.tls);
  
  console.log('\n[4] CREATING TRANSPORT...');
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server)
  console.log('   ✓ Transport created successfully');
  
  console.log('\n[5] PREPARING EMAIL...');
  const emailData = {
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  };
  console.log('   → To:', emailData.to);
  console.log('   → From:', emailData.from);
  console.log('   → Subject:', emailData.subject);
  
  console.log('\n[6] SENDING EMAIL...');
  try {
    const result = await transport.sendMail(emailData)
    console.log('   ✓ Email sent successfully!');
    console.log('\n[7] SEND RESULT:');
    console.log('   → Message ID:', result.messageId);
    console.log('   → Accepted:', result.accepted);
    console.log('   → Rejected:', result.rejected);
    console.log('   → Response:', result.response);
    
    // Some transports may return a `pending` array but SentMessageInfo doesn't define it,
    // so guard and use a type assertion to avoid TypeScript errors.
    const rejected = result.rejected ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pending = (result as any).pending ?? []
    const failed = rejected.concat(pending).filter(Boolean)
    
    if (failed.length) {
      console.log('\n❌ [ERROR] Failed recipients:', failed);
      throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
    
    console.log('\n✅ EMAIL VERIFICATION COMPLETE');
    console.log('================================================\n');
  } catch (error) {
    console.log('\n❌ [ERROR] Email sending failed!');
    console.log('   → Error:', error);
    console.log('================================================\n');
    throw error;
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string, host: string, theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = theme.brandColor || "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string, host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}