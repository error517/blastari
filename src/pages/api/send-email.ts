
import type { Request, Response } from 'express';
import emailjs from '@emailjs/browser';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, subject, content } = req.body;

    // For server-side EmailJS, you need to use a different approach
    // This is just a placeholder - in a real app, you would use a proper email service
    const result = await emailjs.send(
      process.env.VITE_EMAILJS_SERVICE_ID || '',
      process.env.VITE_EMAILJS_TEMPLATE_ID || '',
      {
        to_email: email,
        subject: subject,
        content: content,
      },
      process.env.VITE_EMAILJS_PUBLIC_KEY || ''
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
