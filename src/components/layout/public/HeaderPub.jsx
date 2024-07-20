import { NavPub } from "./NavPub"
import foto from '../../../assets/img/foto.jpg';

// Define y exporta el componente HeaderPub.
export const HeaderPub = () => {
  return (
    // Define el encabezado con una clase específica para la barra de navegación.
    <header className="layout__navbar">
      {/* Contenedor para la imagen del usuario */}
      <div className="post__image-user cent-1">
        <img src={foto} alt="User" className="post__user-image" />
      </div>
      {/* Contenedor para el título */}
      <div className="titli">
        <a href="#" className="">
          <span className="yellow">COLOMBIA</span><br />
          <span className="blue">EN LA </span>
          <span className="red">MESA</span>
        </a>
      </div>
      {/* Incluye el componente NavPub */}
      <NavPub />
    </header>
  )
}