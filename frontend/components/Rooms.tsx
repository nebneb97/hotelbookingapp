import RoomsList from "./RoomList";

const getRooms = async () => {
  // This function can be used to fetch rooms data if needed
  const res = await fetch("http://127.0.0.1:1337/api/rooms?populate=*", {
    next: { revalidate: 0 },
  });

  return await res.json();
};
const Rooms = async () => {
  const rooms = await getRooms();
  console.log(rooms);
  return (
    <section className="py-16 bg-tertiary">
      <div className="container mx-auto px-4">
        <RoomsList rooms={rooms} />
      </div>
    </section>
  );
};

export default Rooms;
