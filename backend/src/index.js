'use strict';

const HOTELS = [
  {
    name: 'The Pinnacle KL',
    description:
      'A world-class luxury hotel perched above the Kuala Lumpur skyline, offering unparalleled views, Michelin-starred dining, and a rooftop infinity pool. The Pinnacle defines five-star hospitality in the heart of the city.',
    city: 'Kuala Lumpur',
    address: '1 Jalan Pinang, KLCC, 50450 Kuala Lumpur',
    stars: 5,
    amenities: ['Rooftop Pool', 'Spa & Wellness', 'Fine Dining', 'Concierge', 'Valet Parking', 'Fitness Centre', 'Free WiFi', 'Airport Shuttle'],
    rooms: [
      { title: 'Deluxe King Room', type: 'double', price: 580, capacity: 2, size: '42', description: 'Spacious king room with floor-to-ceiling windows overlooking the KLCC skyline. Features a marble bathroom with soaking tub.' },
      { title: 'Executive Suite', type: 'extended', price: 1200, capacity: 2, size: '85', description: 'A sprawling suite with a separate living area, butler service, and panoramic views of the Petronas Towers.' },
      { title: 'Premier Twin Room', type: 'single', price: 480, capacity: 2, size: '38', description: 'Elegant twin room with premium bedding, smart TV, and complimentary minibar.' },
      { title: 'Pinnacle Penthouse', type: 'extended', price: 3500, capacity: 4, size: '220', description: 'The ultimate luxury experience — a private two-floor penthouse with a personal plunge pool, private dining room, and 24-hour butler.' },
    ],
  },
  {
    name: 'Bukit Bintang Suites',
    description:
      "A contemporary boutique hotel in the beating heart of KL's entertainment district. Steps away from Pavilion Mall and the best street food in Malaysia, Bukit Bintang Suites blends modern design with local culture.",
    city: 'Kuala Lumpur',
    address: '88 Jalan Bukit Bintang, 55100 Kuala Lumpur',
    stars: 4,
    amenities: ['Rooftop Bar', 'Outdoor Pool', 'Free WiFi', 'Restaurant', 'Fitness Centre', 'Concierge'],
    rooms: [
      { title: 'Urban Studio', type: 'single', price: 220, capacity: 1, size: '26', description: 'A smart, compact studio designed for the modern traveller. High-speed WiFi, ergonomic workspace, and premium coffee machine.' },
      { title: 'City View Double', type: 'double', price: 310, capacity: 2, size: '34', description: 'Stylish double room with floor-to-ceiling windows framing the vibrant Bukit Bintang streetscape.' },
      { title: 'Bintang Suite', type: 'extended', price: 620, capacity: 3, size: '68', description: 'A chic suite with a separate lounge, kitchenette, and private balcony overlooking the city lights.' },
    ],
  },
  {
    name: 'The Garden Lodge',
    description:
      'A tranquil retreat nestled in lush tropical gardens just minutes from the city centre. The Garden Lodge is perfect for families and travellers seeking peace, comfort, and genuine Malaysian warmth.',
    city: 'Kuala Lumpur',
    address: '12 Jalan Ampang Hilir, 68000 Ampang, Kuala Lumpur',
    stars: 3,
    amenities: ['Garden Pool', 'Family Restaurant', 'Free WiFi', 'Free Parking', 'Kids Play Area', 'Laundry Service'],
    rooms: [
      { title: 'Garden View Single', type: 'single', price: 120, capacity: 1, size: '22', description: 'A comfortable single room with a private balcony overlooking our award-winning tropical garden.' },
      { title: 'Family Room', type: 'double', price: 195, capacity: 4, size: '45', description: 'Spacious family room with two queen beds, a kitchenette, and direct garden access — ideal for families.' },
      { title: 'Garden Cottage', type: 'extended', price: 350, capacity: 4, size: '75', description: 'A standalone cottage surrounded by tropical gardens, with a private terrace, outdoor shower, and full kitchen.' },
    ],
  },
  {
    name: 'Skyline Capsule Hotel',
    description:
      "KL's most innovative budget stay. Skyline Capsule offers premium pods with smart technology, rooftop co-working space, and a social atmosphere that makes it the top choice for solo travellers and backpackers.",
    city: 'Kuala Lumpur',
    address: '45 Jalan Masjid India, 50100 Kuala Lumpur',
    stars: 2,
    amenities: ['Rooftop Lounge', 'Co-working Space', 'Free WiFi', 'Lockers', 'Common Kitchen', '24-Hour Reception'],
    rooms: [
      { title: 'Standard Pod', type: 'single', price: 65, capacity: 1, size: '4', description: 'A sleek private pod with a smart lock, integrated lighting, USB charging, and a 32-inch privacy screen.' },
      { title: 'Premium Pod', type: 'single', price: 95, capacity: 1, size: '6', description: 'An upgraded pod with extra storage, a mini desk, noise-cancelling curtain, and complimentary breakfast.' },
      { title: 'Double Pod', type: 'double', price: 140, capacity: 2, size: '9', description: 'A spacious pod designed for couples, with a double mattress, shared vanity, and panoramic city-view window.' },
    ],
  },
  {
    name: 'Merdeka Heritage Hotel',
    description:
      'A lovingly restored colonial mansion steps from Merdeka Square. Merdeka Heritage Hotel celebrates Malaysian history through spaces that blend Peranakan art, local craftsmanship, and modern comfort.',
    city: 'Kuala Lumpur',
    address: '3 Jalan Raja, 50050 Kuala Lumpur',
    stars: 4,
    amenities: ['Heritage Pool', 'Colonial Bar', 'Free WiFi', 'Cultural Tours', 'Spa', 'Bicycle Rental'],
    rooms: [
      { title: 'Colonial Double', type: 'double', price: 280, capacity: 2, size: '36', description: 'A beautifully appointed room with Peranakan tile floors, antique furnishings, and a four-poster bed draped in local batik.' },
      { title: 'Straits Suite', type: 'extended', price: 520, capacity: 2, size: '65', description: 'An opulent suite inspired by the Straits Settlements era, with a clawfoot bathtub, private verandah, and curated local art.' },
      { title: 'Merdeka Single', type: 'single', price: 160, capacity: 1, size: '24', description: 'A charming single room with colonial-era details, a writing desk, and views of the historic Merdeka Square.' },
    ],
  },
];

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    const count = await strapi.documents('api::hotel.hotel').count({});
    if (count > 0) return;

    strapi.log.info('Seeding hotels and rooms...');

    for (const { rooms, ...hotelData } of HOTELS) {
      const hotel = await strapi.documents('api::hotel.hotel').create({
        data: hotelData,
      });
      await strapi.documents('api::hotel.hotel').publish({ documentId: hotel.documentId });

      for (const room of rooms) {
        const createdRoom = await strapi.documents('api::room.room').create({
          data: { ...room, hotel: hotel.documentId },
        });
        await strapi.documents('api::room.room').publish({ documentId: createdRoom.documentId });
      }
    }

    strapi.log.info('Seed complete: 5 hotels, 16 rooms created.');
  },
};
