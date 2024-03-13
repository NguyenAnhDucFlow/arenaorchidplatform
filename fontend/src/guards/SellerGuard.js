import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_PRODUCTOWNER } from '../routes/paths';

// ----------------------------------------------------------------------

SellerGuard.propTypes = {
  children: PropTypes.node
};

export default function SellerGuard({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={PATH_PRODUCTOWNER.root} />;
  }

  return <>{children}</>;
}
