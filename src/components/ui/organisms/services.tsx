const Services = () => {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-8">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="service-item">
            <div className="bg-teal-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-teal-700 mb-4">Consulta Veterinaria</h3>
              <p className="text-gray-700">Atención personalizada para tu mascota.</p>
            </div>
          </div>
          <div className="service-item">
            <div className="bg-teal-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-teal-700 mb-4">Vacunación</h3>
              <p className="text-gray-700">Garantiza la salud de tu animal con nuestras vacunas.</p>
            </div>
          </div>
          <div className="service-item">
            <div className="bg-teal-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-teal-700 mb-4">Emergencias</h3>
              <p className="text-gray-700">Atención urgente para tu mascota en todo momento.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;