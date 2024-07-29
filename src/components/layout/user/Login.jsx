
//import { Global } from "../../helpers/Global";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";
import { useState } from "react";
import '../../../assets/css/user/login.css'
import foto from '../../../assets/img/foto.jpg'
import { Link } from "react-router-dom";



export const Login = () => {

  // Estado para obtener los datos desde el formulario
  const { form, changed } = useForm({});

  // Estado para validar si el usuario se identificó correctamente
  const [logged, setLogged] = useState("not_logged");

  // Estado para usar useAuth y setear los valos del usuario autenticado en el Provider automáticamente
  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    // prevenir que se actualice la pantalla
    e.preventDefault();

    // Datos del formulario
    let userToLogin = form;

    // Petición al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if (data.status == "success") {
      // Persistir los datos en el navegador guardando en el localstorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLogged("logged");

      // Setear los datos del usuario en el Auth
      setAuth(data.user);

      // Redirección de 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } else {
      setLogged("error");
    }

  }


  return (
    <div className='content-form '>
      <form className='form-style-login ' onSubmit={loginUser}>
        {logged == "logged" ? (
          <strong className="alert alert-success">¡Usuario identificado correctamente!</strong>
        ) : ''}
        {logged == "error" ? (
          <strong className="alert alert-danger">¡El usuario no se ha identificado!</strong>
        ) : ''}
        <div className="form-outline mb-4">
          <div className="d-flex justify-content-center mb-4">
            <img src={foto} className="img-fluid rounded-circle img-thumbnail" alt="Sample image" style={{ width: '150px', height: '150px' }} />
          </div>
          <p className="text-center h1 fw-bold mb-2 mx-1 mx-md-4 mt-4 text-p">Inicio de sesión</p>
        </div>

        {/* Email input */}
        <div className="form-outline mb-4">
          <label className="form-label text-p" htmlFor="email">Correo</label>
          <input type="email" name="email" className="form-control" placeholder="Correo" required onChange={changed} />
        </div>

        {/* Contraseña input */}
        <div className="form-outline mb-4">
          <label className="form-label text-p" htmlFor="password">Contraseña</label>
          <input type="password" name="password" className="form-control" required onChange={changed} />
        </div>

        {/* enviar button */}
        <button type="submit" className="btn btn-primary btn-block  login-btn">
          Iniciar sesión
        </button>

        {/* Registrarse boton */}
        <div className="text-center text-p">
          <p className="mt-5">¿No es un miembro? <a href="#!"><Link to="/registro">Registrarse</Link></a></p>
          <button type="button" className="btn btn-link btn-floating mx-1"></button>
        </div>
      </form>
    </div>
  );
};