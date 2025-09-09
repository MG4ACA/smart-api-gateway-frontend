'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';
import { ChefHat, ExternalLink, Grid, Heart, List, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites, isLoading } = useAppSelector((state) => state.favorites);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated, router]);

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      await dispatch(removeFromFavorites(recipeId)).unwrap();
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Favorite Recipes</h1>
              <p className="text-white text-opacity-90 mt-2">
                Your personal collection of saved recipes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Controls */}
        {favorites.length > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Stats */}
              <span className="text-gray-600">
                {filteredFavorites.length} of {favorites.length} recipe
                {favorites.length !== 1 ? 's' : ''}
              </span>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Grid/List */}
        {filteredFavorites.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={favorite.recipeImage || '/images/recipe-placeholder.jpg'}
                        alt={favorite.recipeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleRemoveFavorite(favorite.recipeId)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                          title="Remove from favorites"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                        {favorite.recipeName}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Added {new Date(favorite.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/recipes/${favorite.recipeId}`}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredFavorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex"
                  >
                    <div className="w-48 h-32 relative flex-shrink-0">
                      <Image
                        src={favorite.recipeImage || '/images/recipe-placeholder.jpg'}
                        alt={favorite.recipeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {favorite.recipeName}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Added to favorites on {new Date(favorite.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/recipes/${favorite.recipeId}`}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Recipe
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.recipeId)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : favorites.length === 0 ? (
          // No favorites at all
          <div className="text-center py-16">
            <div className="mb-6">
              <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Favorite Recipes Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring recipes and save your favorites by clicking the heart icon. Your saved
              recipes will appear here for easy access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recipes"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <ChefHat className="h-5 w-5" />
                Discover Recipes
              </Link>
              <Link
                href="/"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          // No search results
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">
              No favorites match your search for &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
