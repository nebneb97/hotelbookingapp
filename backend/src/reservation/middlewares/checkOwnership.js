// module.exports = (config, { strapi }) => {
//   return async (ctx, next) => {
//     if (ctx.request.method === 'DELETE' || ctx.request.method === 'PUT') {
//       const reservationId = ctx.params.id;
//       const userEmail = ctx.request.header.email; // You'll need to pass this from frontend

//       // Fetch the reservation
//       const reservation = await strapi.entityService.findOne(
//         'api::reservation.reservation',
//         reservationId
//       );

//       if (!reservation) {
//         return ctx.notFound('Reservation not found');
//       }

//       // Check ownership
//       if (reservation.email !== userEmail) {
//         return ctx.unauthorized('You do not have permission to modify this reservation');
//       }
//     }

//     await next();
//   };
// };