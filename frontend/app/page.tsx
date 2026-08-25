import Hero from "@/components/Hero";
import Rooms from "@/components/Rooms";

export const dynamic = "force-dynamic";

const Home = () => {
  return <main>
    <Hero />
    <Rooms />
  </main>
}

export default Home;