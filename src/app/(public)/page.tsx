import Contact from "@/src/components/ui/organisms/contact";
import Header from "@/src/components/ui/organisms/header";
import AboutUs from "@/src/components/ui/organisms/about";
import Services from "@/src/components/ui/organisms/services";
import Hero from "@/src/components/ui/organisms/hero";
import Testimonials from "@/src/components/ui/organisms/testimonial";


export default function Home() {
  return (
    <>
      <Header/>
      <Hero/>
      <AboutUs/>
      <Services/>
      <Testimonials/>      
      <Contact/>
    </>
  );
}