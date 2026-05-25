import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = 'Diocese Vacation Office <noreply@diocese.org>'

export async function sendRequestConfirmation(
  to: string,
  priestName: string,
  requestId: string
) {
  console.log(`📧 EMAIL SENT (Confirmation):`)
  console.log(`   To: ${to}`)
  console.log(`   Subject: Vacation Request Received - Fr. ${priestName}`)
  console.log(`   Request ID: ${requestId}`)
  console.log(`   ---`)

  if (!resend) {
    console.log(`   ⚠️  Resend not configured - email logged to console only`)
    return
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Vacation Request Received - Fr. ${priestName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D1B4E;">Vacation Request Submitted</h2>
          <p>Dear Sir/Madam,</p>
          <p>We have received your vacation request for <strong>Fr. ${priestName}</strong>.</p>
          <p>Your request ID: <strong>${requestId}</strong></p>
          <p>The diocese will review your request and respond within 48 hours with estimated costs and next steps.</p>
          <p>You can track your request at your dashboard.</p>
          <br/>
          <p>God bless,</p>
          <p><em>Catholic Diocese Vacation Office</em></p>
        </div>
      `
    })
  } catch (error) {
    console.error('Email failed:', error)
  }
}

export async function sendStatusUpdate(
  to: string,
  priestName: string,
  status: string,
  cost: string | null,
  notes: string | null
) {
  const statusMessages: Record<string, string> = {
    pending: "Your request is pending review.",
    under_review: "Your request is now under review by the diocese.",
    payment_required: "Payment is required to proceed with your request.",
    approved: "Your request has been approved! Payment verified.",
    denied: "Your request has been denied.",
  }

  console.log(`📧 EMAIL SENT (Status Update):`)
  console.log(`   To: ${to}`)
  console.log(`   Subject: Vacation Request ${status.toUpperCase()} - Fr. ${priestName}`)
  console.log(`   Status: ${status}`)
  console.log(`   ---`)

  if (!resend) {
    console.log(`   ⚠️  Resend not configured - email logged to console only`)
    return
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Vacation Request ${status.toUpperCase()} - Fr. ${priestName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D1B4E;">Request Update</h2>
          <p>Dear Sir/Madam,</p>
          <p>Your vacation request for <strong>Fr. ${priestName}</strong> has been updated.</p>
          <p><strong>Status:</strong> ${status.replace("_", " ").toUpperCase()}</p>
          <p>${statusMessages[status] || ""}</p>
          ${cost ? `<p><strong>Estimated Cost:</strong> $${cost}</p>` : ''}
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          <p>Log in to your dashboard to see full details.</p>
          <br/>
          <p>God bless,</p>
          <p><em>Catholic Diocese Vacation Office</em></p>
        </div>
      `
    })
  } catch (error) {
    console.error('Email failed:', error)
  }
}