import Image from "next/image";
import { TbArrowsMaximize, TbUsers } from "react-icons/tb";

// Fetch room data by documentId (NOT numeric id)
const getRoomData = async (params: any) => {
  if (typeof params?.then === "function") params = await params;

  // Debug: Log the params to ensure the correct documentId is being passed
  console.log("RoomDetails params:", params);

  // Fetch by documentId, not numeric id
  const res = await fetch(
    `http://127.0.0.1:1337/api/rooms?filters[documentId][$eq]=${params.id}&populate=*`,
    { next: { revalidate: 0 } }
  );
  const json = await res.json();

  // Debug: Log the API response to inspect its shape
  console.log("RoomDetails API response:", JSON.stringify(json, null, 2));

  return json;
};

const RoomDetails = async ({ params }: { params: any }) => {
  // Defensive: Await params if it's a Promise
  if (typeof params?.then === "function") params = await params;

  const roomRes = await getRoomData(params);

  // Handle the response structure - your API returns array format for filtering
  if (!roomRes.data || roomRes.data.length === 0) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/assets/Code Kid.jpg"
            alt="Room not found"
            width={300}
            height={200}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Room not found</h2>
          <p className="text-gray-600">
            Sorry, the room you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  // FIXED: Your filtering API returns array format { data: [room] }, not single object
  const room = roomRes.data[0];

  // Debug: Let's see what we're actually getting
  console.log("🏠 Room object structure:", room);
  console.log("🏠 Room title:", room?.title);
  console.log("🏠 Room description:", room?.description);

  // FIXED: Handle the image structure correctly
  let imgURL = "/assets/Code Kid.jpg";
  if (room.image?.url) {
    imgURL = `http://127.0.0.1:1337${room.image.url}`;
  }

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:gap-10 h-full">
          {/* Room Image */}
          <div className="flex-1">
            <div className="relative h-[360px] lg:h-[420px] mb-8">
              <Image
                src={imgURL}
                fill
                alt=''
                // width={700}
                // height={500}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col flex-1 mb-8">
              {/* Room Title and Price*/}
              <div className="flex justify-between items-end mb-4 gap-2">
                <h1 className="text-3xl font-bold mb-0">
                  {room.title || "Untitled Room"}
                </h1>
                <p className="text-orange-600 font-medium text-3xl">
                  {room.price ? (
                    <>
                      RM {room.price}
                      <span className="text-black text-xl">/night</span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              {/* Room Info*/}
              <div className="flex items-center gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-orange-600 text-2xl">
                    <TbArrowsMaximize />
                  </div>
                  <p>{room.size ? `${room.size} sq ft` : "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-orange-600 text-2xl">
                    <TbUsers />
                  </div>
                  <p>{room.capacity || "N/A"} Guests</p>
                </div>
              </div>

              <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                {room.description || "No description available."}
              </p>
            </div>
          </div>
          {/* Reservation Section */}
          <div className="w-full lg:max-w-[360px] h-max bg-green-300 flex items-center justify-center">
            <span>Reservation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
