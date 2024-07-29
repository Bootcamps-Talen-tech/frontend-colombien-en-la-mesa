import { Global } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import foto from '../../../assets/img/foto.jpg';
import { useState } from "react";
import '../../../assets/css/user/register.css'

export const Register = () => {

  // Usamos el hook personalizado useForm para cargar los datos del formulario
  const { form, changed } = useForm({});
  // Estado para mostrar resultado del registro del user
  const [saved, setSaved] = useState("not sended");
  // Hook para redirigir
  const navigate = useNavigate();

  // Guardar un usuario en la BD
  const saveUser = async (e) => {
    // Prevenir que se actualice la pantalla
    e.preventDefault();

    // Obtener los datos del formulario
    let newUser = form;

    // Petición a la API del Backend para guardar usuario en la BD
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    // Verificar si el estado de la respuesta del backend es "created" seteamos la variable saved con "saved" y si no, le asignamos "error", esto es para mostrar por pantalla el resultado del registro del usuario
    if (data.status == "created") {
      setSaved("saved");

      // Mostrar modal de éxito
      Swal.fire({
        title: '¡Usuario registrado correctamente!',
        icon: 'success',
        confirmButtonText: 'Continuar',
      }).then(() => {
        // Redirigir después de cerrar el modal
        navigate('/login');
      });

    } else {
      setSaved("error");

      // Mostrar modal de error
      Swal.fire({
        title: '¡El usuario no se ha registrado!',
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    }
  };


  return (
    <div className='content-form '>
      <form className="form" onSubmit={saveUser}>
        {/* Respuestas de usuario registrado*/}
        {saved == "saved" ? (
          <strong className="alert alert-success">¡Usuario registrado correctamente!</strong>
        ) : ''}
        {saved == "error" ? (
          <strong className="alert alert-danger">¡El usuario no se ha registrado!</strong>
        ) : ''}

        <div className="form-outline mb-4">
          <div className="d-flex justify-content-center mb-4">
            <img src={foto} className="img-fluid rounded-circle img-thumbnail" alt="Sample image" style={{ width: '150px', height: '150px' }} />
          </div>
          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text-p">Inicio de sesión</p>
        </div>

        <div className="form-outline mb-4">
          <label className="form-label text-white fs-5" htmlFor="name">Nombre</label>
          <input type="text" name="name" className="form-control form-control-lg" required onChange={changed} />
        </div>

        <div className="form-outline mb-4">
          <label className="form-label text-white fs-5" htmlFor="email">Correo Electronico</label>
          <input type="email" name="email" className="form-control form-control-lg" required onChange={changed} />
        </div>

        <div className="form-outline mb-4">
          <label className="form-label text-white fs-5" htmlFor="password">Contraseña</label>
          <input type="password" name="password" className="form-control form-control-lg" required onChange={changed} />
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success btn-block btn-lg gradient-custom-4 ">Register</button>
        </div>

        <p className="text-center  mt-5 mb-0  text-white">Have already an account? <a href="#!" className="fw-bold text-body"><u>Login here</u></a></p>
      </form>
    </div>
  );
};

