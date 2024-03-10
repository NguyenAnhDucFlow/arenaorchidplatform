import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import { AuthContext } from 'src/contexts/JWTContext';
import { useContext } from 'react';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

// const useCurrentRole = () => {
//   // Logic here to get current user role
//   const role = 'admin';
//   return role;
// };

// export default function RoleBasedGuard({ accessibleRoles, children }) {

//   if (!accessibleRoles.includes(currentRole)) {
//     return (
//       <Container>
//         <Alert severity="error">
//           <AlertTitle>Permission Denied</AlertTitle>
//           You do not have permission to access this page
//         </Alert>
//       </Container>
//     );
//   }

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { user } = useContext(AuthContext);
  const userRoles = user.roles;

  const hasAccess = userRoles.some(role => accessibleRoles.includes(role));

  if (!hasAccess) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
