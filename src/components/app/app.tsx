import { AppHeader } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { OrderInfo } from '../order-info/order-info';
import { Preloader } from '@ui';
import { Modal } from '../modal/modal';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { AppContentProps } from './type';

import '../../index.css';
import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector((state) => state.ingredients.loading);
  const ingredientsError = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError ? new Error(ingredientsError) : null}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return (
    <>
      <Routes location={location.state?.background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute unAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute unAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute unAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute unAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute onlyAuth>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute onlyAuth>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute onlyAuth>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {location.state?.background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <ModalWrapper>
                <OrderInfo />
              </ModalWrapper>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <ModalWrapper>
                <IngredientDetails />
              </ModalWrapper>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ModalWrapper>
                <OrderInfo />
              </ModalWrapper>
            }
          />
        </Routes>
      )}
    </>
  );
};

const ModalWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  return <Modal title="" onClose={handleClose}>{children}</Modal>;
};
