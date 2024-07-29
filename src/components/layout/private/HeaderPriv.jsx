// Importa el componente NavPriv desde el archivo correspondiente
import { NavPriv } from "./NavPriv";

// Importa una imagen desde la ruta especificada
import foto from '../../../assets/img/foto.jpg'


// Define y exporta el componente HeaderPriv
export const HeaderPriv = () => {
  return (
    // Define el elemento header con la clase CSS "layout__navbar"
    <header className="layout__navbar">
      
      {/* Contenedor para la imagen del usuario */}
      <div className="post__image-user cent-1 ">
        {/* Renderiza la imagen del usuario con la clase CSS "post__user-image" */}
        <img src={foto} alt="User" className="post__user-image" />
      </div>
      
      {/* Contenedor para el título */}
      <div className="titli">
        {/* Enlace con el título */}
        <a href="#" className="">
          {/* Span para la palabra "COLOMBIA" con la clase CSS "yellow" */}
          <span className="yellow">COLOMBIA</span><br />
          {/* Span para la palabra "EN LA" con la clase CSS "blue" */}
          <span className="blue">EN LA </span>
          {/* Span para la palabra "MESA" con la clase CSS "red" */}
          <span className="red">MESA</span>
        </a>
      </div>
      
      {/* Renderiza el componente de navegación privada */}
      <NavPriv />
    </header>
  )
}