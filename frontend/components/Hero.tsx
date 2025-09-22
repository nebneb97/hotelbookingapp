import { Button } from "./ui/button"

const Hero = () => {
  return (
    <section className="h-[60vh] lg:h-[80vh] bg-hero bg-cover bg-center bg-no-repeat relative">
        <div className="container mx-auto h-full flex justify-center items-center">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl lg:text-7xl font-serif text-white text-center max-w-[800px] mb-10">
                    Experience hospitality at its finest with TheBooker
                </h1>
                <Button size='lg'> Discover More</Button>
            </div>
        </div>
    </section>
  )
}

export default Hero
