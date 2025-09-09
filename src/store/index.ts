import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import favoritesSlice from './slices/favoritesSlice';
import recipeSlice from './slices/recipeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    recipes: recipeSlice,
    favorites: favoritesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
