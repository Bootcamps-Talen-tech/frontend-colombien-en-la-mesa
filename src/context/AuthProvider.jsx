import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Global } from "../helpers/Global";


// Crear un contexto de autenticación
const AuthContext = createContext();

// Definir el componente proveedor de contexto AuthProvider
export const AuthProvider = ({ children }) => {

  // Estado local para guardar la información del usuario y verificar si está autenticado
  const [auth, setAuth] = useState({});


  // Estado para configurar la carga de los elementos del perfil y se actualizará al final cuando todo la carga esté lista
  const [loading, setLoading] = useState(true);

  // La primera vez que se ejecute este contexto, se comprueba el token ejecutando authUser
  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    // Obtener datos del usuario identificado del localstorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    { console.log(user) }

    // Comprobar si tengo el token y el user
    if (!token || !user) {
      setLoading(false);
      return false;
    }

    // Transformar los datos a un objeto de javascript
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    // Petición Ajax al backend que compruebe el token y que nos devuelva todos los datos del usuario
    const request = await fetch(Global.url + "user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await request.json();

    // Setear el estado de Auth
    setAuth(data.user);


    // Setear el estado de loading
    setLoading(false);
  }

  // Renderizar el proveedor de contexto con el contexto AuthContext.Provider
  return (
    <AuthContext.Provider
      value={{
        // Valores que se comparten a través del contexto
        auth,
        setAuth,
        loading
      }}
    >
      {children} {/* Renderiza los componentes hijos envueltos por el proveedor */}
    </AuthContext.Provider>
  )
};

// Definir propTypes para el componente AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired // children debe ser un nodo React y es requerido
};

export default AuthContext;