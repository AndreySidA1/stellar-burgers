import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  children: React.ReactElement;
  onlyAuth?: boolean;
  unAuth?: boolean;
};

export const ProtectedRoute = ({ children, onlyAuth, unAuth }: TProtectedRouteProps): React.ReactElement | null => {
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (unAuth && user) {
    const from = (location.state as { from?: { pathname: string } })?.from;
    return <Navigate to={from?.pathname || '/'} replace />;
  }

  return children;
};
