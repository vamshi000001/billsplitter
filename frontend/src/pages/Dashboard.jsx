import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch rooms logic
  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms/my');
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    if (user?.name) {
      setNewRoomTitle(`${user.name}'s Room`);
    }
  }, [user]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', { title: newRoomTitle });
      setNewRoomTitle('');
      fetchRooms(); // Refresh
    } catch (err) {
      console.error(err);
      setError('Failed to create room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      {/* Navbar / Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 dark:text-gray-300 font-medium hidden sm:block">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-full transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Create Room Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create a New Room</h2>
          <form onSubmit={handleCreateRoom} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
              placeholder="Ex: Apartment 4B, Goa Trip..."
              className="flex-1 px-5 py-3 text-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
              required
            />
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg">
              Create Room
            </button>
          </form>
          {error && <p className="text-red-500 mt-3 font-medium">{error}</p>}
        </div>

        {/* Rooms Grid */}
        <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-300">Your Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            ))
          ) : rooms.map(room => (
            <Link key={room.id} to={`/rooms/${room.id}`} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{room.title}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Threshold</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">₹{room.threshold.toLocaleString()}</p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {room._count?.members || 0} Members
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex justify-between items-center group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-colors">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">View Details</span>
                <span className="text-xl text-blue-600 dark:text-blue-400 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
          {!loading && rooms.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't joined any rooms yet.</p>
              <p className="text-gray-400 dark:text-gray-500">Create one above or ask for an invite!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
