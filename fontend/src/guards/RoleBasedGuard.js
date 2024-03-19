import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import { AuthContext } from '../contexts/JWTContext'; 


RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array.isRequired, // Example ['admin', 'leader']
  children: PropTypes.node,
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { user } = useContext(AuthContext); 

  
  const currentRole = user?.role; 
  console.log("currentRole", currentRole)

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  // If the user has an accessible role, render children components
  return <>{children}</>;
}
