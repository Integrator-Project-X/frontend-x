const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-8">Contáctanos</h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">¿Tienes preguntas? ¡Contáctanos ahora!</p>
        <form className="max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full p-4 mb-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="email"
            placeholder="Tu email"
            className="w-full p-4 mb-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <textarea
            placeholder="Tu mensaje"
            className="w-full p-4 mb-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="w-full bg-teal-800 text-white py-3 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;