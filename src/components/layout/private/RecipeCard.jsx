import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import StarRatings from 'react-star-ratings';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/button.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../../../assets/css/user/edit.css';

const RecipeCard = ({ recipe, editMode, onReviewUpdated, onRecipeDeleted }) => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(recipe.userRating || 0);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${Global.url}reviews/add/${recipe._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Ya comentaste esta receta") {
          setErrorMessage(data.message);
          setShowErrorModal(true);
        } else {
          throw new Error(data.message || 'Error al enviar la calificación y comentario');
        }
        return;
      }

      setRating(rating);
      setComment('');
      setShowModal(false);

      if (onReviewUpdated) {
        onReviewUpdated(recipe._id); // Llama a la función proporcionada como prop.
      }
    } catch (error) {
      console.error('Error al calificar y comentar la receta:', error.message);
    }
  };

  const handleEdit = () => {
    console.log('aqui',recipe._id)
     navigate(`/colreceta/edit-recipe/${recipe._id}`);
    
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${Global.url}recipes/delete-recipe/${recipe._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar la receta');
      }

      // Cierra el modal de confirmación
      setShowDeleteConfirm(false);

      // Notifica al componente padre que la receta ha sido eliminada
      if (onRecipeDeleted) {
        onRecipeDeleted(recipe._id);
      }
    } catch (error) {
      console.error('Error al eliminar la receta:', error.message);
    }
  };

  return (
    <div className="card h-100 position-relative">
      {editMode && (
        <div className="edit-buttons">
          <Button className="edit-btn" onClick={handleEdit}>
            <FaEdit />
          </Button>
          <Button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
            <FaTrash />
          </Button>
        </div>
      )}
      <Link to={`/colreceta/p/${recipe._id}`}>
        <img src={`${Global.url}recipes/media/${recipe.image}`} className="card-img-top" alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
      </Link>
      <div className="card-body">
        <Link className='decoration-link' to={`/colreceta/p/${recipe._id}`}>
          <h5 className="card-title fs-3">{recipe.title}</h5>
        </Link>
        <p className="card-text fs-5">{recipe.description}</p>
        <div className='m-2'>
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
          {!editMode && (
            <Button className="custom-button" onClick={() => setShowModal(true)}>
              Calificar
            </Button>
          )}
        </div>

        <div>
          <Link className="custom-btn-2" to={`/colreceta/p/${recipe._id}`}>Ver detalles</Link>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Calificar Receta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`${Global.url}recipes/media/${recipe.image}`} className="card-img-top" alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
          <h5 className="card-title modal-body fs-3">{recipe.title}</h5>
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={(newRating) => setRating(newRating)}
            numberOfStars={5}
            name='rating'
            starDimension="30px"
            starSpacing="2px"
          />
          <textarea
            className="form-control mt-2 fs-4"
            rows="3"
            placeholder="Deja tu comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-button" onClick={handleReviewSubmit}>
            Enviar
          </Button>
          <Button className="custom-button" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-button" onClick={() => setShowErrorModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar esta receta?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-button" onClick={handleDelete}>
            Eliminar
          </Button>
          <Button className="custom-button" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecipeCard;