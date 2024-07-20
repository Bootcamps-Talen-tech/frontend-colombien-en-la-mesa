import { NavLink } from "react-router-dom"

// Define y exporta el componente NavPub.
export const NavPub = () => {
  return (
    // Define la barra de navegación con una clase específica para la contenedora de listas.
    <nav className="navbar__container-lists">

      {/* Lista de enlaces de navegación */}
      <ul className="container-lists__menu-list">
        {/* Elemento de lista para el enlace de inicio de sesión */}
        <li className="menu-list__item">
          <NavLink to="/login" className="menu-list__link">
            <i className="fa-solid fa-user"></i>
            <span className="menu-list__title">Inicia sesión</span>
          </NavLink>
        </li>

        {/* Elemento de lista para el enlace de registro */}
        <li className="menu-list__item">
          <NavLink to="/registro" className="menu-list__link">
            <i className="fa-solid fa-users"></i>
            <span className="menu-list__title">Regístrate</span>
          </NavLink>
        </li>
      </ul>

    </nav>
  )
}