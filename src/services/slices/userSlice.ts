import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUserApi, loginUserApi, getUserApi, updateUserApi, logoutApi } from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import type { TUser } from '../../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  request: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  request: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: { email: string; name: string; password: string }) => {
    const data = await registerUserApi({ email, name, password });
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const data = await loginUserApi({ email, password });
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk('user/check', async () => {
  if (localStorage.getItem('refreshToken')) {
    const data = await getUserApi();
    return data.user;
  }
  return null;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<{ name: string; email: string; password: string }>) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.request = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.request = false; state.user = action.payload; state.isAuthChecked = true; })
      .addCase(registerUser.rejected, (state, action) => { state.request = false; state.error = action.error.message || 'Ошибка'; state.isAuthChecked = true; })

      .addCase(loginUser.pending, (state) => { state.request = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.request = false; state.user = action.payload; state.isAuthChecked = true; })
      .addCase(loginUser.rejected, (state, action) => { state.request = false; state.error = action.error.message || 'Ошибка'; state.isAuthChecked = true; })

      .addCase(checkUserAuth.pending, (state) => { state.request = true; })
      .addCase(checkUserAuth.fulfilled, (state, action) => { state.user = action.payload; state.isAuthChecked = true; state.request = false; })
      .addCase(checkUserAuth.rejected, (state) => { state.isAuthChecked = true; state.request = false; })

      .addCase(updateUser.pending, (state) => { state.request = true; })
      .addCase(updateUser.fulfilled, (state, action) => { state.request = false; state.user = action.payload; })
      .addCase(updateUser.rejected, (state, action) => { state.request = false; state.error = action.error.message || 'Ошибка'; })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
