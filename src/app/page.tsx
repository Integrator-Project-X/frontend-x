import Link from "next/link";
// import Header from '../components/header';
import Hero from '../components/ui/organisms/hero';
import Services from '../components/ui/organisms/services';
import AboutUs from '../components/ui/organisms/aboutUs';
import Testimonials from '../components/ui/organisms/testimonials';
import Contact from '../components/ui/organisms/contact';
import { Clock, Siren, Bell, Calendar, Heart, Search, AlertTriangle, User, MapPin } from "lucide-react";


export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <Hero />
      <Services />
      <AboutUs />
      <Testimonials />
      <Contact />
      {/* <Footer /> */}
    </>
  );
}
