'use strict';

const sgMail = require('@sendgrid/mail');

module.exports = () => ({
  _getFrom() {
    return process.env.SENDGRID_FROM_EMAIL || 'bookings@thebooker.com';
  },

  _init() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      return true;
    }
    return false;
  },

  async sendBookingConfirmation(reservation) {
    if (!this._init()) return;

    const nights = Math.ceil(
      (new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24)
    );

    await sgMail.send({
      to: reservation.email,
      from: this._getFrom(),
      subject: 'Booking Confirmed - The Booker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ea580c; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
          </div>
          <div style="padding: 24px;">
            <p>Dear ${reservation.firstname} ${reservation.lastname},</p>
            <p>Your reservation has been confirmed. Here are your booking details:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Booking Reference:</strong> #${reservation.documentId}</p>
              <p style="margin: 8px 0;"><strong>Check-in:</strong> ${new Date(reservation.checkIn).toLocaleDateString('en-MY')}</p>
              <p style="margin: 8px 0;"><strong>Check-out:</strong> ${new Date(reservation.checkOut).toLocaleDateString('en-MY')}</p>
              <p style="margin: 8px 0;"><strong>Duration:</strong> ${nights} night${nights !== 1 ? 's' : ''}</p>
            </div>
            <p>You can view or manage your booking from your dashboard at any time.</p>
            <p>We look forward to welcoming you!</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    });
  },

  async sendCancellationEmail(reservation, room) {
    if (!this._init()) return;

    await sgMail.send({
      to: reservation.email,
      from: this._getFrom(),
      subject: 'Booking Cancelled - The Booker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ef4444; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Cancelled</h1>
          </div>
          <div style="padding: 24px;">
            <p>Dear ${reservation.firstname} ${reservation.lastname},</p>
            <p>Your reservation has been cancelled.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${room ? `<p style="margin: 8px 0;"><strong>Room:</strong> ${room.title}</p>` : ''}
              <p style="margin: 8px 0;"><strong>Booking Reference:</strong> #${reservation.documentId}</p>
              <p style="margin: 8px 0;"><strong>Original Check-in:</strong> ${new Date(reservation.checkIn).toLocaleDateString('en-MY')}</p>
              <p style="margin: 8px 0;"><strong>Original Check-out:</strong> ${new Date(reservation.checkOut).toLocaleDateString('en-MY')}</p>
            </div>
            <p>If this was a mistake, please contact us or make a new booking.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    });
  },

  async sendUpdateConfirmation(reservation) {
    if (!this._init()) return;

    const nights = Math.ceil(
      (new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24)
    );

    await sgMail.send({
      to: reservation.email,
      from: this._getFrom(),
      subject: 'Booking Updated - The Booker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Updated</h1>
          </div>
          <div style="padding: 24px;">
            <p>Dear ${reservation.firstname} ${reservation.lastname},</p>
            <p>Your reservation dates have been updated successfully.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Booking Reference:</strong> #${reservation.documentId}</p>
              <p style="margin: 8px 0;"><strong>New Check-in:</strong> ${new Date(reservation.checkIn).toLocaleDateString('en-MY')}</p>
              <p style="margin: 8px 0;"><strong>New Check-out:</strong> ${new Date(reservation.checkOut).toLocaleDateString('en-MY')}</p>
              <p style="margin: 8px 0;"><strong>Duration:</strong> ${nights} night${nights !== 1 ? 's' : ''}</p>
            </div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    });
  },
});
