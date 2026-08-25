'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reservation.reservation', ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body?.data || {};
    const { checkIn, checkOut, email, firstname, lastname, room } = body;

    if (!checkIn || !checkOut || !email || !firstname || !lastname || !room) {
      return ctx.badRequest('All fields are required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ctx.badRequest('Invalid email format');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return ctx.badRequest('Invalid date format');
    }
    if (checkInDate < today) {
      return ctx.badRequest('Check-in date cannot be in the past');
    }
    if (checkOutDate <= checkInDate) {
      return ctx.badRequest('Check-out date must be after check-in date');
    }

    const existing = await strapi.entityService.findMany('api::reservation.reservation', {
      filters: { room: room },
    });

    const newIn = checkInDate.getTime();
    const newOut = checkOutDate.getTime();
    const hasConflict = (existing || []).some((r) => {
      const eIn = new Date(r.checkIn).getTime();
      const eOut = new Date(r.checkOut).getTime();
      return (newIn >= eIn && newIn < eOut) || (newOut > eIn && newOut <= eOut) || (eIn >= newIn && eIn < newOut);
    });

    if (hasConflict) {
      return ctx.badRequest('Room is already booked for the selected dates');
    }

    const response = await super.create(ctx);

    strapi
      .service('api::reservation.email')
      .sendBookingConfirmation(response.data)
      .catch((err) => strapi.log.error('Booking confirmation email failed: ' + err.message));

    return response;
  },

  async update(ctx) {
    const userEmail = ctx.request.header['email'];
    if (!userEmail) {
      return ctx.unauthorized('Authentication required');
    }

    const reservation = await strapi.documents('api::reservation.reservation').findOne({
      documentId: ctx.params.id,
    });

    if (!reservation) {
      return ctx.notFound('Reservation not found');
    }

    if (reservation.email !== userEmail) {
      return ctx.unauthorized('You do not have permission to modify this reservation');
    }

    const response = await super.update(ctx);

    strapi
      .service('api::reservation.email')
      .sendUpdateConfirmation(response.data)
      .catch((err) => strapi.log.error('Update confirmation email failed: ' + err.message));

    return response;
  },

  async delete(ctx) {
    const userEmail = ctx.request.header['email'];
    if (!userEmail) {
      return ctx.unauthorized('Authentication required');
    }

    const reservation = await strapi.documents('api::reservation.reservation').findOne({
      documentId: ctx.params.id,
      populate: ['room'],
    });

    if (!reservation) {
      return ctx.notFound('Reservation not found');
    }

    if (reservation.email !== userEmail) {
      return ctx.unauthorized('You do not have permission to cancel this reservation');
    }

    const response = await super.delete(ctx);

    strapi
      .service('api::reservation.email')
      .sendCancellationEmail(reservation, reservation.room)
      .catch((err) => strapi.log.error('Cancellation email failed: ' + err.message));

    return response;
  },
}));
