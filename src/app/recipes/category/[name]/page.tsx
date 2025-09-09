'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRecipesByCategory } from '@/store/slices/recipeSlice';
import { ArrowLeft, ChefHat, Globe, Grid, List, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchResults, isLoading } = useAppSelector((state) => state.recipes);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryName = params.name as string;
  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : '';

  useEffect(() => {
    if (categoryName) {
      dispatch(fetchRecipesByCategory(formattedCategoryName));
    }
  }, [dispatch, categoryName, formattedCategoryName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {formattedCategoryName} recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{formattedCategoryName} Recipes</h1>
              <p className="text-gray-600 mt-1">
                Discover delicious {formattedCategoryName.toLowerCase()} recipes from around the
                world
              </p>
            </div>
          </div>

          {/* Stats and View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {searchResults.length} recipe{searchResults.length !== 1 ? 's' : ''} found
            </p>

            <div className="flex items-center gap-4">
              {/* Search in Category */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search in ${formattedCategoryName}...`}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
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
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {searchResults.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={recipe.thumbnail || '/images/recipe-placeholder.jpg'}
                        alt={recipe.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {recipe.name}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
              <div className="space-y-6">
                {searchResults.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex"
                  >
                    <div className="w-56 h-40 relative flex-shrink-0">
                      <Image
                        src={recipe.thumbnail || '/images/recipe-placeholder.jpg'}
                        alt={recipe.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                          {recipe.name}
                        </h3>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <ChefHat className="h-4 w-4" />
                            <span>{formattedCategoryName}</span>
                          </div>
                          {recipe.area && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              <span>{recipe.area}</span>
                            </div>
                          )}
                        </div>

                        {recipe.instructions && (
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {recipe.instructions.slice(0, 200)}...
                          </p>
                        )}
                      </div>

                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium"
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
          </>
        ) : (
          // No recipes found
          <div className="text-center py-16">
            <ChefHat className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No {formattedCategoryName} Recipes Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any recipes in the {formattedCategoryName.toLowerCase()}{' '}
              category. Try exploring other categories or search for specific dishes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recipes"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse All Recipes
              </Link>
              <button
                onClick={() => router.back()}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
