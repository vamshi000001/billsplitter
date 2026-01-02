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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar / Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform cursor-pointer">
            Dashboard
          </h1>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-gray-600 dark:text-gray-300 font-medium hidden sm:block">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-5 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Create Room Section - Improved Styling */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create a New Room</h2>
                <p className="text-gray-500 dark:text-gray-400">Start splitting bills instantly. You'll be the Admin.</p>
              </div>

              <form onSubmit={handleCreateRoom} className="flex-1 w-full md:max-w-xl flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="Ex: Apartment 4B..."
                  className="flex-1 px-5 py-4 text-base border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all dark:bg-gray-700/50 dark:text-white font-medium"
                  required
                />
                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all whitespace-nowrap">
                  + Create
                </button>
              </form>
            </div>
            {error && <p className="text-red-500 mt-4 font-bold flex items-center gap-2"><span>⚠️</span> {error}</p>}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 text-xl">🏠</span>
            Your Rooms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-56 bg-white dark:bg-gray-800 rounded-3xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-700"></div>
              ))
            ) : rooms.map(room => (
              <Link key={room.id} to={`/rooms/${room.id}`} className="group relative bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-blue-50/50 dark:from-blue-900/10 to-transparent rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative p-6 h-full flex flex-col justify-between z-10 bg-white dark:bg-gray-800 rounded-[1.4rem] border border-gray-100 dark:border-gray-700 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform duration-300">
                        🏡
                      </div>
                      <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Active
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{room.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created by you</p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{room.threshold.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase">Limit</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, room._count?.members || 1))].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border-2 border-white dark:border-gray-800"></div>
                      ))}
                      {(room._count?.members || 0) > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{room._count.members - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      Manage &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {!loading && rooms.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <div className="text-6xl mb-4 opacity-50">✨</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No rooms yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Create your first room above to start tracking expenses with your roommates!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
