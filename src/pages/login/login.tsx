import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser, resetError } from '../../services/slices/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
