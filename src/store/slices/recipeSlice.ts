import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Recipe {
  id: string;
  name: string;
  category?: string;
  area?: string;
  instructions?: string;
  thumbnail?: string;
  tags?: string[];
  youtube?: string;
  source?: string;
  ingredients?: Array<{
    name: string;
    measure: string;
  }>;
  cached?: boolean;
  cachedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

interface RecipeState {
  categories: Category[];
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  randomRecipe: Recipe | null;
  searchResults: Recipe[];
  searchTerm: string;
  currentCategory: string;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const initialState: RecipeState = {
  categories: [],
  recipes: [],
  currentRecipe: null,
  randomRecipe: null,
  searchResults: [],
  searchTerm: '',
  currentCategory: '',
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  },
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'recipes/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recipes/categories`);
      return response.data.data.categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchRecipesByCategory = createAsyncThunk(
  'recipes/fetchRecipesByCategory',
  async (
    { category, limit = 20, offset = 0 }: { category: string; limit?: number; offset?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/recipes/category/${category}?limit=${limit}&offset=${offset}`
      );
      return {
        recipes: response.data.data.recipes,
        pagination: response.data.data.pagination,
        category,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recipes/${id}`);
      return response.data.data.recipe;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }
);

export const fetchRandomRecipe = createAsyncThunk(
  'recipes/fetchRandomRecipe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recipes/random`);
      return response.data.data.recipe;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch random recipe');
    }
  }
);

export const searchRecipes = createAsyncThunk(
  'recipes/searchRecipes',
  async (
    { searchTerm, limit = 20, offset = 0 }: { searchTerm: string; limit?: number; offset?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/recipes/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}`
      );
      return {
        recipes: response.data.data.recipes,
        pagination: response.data.data.pagination,
        searchTerm,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchTerm = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Recipes by Category
      .addCase(fetchRecipesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const { recipes, pagination, category } = action.payload;
        
        if (pagination.offset === 0) {
          state.recipes = recipes;
        } else {
          state.recipes = [...state.recipes, ...recipes];
        }
        
        state.pagination = pagination;
        state.currentCategory = category;
      })
      .addCase(fetchRecipesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Random Recipe
      .addCase(fetchRandomRecipe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRandomRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.randomRecipe = action.payload;
      })
      .addCase(fetchRandomRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Recipes
      .addCase(searchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        const { recipes, pagination, searchTerm } = action.payload;
        
        if (pagination.offset === 0) {
          state.searchResults = recipes;
        } else {
          state.searchResults = [...state.searchResults, ...recipes];
        }
        
        state.pagination = pagination;
        state.searchTerm = searchTerm;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRecipe, clearSearchResults, clearError, setCurrentCategory } = recipeSlice.actions;
export default recipeSlice.reducer;
