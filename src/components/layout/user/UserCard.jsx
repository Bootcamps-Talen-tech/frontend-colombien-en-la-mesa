import React from 'react';
import PropTypes from 'prop-types';
import { Global } from "../../../helpers/Global";
import { Card } from 'react-bootstrap';
import '../../../assets/css/user/userCard.css'

const UserCard = ({ user }) => {
  return (
    <Card className="user-card">
      <Card.Img variant="top" src={`${Global.url}user/image/${user.image}`} alt={user.name} />
      <Card.Body>
        <Card.Title>{user.name}</Card.Title>
        <Card.Text>
          <strong>Fecha:</strong> {new Date(user.created_at).toLocaleDateString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    created_at: PropTypes.string.isRequired
  }).isRequired
};

export default UserCard;