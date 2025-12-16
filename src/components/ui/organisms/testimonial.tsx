const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-teal-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-8">Testimonios</h2>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="testimonial-item max-w-sm bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 mb-4">“El mejor cuidado para mi perro, ¡siempre tan amables y atentos!”</p>
            <p className="font-semibold text-teal-700">Juan Pérez</p>
          </div>
          <div className="testimonial-item max-w-sm bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 mb-4">“Excelente atención, mi gato siempre está en buenas manos.”</p>
            <p className="font-semibold text-teal-700">Ana García</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;