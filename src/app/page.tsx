'use client';

import RecipeImage from '@/components/RecipeImage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories, fetchRandomRecipe } from '@/store/slices/recipeSlice';
import { ChefHat, Heart, Search, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { categories, randomRecipe } = useAppSelector((state) => state.recipes);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRandomRecipe());
  }, [dispatch]);

  const features = [
    {
      icon: ChefHat,
      title: 'Explore Recipes',
      description: 'Browse thousands of recipes from different cuisines and categories.',
      link: '/recipes',
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find recipes by ingredients, dish names, or cooking style.',
      link: '/search',
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Create your personal collection of favorite recipes.',
      link: isAuthenticated ? '/favorites' : '/auth/login',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Smart Recipe Gateway</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover delicious recipes from around the world, save your favorites, and create
              amazing meals with our intelligent recipe platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recipes"
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Recipes
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/auth/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Recipe Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you discover, organize, and enjoy cooking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-lg mb-6 mx-auto">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">{feature.description}</p>
                  <div className="text-center">
                    <Link
                      href={feature.link}
                      className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Random Recipe Section */}
      {randomRecipe && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Recipe of the Day
              </h2>
              <p className="text-xl text-gray-600">Try something new with our featured recipe</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <RecipeImage
                    src={randomRecipe.thumbnail || '/images/recipe-placeholder.svg'}
                    alt={randomRecipe.name}
                    className="h-64 md:h-full w-full object-cover"
                    width={500}
                    height={300}
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-600">Featured Recipe</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{randomRecipe.name}</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    {randomRecipe.category && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        {randomRecipe.category}
                      </span>
                    )}
                    {randomRecipe.area && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {randomRecipe.area}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {randomRecipe.instructions?.substring(0, 150)}...
                  </p>
                  <Link
                    href={`/recipes/${randomRecipe.id}`}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Preview */}
      {categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-xl text-gray-600">Explore recipes by your favorite cuisine type</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.slice(0, 12).map((category) => (
                <Link
                  key={category.id}
                  href={`/recipes/category/${category.name}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center">
                    <RecipeImage
                      src={category.thumbnail}
                      alt={category.name}
                      className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover group-hover:scale-105 transition-transform"
                      width={64}
                      height={64}
                    />
                    <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/recipes"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                View All Categories
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Cooking?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of food enthusiasts who use our platform to discover and organize their
            favorite recipes.
          </p>
          {!isAuthenticated ? (
            <Link
              href="/auth/register"
              className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
          ) : (
            <Link
              href="/favorites"
              className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Your Favorites
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
