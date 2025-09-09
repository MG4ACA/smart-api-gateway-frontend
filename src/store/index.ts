import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import recipeSlice from './slices/recipeSlice';
import favoritesSlice from './slices/favoritesSlice';

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
