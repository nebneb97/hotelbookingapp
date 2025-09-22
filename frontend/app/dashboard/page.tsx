import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getUserReservations = async (userEmail: string) => {
  const res = await fetch(
    `http://127.0.0.1:1337/api/reservations?filters[email][$eq]=${userEmail}&populate=*`,
    {
      next: {
        revalidate: 0,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return await res.json();
};

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    return (
      <section className="min-h-[80vh]">
        <div className="container mx-auto py-8 h-full">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Please log in to view your bookings.
            </p>
            <Link href="/api/auth/login">
              <Button className="mt-4">Login</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const userReservations = await getUserReservations(user.email);
  console.log(userReservations);

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8 h-full">
        <h3 className="text-2xl font-bold mb-12 border-b pb-4 text-center lg:text-left">
          My Bookings
        </h3>
        <div className="space-y-6">
          {userReservations.data.length < 1 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  No Reservations Found
                </h4>
                <p className="text-gray-600 mb-6">
                  You don&apos;t have any reservations yet. Start by booking a room!
                </p>
                <Link href="/">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Browse Rooms
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userReservations.data
                .filter((reservation: any) => reservation?.attributes)
                .map((reservation: any) => {
                  const checkInDate = new Date(reservation.attributes.checkIn);
                  const checkOutDate = new Date(
                    reservation.attributes.checkOut
                  );
                  const room = reservation.attributes.room?.data;

                  return (
                    <div
                      key={reservation.id}
                      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Room Image */}
                      {room?.attributes?.image?.data?.[0] && (
                        <div className="h-48 bg-gray-200">
                          <img
                            src={`http://127.0.0.1:1337${room.attributes.image.data[0].attributes.url}`}
                            alt={room.attributes.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Room Name */}
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                          {room?.attributes?.name || "Room"}
                        </h4>

                        {/* Guest Info */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Guest:</span>{" "}
                            {reservation.attributes.firstname}{" "}
                            {reservation.attributes.lastname}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {reservation.attributes.email}
                          </p>
                        </div>

                        {/* Dates */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Check-in:
                            </span>
                            <span className="text-sm text-gray-900">
                              {format(checkInDate, "PPP")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Check-out:
                            </span>
                            <span className="text-sm text-gray-900">
                              {format(checkOutDate, "PPP")}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              new Date() < checkInDate
                                ? "bg-blue-100 text-blue-800"
                                : new Date() >= checkInDate &&
                                  new Date() <= checkOutDate
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {new Date() < checkInDate
                              ? "Upcoming"
                              : new Date() >= checkInDate &&
                                new Date() <= checkOutDate
                              ? "Active"
                              : "Completed"}
                          </span>

                          {room && (
                            <Link href={`/rooms/${room.id}`}>
                              <Button variant="outline" size="sm">
                                View Room
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
