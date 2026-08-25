// module.exports = (config, { strapi }) => {
//   return async (ctx, next) => {
//     if (ctx.request.method === 'POST' || ctx.request.method === 'PUT') {
//       const { checkIn, checkOut, email, firstname, lastname, room } = ctx.request.body.data;

//       // Validation 1: Required fields
//       if (!checkIn || !checkOut || !email || !firstname || !lastname || !room) {
//         return ctx.badRequest('All fields are required');
//       }

//       // Validation 2: Email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return ctx.badRequest('Invalid email format');
//       }

//       // Validation 3: Date validation
//       const checkInDate = new Date(checkIn);
//       const checkOutDate = new Date(checkOut);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       if (checkInDate < today) {
//         return ctx.badRequest('Check-in date cannot be in the past');
//       }

//       if (checkOutDate <= checkInDate) {
//         return ctx.badRequest('Check-out date must be after check-in date');
//       }

//       // Validation 4: Check for conflicts (same room, overlapping dates)
//       const existingReservations = await strapi.entityService.findMany(
//         'api::reservation.reservation',
//         {
//           filters: {
//             room: room,
//           },
//           populate: ['room'],
//         }
//       );

//       const hasConflict = existingReservations.some((reservation) => {
//         const existingCheckIn = new Date(reservation.checkIn).setHours(0, 0, 0, 0);
//         const existingCheckOut = new Date(reservation.checkOut).setHours(0, 0, 0, 0);
//         const newCheckIn = checkInDate.setHours(0, 0, 0, 0);
//         const newCheckOut = checkOutDate.setHours(0, 0, 0, 0);

//         return (
//           (newCheckIn >= existingCheckIn && newCheckIn < existingCheckOut) ||
//           (newCheckOut > existingCheckIn && newCheckOut <= existingCheckOut) ||
//           (existingCheckIn > newCheckIn && existingCheckIn < newCheckOut)
//         );
//       });

//       if (hasConflict) {
//         return ctx.badRequest('Room is already booked for selected dates');
//       }
//     }

//     await next();
//   };
// };