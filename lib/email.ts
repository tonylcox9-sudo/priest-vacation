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
          <h2 style="color: #1e3a5f;">Vacation Request Submitted</h2>
          <p>Dear Sir/Madam,</p>
          <p>We have received your vacation request for <strong>Fr. ${priestName}</strong>.</p>
          <p>Your request ID: <strong>${requestId}</strong></p>
          <p>The diocese will review your request and respond within 48 hours with estimated costs and next steps.</p>
          <p>If you have questions, reply to this email or call the diocese office.</p>
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
  const statusColor = status === 'approved' ? '#22c55e' : status === 'denied' ? '#ef4444' : '#f59e0b'
  
  console.log(`📧 EMAIL SENT (Status Update):`)
  console.log(`   To: ${to}`)
  console.log(`   Subject: Vacation Request ${status.toUpperCase()} - Fr. ${priestName}`)
  console.log(`   Status: ${status}`)
  console.log(`   Cost: ${cost || 'Not set'}`)
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
          <h2 style="color: ${statusColor};">Request ${status.toUpperCase()}</h2>
          <p>Dear Sir/Madam,</p>
          <p>Your vacation request for <strong>Fr. ${priestName}</strong> has been <strong>${status}</strong>.</p>
          ${cost ? `<p><strong>Estimated Cost:</strong> $${cost}</p>` : ''}
          ${notes ? `<p><strong>Diocese Notes:</strong> ${notes}</p>` : ''}
          <p>Please contact the diocese office for payment instructions and further arrangements.</p>
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