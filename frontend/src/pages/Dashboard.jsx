import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Pencil, Check, X, LogOut, LayoutDashboard, Wallet } from 'lucide-react'; // Added icons
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editThreshold, setEditThreshold] = useState('');
  const [updating, setUpdating] = useState(false);

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
  }, []);

  const handleStartEdit = (e, room) => {
    e.preventDefault(); // Prevent Link navigation
    setEditingRoomId(room.id);
    setEditThreshold(room.threshold);
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    setEditingRoomId(null);
  };

  const handleSaveThreshold = async (e, roomId) => {
    e.preventDefault();
    if (!editThreshold || isNaN(editThreshold) || editThreshold < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setUpdating(true);
    try {
      await api.patch(`/rooms/${roomId}`, { threshold: editThreshold });
      toast.success("Threshold updated successfully");
      setEditingRoomId(null);
      fetchRooms();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update threshold");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">

      {/* Professional Admin Navbar */}
      <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-blue/10 dark:bg-blue-900/30 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-brand-blue dark:text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Admin<span className="text-brand-blue">Panel</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user?.role || 'Admin'}</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Management</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your active rooms and spending limits.</p>
          </div>

          {/* Stats Overview */}
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-brand-blue dark:text-blue-400">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Total Rooms</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{rooms.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse shadow-sm border border-gray-200 dark:border-gray-700"></div>
            ))
          ) : rooms.map(room => (
            <div key={room.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <Link to={`/rooms/${room.id}`} className="block p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <span className="text-lg font-bold">{room.title.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{room.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Threshold Section with In-place Edit */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4" onClick={(e) => e.preventDefault()}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Wallet className="w-3 h-3" /> Monthly Limit
                      </span>
                      {editingRoomId === room.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleSaveThreshold(e, room.id)}
                            disabled={updating}
                            className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleStartEdit(e, room)}
                          className="p-1 rounded-full text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-gray-600 transition-all"
                          title="Edit Limit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {editingRoomId === room.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-gray-400">₹</span>
                        <input
                          type="number"
                          value={editThreshold}
                          onChange={(e) => setEditThreshold(e.target.value)}
                          className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded px-2 py-1 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/50"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveThreshold(e, room.id);
                            if (e.key === 'Escape') handleCancelEdit(e);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{room.threshold.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(3, room._count?.members || 1))].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800"></div>
                        ))}
                      </div>
                      <span>{(room._count?.members || 0)} Members</span>
                    </div>
                    <span className="font-semibold text-brand-blue group-hover:underline">Manage</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {!loading && rooms.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                <LayoutDashboard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No rooms found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2">
                You haven't joined or created any rooms yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
