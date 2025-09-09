'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories, fetchRecipesByCategory, searchRecipes } from '@/store/slices/recipeSlice';
import { ChefHat, Filter, Globe, Grid, List, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RecipesPage() {
  const dispatch = useAppDispatch();
  const { categories, searchResults, isLoading, searchTerm } = useAppSelector(
    (state) => state.recipes
  );

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      dispatch(searchRecipes(localSearchTerm));
      setSelectedCategory('all');
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      // Reset to show categories
    } else {
      dispatch(fetchRecipesByCategory(category));
    }
    setLocalSearchTerm('');
  };

  const displayedRecipes = searchResults;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Recipes</h1>
          <p className="text-xl text-white text-opacity-90 mb-8">
            Explore thousands of delicious recipes from around the world
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, or cuisines..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-white font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters and View Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recipes...</p>
          </div>
        )}

        {/* Categories Grid (when no search/category selected) */}
        {!isLoading && selectedCategory === 'all' && !searchTerm && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/recipes/category/${category.name.toLowerCase()}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={category.thumbnail}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {!isLoading && displayedRecipes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm
                  ? `Search Results for "${searchTerm}"`
                  : selectedCategory !== 'all'
                  ? `${selectedCategory} Recipes`
                  : 'Featured Recipes'}
              </h2>
              <p className="text-gray-600">
                {displayedRecipes.length} recipe{displayedRecipes.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={recipe.thumbnail || '/images/recipe-placeholder.jpg'}
                        alt={recipe.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {recipe.name}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {recipe.category && (
                          <div className="flex items-center gap-1">
                            <ChefHat className="h-4 w-4" />
                            <span>{recipe.category}</span>
                          </div>
                        )}
                        {recipe.area && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{recipe.area}</span>
                          </div>
                        )}
                      </div>

                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {displayedRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex"
                  >
                    <div className="w-48 h-32 relative flex-shrink-0">
                      <Image
                        src={recipe.thumbnail || '/images/recipe-placeholder.jpg'}
                        alt={recipe.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {recipe.name}
                      </h3>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        {recipe.category && (
                          <div className="flex items-center gap-1">
                            <ChefHat className="h-4 w-4" />
                            <span>{recipe.category}</span>
                          </div>
                        )}
                        {recipe.area && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{recipe.area}</span>
                          </div>
                        )}
                      </div>

                      {recipe.instructions && (
                        <p className="text-gray-600 line-clamp-2 mb-3">
                          {recipe.instructions.slice(0, 150)}...
                        </p>
                      )}

                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading &&
          displayedRecipes.length === 0 &&
          (searchTerm || selectedCategory !== 'all') && (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Recipes Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <button
                onClick={() => {
                  setLocalSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse All Categories
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
