import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../../helpers/Global';
import { Link } from 'react-router-dom';
import '../../../assets/css/recipes/edit.css';

const EditRecipe = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
  });
  const [userData, setUserData] = useState({ name: '', profileImage: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const recipeResponse = await fetch(`${Global.url}recipes/show-recipe/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });

        if (!recipeResponse.ok) {
          throw new Error('Error al obtener la receta');
        }

        const recipeData = await recipeResponse.json();
        if (recipeData.status === 'success' && recipeData.publication) {
          setFormData({
            title: recipeData.publication.title || '',
            description: recipeData.publication.description || '',
            ingredients: recipeData.publication.ingredients || '',
            instructions: recipeData.publication.instructions || '',
          });
        } else {
          throw new Error('No se encontró la receta');
        }

        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        if (userId) {
          const userResponse = await fetch(`${Global.url}user/profile/${userId}`, {
            headers: {
              'Authorization': token
            }
          });

          if (!userResponse.ok) {
            throw new Error('Error al obtener la información del usuario');
          }

          const userData = await userResponse.json();
          console.log(userData); // Verifica los datos recibidos

          if (userData.status === 'success') {
            setUserData({
              name: userData.user.name || '',
              profileImage: userData.user.image || '' // Asegúrate de usar el nombre correcto de la propiedad
            });
          } else {
            throw new Error('No se pudo obtener la información del usuario');
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Global.url}recipes/edit-recipe/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la receta');
      }

      navigate('/colreceta/profile');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="profile-containerr">
        <div className="profile-header">
          <img 
            src={`${Global.url}user/image/${userData.profileImage}`} 
            alt="Profile" 
            className="profile-pic" 
          />
          {console.log(userData)}
          <h2 className="profile-name">@{userData.name}</h2>
        </div>
        <div className='sub-nav'>
          <ul>
            <Link className="decoration-link" to="/colreceta/new"><li>Nueva receta</li></Link>
            <li>Mis Recetas</li>
            <li>Editar</li>
          </ul>
        </div>
      </div>

      <div className='conte-title'>
        <h2>Editar Receta</h2>
      </div>

      <div className='container-edit'>
        <div className='m-auto'>
          <h3>{formData.title}</h3>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="ingredients">Ingredientes</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="instructions">Instrucciones</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className='conte-edit'>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;