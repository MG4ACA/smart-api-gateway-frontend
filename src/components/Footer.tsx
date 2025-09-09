export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Recipe Gateway</h3>
            <p className="text-gray-300">
              Discover, save, and enjoy delicious recipes from around the world.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Browse recipes by category</li>
              <li>Search for specific dishes</li>
              <li>Save your favorite recipes</li>
              <li>Detailed cooking instructions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">API</h3>
            <p className="text-gray-300">
              Powered by TheMealDB API for comprehensive recipe data.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Smart Recipe Gateway. Built with Next.js and Express.</p>
        </div>
      </div>
    </footer>
  );
}
