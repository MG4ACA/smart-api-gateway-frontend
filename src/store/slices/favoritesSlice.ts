import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Recipe } from './recipeSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Favorite {
  id: string;
  recipeId: string;
  createdAt: string;
  recipe: Recipe | null;
}

interface FavoritesState {
  favorites: Favorite[];
  stats: {
    totalFavorites: number;
    recentCategories: { [key: string]: number };
    recentCount: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const initialState: FavoritesState = {
  favorites: [],
  stats: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  },
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = Cookies.get('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async ({ limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/favorites?limit=${limit}&offset=${offset}`,
        { headers: getAuthHeaders() }
      );
      return {
        favorites: response.data.data.favorites,
        pagination: response.data.data.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/favorites/${recipeId}`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (recipeId: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/favorites/${recipeId}`,
        { headers: getAuthHeaders() }
      );
      return recipeId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
);

export const checkFavoriteStatus = createAsyncThunk(
  'favorites/checkFavoriteStatus',
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/favorites/${recipeId}/check`,
        { headers: getAuthHeaders() }
      );
      return {
        recipeId,
        ...response.data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check favorite status');
    }
  }
);

export const fetchFavoriteStats = createAsyncThunk(
  'favorites/fetchFavoriteStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/favorites/stats`,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite stats');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
      state.stats = null;
      state.pagination = initialState.pagination;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateFavoriteInList: (state, action: PayloadAction<{ recipeId: string; isFavorite: boolean }>) => {
      const { recipeId, isFavorite } = action.payload;
      if (!isFavorite) {
        // Remove from favorites list
        state.favorites = state.favorites.filter(fav => fav.recipeId !== recipeId);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        const { favorites, pagination } = action.payload;
        
        if (pagination.offset === 0) {
          state.favorites = favorites;
        } else {
          state.favorites = [...state.favorites, ...favorites];
        }
        
        state.pagination = pagination;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to Favorites
      .addCase(addToFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const { favorite, recipe } = action.payload;
        // Add to the beginning of the list
        state.favorites.unshift({
          id: favorite.id,
          recipeId: favorite.recipeId,
          createdAt: favorite.createdAt,
          recipe,
        });
        state.pagination.total += 1;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from Favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        const recipeId = action.payload;
        state.favorites = state.favorites.filter(fav => fav.recipeId !== recipeId);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch Favorite Stats
      .addCase(fetchFavoriteStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFavoriteStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchFavoriteStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearFavorites, clearError, updateFavoriteInList } = favoritesSlice.actions;
export default favoritesSlice.reducer;
