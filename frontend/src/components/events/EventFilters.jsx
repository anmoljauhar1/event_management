import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../constants';

const EventFilters = ({ onFilter, initialFilters = {} }) => {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [dateFrom, setDateFrom] = useState(initialFilters.date_from || '');
  const [dateTo, setDateTo] = useState(initialFilters.date_to || '');
  const [location, setLocation] = useState(initialFilters.location || '');

  useEffect(() => {
    setSearch(initialFilters.search || '');
    setCategory(initialFilters.category || '');
    setDateFrom(initialFilters.date_from || '');
    setDateTo(initialFilters.date_to || '');
    setLocation(initialFilters.location || '');
  }, [
    initialFilters.search,
    initialFilters.category,
    initialFilters.date_from,
    initialFilters.date_to,
    initialFilters.location
  ]);

  const handleApply = () => {
    onFilter({ search, category, date_from: dateFrom, date_to: dateTo, location });
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setDateFrom('');
    setDateTo('');
    setLocation('');
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Date from"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="date"
          placeholder="Date to"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={handleReset} className="px-4 py-2 border rounded hover:bg-gray-50">Reset</button>
        <button onClick={handleApply} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Apply Filters</button>
      </div>
    </div>
  );
};

export default EventFilters;