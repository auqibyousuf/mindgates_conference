import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { readData, writeData } from '@/lib/data-handler'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 1. Save message to contact_messages.json
    const messages = (await readData('contact_messages.json')) as Record<string, unknown>[] || []
    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
    }

    messages.push(newMessage)
    await writeData('contact_messages.json', messages)

    // 2. Send email notification via SMTP (Gmail)
    const smtpUser = process.env.SMTP_USER || ''
    const smtpPass = process.env.SMTP_PASS

    // Load admin email: check env variable, then siteConfig, then fallback to SMTP_USER
    let adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || ''
    try {
      const siteConfig = (await readData('siteConfig.json')) as { contact?: { email?: string } }
      if (siteConfig?.contact?.email && !process.env.ADMIN_EMAIL) {
        adminEmail = siteConfig.contact.email
      }
    } catch (err) {
      console.error('Failed to read dynamic email from siteConfig.json, falling back', err)
    }

    let emailSent = false
    let smtpError = null

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        // Email to the administrator (dynamic email)
        const mailOptions = {
          from: `"Mindgates Contact" <${smtpUser}>`,
          to: adminEmail,
          subject: `Contact Inquiry: ${subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4f46e5;">New Contact Message Received</h2>
              <p>You have received a new contact inquiry from the Mindgates Conference website.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 120px;">Name</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td>
                  <td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
            </div>
          `,
        }

        await transporter.sendMail(mailOptions)
        emailSent = true
      } catch (err) {
        console.error('SMTP Contact Email Error:', err)
        smtpError = err instanceof Error ? err.message : String(err)
      }
    } else {
      console.warn('SMTP_PASS is not configured. Simulating email sending.')
      console.log(`--- Mock SMTP Contact Notification (${adminEmail}) ---`)
      console.log('Contact Message Details:', newMessage)
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
      emailSent,
      smtpError,
    })
  } catch (error) {
    console.error('Contact Endpoint Error:', error)
    const errMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: errMsg },
      { status: 500 }
    )
  }
}
