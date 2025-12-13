// components/Hero.tsx
const Hero = () => {
  return (
    <section className="relative w-full h-[50vh] bg-gradient-to-r from-teal-500 to-teal-700 text-white flex flex-col justify-center items-center">
      <div className="text-5xl p-2 sm:text-5xl font-bold mb-4">
        <h1>VetConnect</h1>
      </div>
      <div className="relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Cuidamos a tus mascotas como si fueran parte de nuestra familia
        </h2>
        <p className="text-lg sm:text-xl mb-6">Servicios veterinarios de calidad para tu compañero de vida</p>
        <button className="bg-teal-800 text-white px-8 py-3 rounded-full text-lg hover:bg-teal-600 transition duration-300">
          Agenda tu cita
        </button>
      </div>
    </section>
  );
};

export default Hero;
