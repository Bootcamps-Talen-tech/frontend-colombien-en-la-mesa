import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import StarRatings from 'react-star-ratings';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/button.css';

// Define y exporta el componente RecipeCard.
const RecipeCard = ({ recipe, onReviewUpdated }) => {
  // Define los estados locales para el componente.
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal de calificación.
  const [rating, setRating] = useState(recipe.userRating || 0); // Estado para la calificación del usuario.
  const [comment, setComment] = useState(''); // Estado para el comentario del usuario.
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error.
  const [showErrorModal, setShowErrorModal] = useState(false); // Controla la visibilidad del modal de error.

  // Maneja el envío de la calificación y comentario.
  const handleReviewSubmit = async () => {
    const token = localStorage.getItem('token'); // Obtiene el token de autenticación del localStorage.
    try {
      const response = await fetch(`${Global.url}reviews/add/${recipe._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ rating, comment }) // Envía la calificación y el comentario en el cuerpo de la solicitud.
      });

      const data = await response.json();

      // Maneja errores en la respuesta del servidor.
      if (!response.ok) {
        if (data.message === "Ya comentaste esta receta") {
          setErrorMessage(data.message);
          setShowErrorModal(true);
        } else {
          throw new Error(data.message || 'Error al enviar la calificación y comentario');
        }
        return;
      }

      // Actualiza la calificación en el estado local.
      setRating(rating);
      setComment('');

      // Cierra el modal de calificación.
      setShowModal(false);

      // Llama a la función de actualización proporcionada como prop.
      if (onReviewUpdated) {
        onReviewUpdated(recipe._id);
      }
    } catch (error) {
      console.error('Error al calificar y comentar la receta:', error.message);
    }
  };

  return (
    <div className="card h-100">
      {/* Imagen de la receta */}
      <img src={`${Global.url}recipes/media/${recipe.image}`} className="card-img-top" alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
      <div className="card-body">
        {/* Título de la receta */}
        <h5 className="card-title fs-3">{recipe.title}</h5>
        {/* Descripción de la receta */}
        <p className="card-text fs-5">{recipe.description}</p>
        <div>
          {/* Calificación promedio de la receta */}
          <span className='fs-5'>Calificación: </span>
          <StarRatings
            rating={recipe.averageRating}
            starRatedColor="gold"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="2px"
            name='averageRating'
            readOnly
          />
        </div>
        {/* Botón para abrir el modal de calificación */}
        <Button className="custom-button" variant="primary" onClick={() => setShowModal(true)}>
          Calificar
        </Button>
      </div>

      {/* Modal para calificar la receta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Calificar Receta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Imagen y título de la receta en el modal */}
          <img src={`${Global.url}recipes/media/${recipe.image}`} className="card-img-top" alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
          <h5 className="card-title modal-body fs-3">{recipe.title}</h5>
          {/* Componente de calificación */}
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={(newRating) => setRating(newRating)}
            numberOfStars={5}
            starDimension="30px"
            starSpacing="2px"
            name='userRating'
          />
          {/* Área de texto para el comentario */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="form-control mt-3 fs-4"
          />
        </Modal.Body>
        <Modal.Footer>
          {/* Botones para cerrar el modal y enviar la calificación */}
          <Button className="custom-button" variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button className="custom-button" variant="primary" onClick={handleReviewSubmit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de error */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-button" variant="secondary" onClick={() => setShowErrorModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecipeCard;