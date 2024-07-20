import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import StarRatings from 'react-star-ratings';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/button.css'
import { Link } from "react-router-dom"

const RecipeCard = ({ recipe }) => {
  // Estado para mostrar/ocultar el modal de calificación.
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="card h-100">
      {/* Imagen de la receta */}
      <img src={`${Global.url}recipes/media/${recipe.image}`} className="card-img-top" alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
      
      <div className="card-body">
        {/* Título de la receta */}
        <h5 className="card-title">{recipe.title}</h5>
        {/* Descripción de la receta */}
        <p className="card-text">{recipe.description}</p>

        {/* Mostrar la calificación promedio de la receta */}
        <div>
          <span>Calificación promedio: </span>
          <StarRatings
            rating={recipe.averageRating}
            starRatedColor="gold"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="2px"
            name='averageRating'
            readOnly // Hacer la calificación solo de lectura para mostrar la calificación promedio.
          />
        </div>

        {/* Botón para abrir el modal de calificación */}
        <Button className="custom-button" variant="primary" onClick={() => setShowModal(true)}>
          Calificar
        </Button>
      </div>

      {/* Modal para verificar que este autenticado para calificar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className='ms-auto fs-5'>Por favor inicia sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Enlaces para iniciar sesión o registrarse */}
          <div className="d-grid gap-2 col-3">
            <Link to="/login" className="btn btn-dark custom-btn">
              Inicia sesión
            </Link>
            <Link to="/registro" className="btn btn-dark custom-btn">
              Regístrate
            </Link>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p className='m-auto fs-5'>¡Tu opinión es muy importante para nosotros!</p>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecipeCard;