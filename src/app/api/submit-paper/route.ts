import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { readData, writeData } from '@/lib/data-handler'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      affiliation,
      paperTitle,
      abstract,
      conferenceId,
      conferenceTitle,
      paperUrl,
    } = body

    if (!fullName || !email || !paperTitle || !paperUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 1. Save to submissions.json
    const submissions = (await readData('submissions.json')) as Record<string, unknown>[] || []
    const newSubmission = {
      id: `sub-${Date.now()}`,
      fullName,
      email,
      phone: phone || 'N/A',
      affiliation: affiliation || 'N/A',
      paperTitle,
      abstract: abstract || 'N/A',
      conferenceId,
      conferenceTitle,
      paperUrl,
      submittedAt: new Date().toISOString(),
    }
    
    submissions.push(newSubmission)
    await writeData('submissions.json', submissions)

    // 2. Send email notification via SMTP (Gmail)
    const smtpUser = process.env.SMTP_USER || ''
    const smtpPass = process.env.SMTP_PASS // App password if configured

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
        const adminMailOptions = {
          from: `"Mindgates Research" <${smtpUser}>`,
          to: adminEmail,
          subject: `New Paper Submission: ${paperTitle}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4f46e5;">New Paper Submitted</h2>
              <p>A new paper has been submitted to the Mindgates Conference Forum.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Author Name</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Affiliation</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${affiliation || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Conference</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${conferenceTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Paper Title</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${paperTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Abstract</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${abstract || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Paper File</td>
                  <td style="padding: 8px; border: 1px solid #ddd;"><a href="${process.env.NEXT_PUBLIC_APP_URL || ''}${paperUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline;">Download/View Paper</a></td>
                </tr>
              </table>
            </div>
          `,
        }

        // Confirmation email to the author
        const authorMailOptions = {
          from: `"Mindgates Research" <${smtpUser}>`,
          to: email,
          subject: `Submission Confirmation: ${paperTitle}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4f46e5;">Paper Submission Received</h2>
              <p>Dear ${fullName},</p>
              <p>Thank you for submitting your paper <strong>"${paperTitle}"</strong> to the <strong>${conferenceTitle}</strong>.</p>
              <p>Our editorial team will review your submission and get back to you shortly.</p>
              <br />
              <p>Best Regards,</p>
              <p><strong>Mindgates Research Team</strong><br/>Email: ${adminEmail}</p>
            </div>
          `,
        }

        await transporter.sendMail(adminMailOptions)
        await transporter.sendMail(authorMailOptions)
        emailSent = true
      } catch (err) {
        console.error('SMTP Email Error:', err)
        smtpError = err instanceof Error ? err.message : String(err)
      }
    } else {
      console.warn('SMTP_PASS is not configured. Simulating email sending.')
      console.log(`--- Mock SMTP Notification (${adminEmail}) ---`)
      console.log('Submission Details:', newSubmission)
    }

    return NextResponse.json({
      success: true,
      message: 'Paper submitted successfully',
      data: newSubmission,
      emailSent,
      smtpError,
    })
  } catch (error) {
    console.error('Submission Endpoint Error:', error)
    const errMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: errMsg },
      { status: 500 }
    )
  }
}
