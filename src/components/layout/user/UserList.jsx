import React, { useState, useEffect } from 'react';
import { Global } from "../../../helpers/Global";
import UserCard from './UserCard';
import { Container, Row, Col } from 'react-bootstrap';
import '../../../assets/css/user/userCard.css'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
       {console.log(token)}
        const response = await fetch(`${Global.url}user/users`, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='containet-list'>
      <div className='m-auto'>
        <h2 className='fs-1'>Usuario de la pagina </h2>
      </div>
         <Container>
      <Row>
        
        {users.map(user => (
          <Col key={user.id} xs={12} sm={6} md={4} lg={3}>
            <UserCard user={user} />
          
          </Col>
        ))}
      </Row>
      </Container>
    </div>
  );
};

export default UserList;