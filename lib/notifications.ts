import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send email
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@microcarehospitals.com',
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Send SMS
export async function sendSMS(to: string, message: string) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return result;
  } catch (error) {
    console.error('SMS error:', error);
    throw error;
  }
}

// Send appointment confirmation email
export async function sendAppointmentConfirmationEmail(
  email: string,
  patientName: string,
  doctorName: string,
  appointmentDate: string,
  timeSlot: string,
  appointmentNo: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Appointment Confirmation</h2>
      <p>Hi ${patientName},</p>
      <p>Your appointment has been confirmed. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>Appointment No:</strong> ${appointmentNo}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
      </div>
      <p>Please arrive 10 minutes before your scheduled time.</p>
      <p>Best regards,<br/>Micro Care Hospitals Team</p>
    </div>
  `;

  return sendEmail(email, 'Appointment Confirmation - Micro Care Hospitals', html);
}

// Send appointment confirmation SMS
export async function sendAppointmentConfirmationSMS(
  phone: string,
  patientName: string,
  doctorName: string,
  appointmentDate: string,
  timeSlot: string
) {
  const message = `Hi ${patientName}, your appointment with Dr. ${doctorName} is confirmed for ${appointmentDate} at ${timeSlot}. Arrive 10 mins early. - Micro Care Hospitals`;
  return sendSMS(phone, message);
}
