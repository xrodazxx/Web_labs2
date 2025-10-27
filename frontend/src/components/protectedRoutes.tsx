import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { getToken } from '../utils/localStorage';

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const verify = async () => {
        await dispatch(fetchCurrentUser());
        setChecked(true);
      };
      verify();
    } else {
      setChecked(true);
    }
  }, [dispatch]);

  if (!checked || isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
