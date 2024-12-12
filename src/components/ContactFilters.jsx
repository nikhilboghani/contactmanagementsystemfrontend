import { Menu } from '@headlessui/react';
import { FaFilter, FaStar } from 'react-icons/fa';

export default function ContactFilters({ filters, onFilterChange }) {
  const categories = ['Family', 'Friend', 'Work', 'Other'];

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category });
  };

  const toggleFavorites = () => {
    onFilterChange({ ...filters, favoritesOnly: !filters.favoritesOnly });
  };

  return (
    <div className="flex flex-wrap items-center space-x-4 gap-4 sm:space-x-6">
      {/* Category Filter Menu */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 space-x-2">
          <FaFilter className="text-lg" />
          <span className="hidden sm:block">Category</span>
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Menu.Item>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleCategoryChange(null)}
            >
              All Categories
            </button>
          </Menu.Item>
          {categories.map((category) => (
            <Menu.Item key={category}>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>

      {/* Favorites Button */}
      <button
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors w-full sm:w-auto ${
          filters.favoritesOnly
            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={toggleFavorites}
      >
        <FaStar className="text-lg mr-2" />
        <span className="hidden sm:block">Favorites</span>
      </button>
    </div>
  );
}
