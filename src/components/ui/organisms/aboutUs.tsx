// components/AboutUs.tsx
const AboutUs = () => {
  return (
    <section id="about-us" className="py-16 bg-teal-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-8">Sobre Nosotros</h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Somos una clínica veterinaria comprometida con el bienestar de tus mascotas, con años de experiencia en atención médica y estética animal.
        </p>
        <div className="flex justify-center items-center gap-12">
          <div className="team-member text-center">
            <img src="/images/team-member.jpg" alt="Dr. Juan Pérez" className="w-32 h-32 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-teal-700">Dr. Juan Pérez</h3>
            <p className="text-gray-600">Veterinario General</p>
          </div>
          <div className="team-member text-center">
            <img src="/images/team-member.jpg" alt="Dr. Ana García" className="w-32 h-32 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-teal-700">Dr. Ana García</h3>
            <p className="text-gray-600">Especialista en Cirugía</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
