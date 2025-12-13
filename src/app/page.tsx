import Contact from "../components/ui/organisms/contact";
import AboutUs from "../components/ui/organisms/aboutUs";
import Services from "../components/ui/organisms/services";
import Hero from "../components/ui/organisms/hero";
import Testimonials from "../components/ui/organisms/testimonials";



export default function Home() {
  return (
    <>
      <Hero/>
      <AboutUs/>
      <Services/>
      <Testimonials/>      
      <Contact/>
    </>
  );
}
