import React from 'react';
import '../../../assets/css/aboutUs.css'; // Asegúrate de tener un archivo CSS para estilizar el componente

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>¿Quiénes Somos?</h1>
      <p><strong>¡Bienvenidos a <span className="brand-name">Recetas Colombianas</span>!</strong></p>
      <p>
        Somos un equipo apasionado por la rica y variada cocina de Colombia. Nuestra misión es preservar y compartir las recetas tradicionales que forman parte de nuestra herencia cultural. En un país con una increíble diversidad culinaria, desde los arepas de la región Caribe hasta los ajiacos de los Andes, entendemos la importancia de conservar y celebrar cada receta que ha sido transmitida de generación en generación.
      </p>
      <p>
        <strong><span className="brand-name">Recetas Colombianas</span></strong> nació del deseo de ofrecer un repositorio accesible para todos, donde se pueda explorar, disfrutar y aprender sobre nuestros platos típicos. Creemos que la comida es un puente entre el pasado y el presente, y queremos asegurarnos de que estos valiosos conocimientos culinarios permanezcan vivos y disponibles para todos los amantes de la cocina.
      </p>
      <h2>¿Qué Hacemos?</h2>
      <ul>
        <li><strong>Conservamos Tradiciones:</strong> Nuestra plataforma ofrece una base de datos completa de recetas colombianas, desde platos emblemáticos hasta recetas menos conocidas. Cada receta está acompañada de instrucciones detalladas, ingredientes y fotos para que puedas recrear fácilmente estos platos en tu propia cocina.</li>
        <li><strong>Facilitamos el Acceso:</strong> Hemos creado una aplicación web intuitiva y accesible desde cualquier dispositivo. Esto permite que todos, sin importar dónde se encuentren, puedan descubrir y disfrutar de la cocina colombiana.</li>
        <li><strong>Promovemos la Comunidad:</strong> Invitamos a todos los entusiastas de la cocina a compartir sus propias recetas y experiencias. Creemos que la colaboración y el intercambio son esenciales para mantener viva nuestra tradición culinaria.</li>
      </ul>
      <h2>Nuestro Compromiso</h2>
      <p>
        En <span className="brand-name">Recetas Colombianas</span>, nos comprometemos a ofrecer una plataforma que no solo conserva las recetas tradicionales, sino que también respeta la autenticidad y la calidad de cada plato. Nuestro equipo trabaja constantemente para mejorar la experiencia del usuario y asegurar que la información sea precisa y útil.
      </p>
      <h2>¿Por Qué Elegirnos?</h2>
      <p>
        Nuestra dedicación a la preservación cultural y la accesibilidad nos distingue. Queremos ser el recurso definitivo para todos aquellos que deseen explorar y entender la rica gastronomía de Colombia. Únete a nosotros en esta misión y descubre el sabor de nuestras tradiciones.
      </p>
      <p>Gracias por visitar <span className="brand-name">Recetas Colombianas</span>. Estamos emocionados de compartir con ustedes este viaje culinario y de mantener vivas nuestras recetas tradicionales.</p>
    </div>
  );
};

export default AboutUs;