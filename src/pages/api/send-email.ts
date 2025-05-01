import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, content } = req.body;

    if (!email || !content) {
      return res.status(400).json({ message: 'Email and content are required' });
    }

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!, // Verified sender email
      subject: 'Your Website Analysis and Campaign Recommendations',
      text: content,
      html: content.replace(/\n/g, '<br>'), // Convert newlines to HTML breaks
    };

    await sgMail.send(msg);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
} 