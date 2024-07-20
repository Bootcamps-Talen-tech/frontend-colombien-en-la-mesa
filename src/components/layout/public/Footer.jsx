import '../../../assets/css/footer.css'
import { VscGithub } from "react-icons/vsc";


// Define y exporta el componente Footer.
export const Footer = () => {
  return (
    <div>
      {/* Pie de página con clases de Bootstrap para el diseño */}
      <footer className="text-center bg-dark text-light">
        <div className="container pt-4">
          <section className="mb-4">
            {/* Enlace a Github */}
            <a
              className="btn-link btn-floating text-light"
              href="https://github.com/orgs/Bootcamps-Talen-tech/repositories"
              role="button"
              data-mdb-ripple-color="light"
            >
              {/* Icono de Github */}
              <i className="fab"><VscGithub /></i>
            </a>
          </section>
        </div>
        {/* Información de derechos de autor */}
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          © 2020 Copyright:
          <a className="text-light" href="http://localhost:5173/">Receta.com</a>
        </div>
      </footer>
    </div>
  )
}