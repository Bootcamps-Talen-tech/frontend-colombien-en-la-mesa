import { NavLink } from 'react-router-dom';
import avatar from '../../../assets/img/foto.jpg';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { TbBowlSpoonFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { BsBoxArrowInLeft } from "react-icons/bs";

// Define y exporta el componente NavPriv.
export const NavPriv = () => {

  // Usamos el hook useAuth para tener disponible el objeto del usuario autenticado.
  const { auth } = useAuth();

  return (
    // Define el contenedor del navbar con la clase CSS "navbar__container-lists".
    <nav className="navbar__container-lists">

      {/* Lista de enlaces principales en el menú */}
      <ul className="container-lists__menu-list list-center">
        {/* Elemento de la lista para "Quienes somos" */}
        <li className="menu-list__item li-fec">
          <NavLink to="/colreceta/aboutus" className="text-list">
            <i><FaUsers /></i> {/* Ícono de usuarios */}
            <span className="menu-list__title">Quines somos</span>
          </NavLink>
        </li>

        {/* Elemento de la lista para "Receta" */}
        <li className="menu-list__item li-fec">
          <NavLink to="/colreceta" className="text-list">
            <i><TbBowlSpoonFilled /></i> {/* Ícono de cuchara */}
            <span className="menu-list__title">Receta</span>
          </NavLink>
        </li>

        {/* Elemento de la lista para "Usuarios" */}
        <li className="menu-list__item li-fec">
          <NavLink to="/colreceta/users" className="text-list">
            <i><FaUser /></i> {/* Ícono de usuario */}
            <span className="menu-list__title">Usuarios</span>
          </NavLink>
        </li>
      </ul>

      {/* Lista de elementos del menú en la esquina derecha */}
      <ul className="container-lists__menu-list list-end">
        {/* Elemento de la lista para la imagen de avatar */}
        <li>
          <div className="img-avatar-nav">
            {/* Muestra la imagen del avatar del usuario si no es la predeterminada */}
            {auth.image !== "default.png" && <img src={Global.url + "user/image/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
            {/* Muestra la imagen de avatar predeterminada si el usuario no tiene una imagen personalizada */}
            {auth.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
          </div>
        </li>

        {/* Elemento de la lista para el nombre del usuario */}
        <li className="list-end__item li-fec">
          <NavLink to="/colreceta/profile" className="text-list">
            <span>@{auth.name}</span>
          </NavLink>
        </li>

        {/* Elemento de la lista para cerrar sesión */}
        <li className="list-end__item li-fec">
          <NavLink to="/colreceta/logout" className="text-list">
            <span className="list-end__name">Cerrar sesión</span>
            <i className="fa-solid fa-arrow-right-from-bracket"><BsBoxArrowInLeft /></i> {/* Ícono de cerrar sesión */}
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}