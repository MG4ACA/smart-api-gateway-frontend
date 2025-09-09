'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';
import { fetchRecipeById } from '@/store/slices/recipeSlice';
import { ArrowLeft, CheckCircle, ChefHat, ExternalLink, Globe, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentRecipe, isLoading } = useAppSelector((state) => state.recipes);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.favorites);

  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  const recipeId = params.id as string;

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchRecipeById(recipeId));
    }
  }, [dispatch, recipeId]);

  useEffect(() => {
    if (currentRecipe && favorites) {
      setIsFavorited(favorites.some((fav) => fav.recipeId === currentRecipe.id));
    }
  }, [currentRecipe, favorites]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !currentRecipe) return;

    try {
      if (isFavorited) {
        await dispatch(removeFromFavorites(currentRecipe.id)).unwrap();
      } else {
        await dispatch(addToFavorites(currentRecipe.id)).unwrap();
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-6">
            The recipe you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/recipes"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse All Recipes
          </Link>
        </div>
      </div>
    );
  }

  // Parse ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = currentRecipe[`strIngredient${i}`];
    const measure = currentRecipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  // Parse instructions
  const instructions = currentRecipe.instructions
    ? currentRecipe.instructions.split(/\r?\n/).filter((step) => step.trim())
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src={currentRecipe.thumbnail}
          alt={currentRecipe.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-3 rounded-full transition-all shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-6 right-6 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full transition-all shadow-lg"
          >
            <Heart
              className={`h-5 w-5 ${isFavorited ? 'text-red-600 fill-current' : 'text-gray-600'}`}
            />
          </button>
        )}

        {/* Recipe Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentRecipe.name}</h1>

            <div className="flex flex-wrap items-center gap-6 text-white text-opacity-90">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{currentRecipe.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                <span>{currentRecipe.category}</span>
              </div>
              {currentRecipe.tags && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>{currentRecipe.tags.split(',')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'ingredients'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'instructions'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Instructions
          </button>
          {currentRecipe.strYoutube && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'video'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Video
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-900">
                      <span className="font-medium">{item.measure}</span> {item.ingredient}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h3>
              <div className="space-y-6">
                {instructions.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'video' && currentRecipe.strYoutube && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Video Tutorial</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ExternalLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Watch the video tutorial on YouTube</p>
                  <a
                    href={currentRecipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Source Link */}
        {currentRecipe.strSource && (
          <div className="mt-8 text-center">
            <a
              href={currentRecipe.strSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Original Recipe
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
