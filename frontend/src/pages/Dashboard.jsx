import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Pencil, Check, X, LogOut, LayoutDashboard, Wallet, Plus, Loader2, Megaphone } from 'lucide-react'; // Added icons
import toast from 'react-hot-toast';
import FeedbackForm from '../components/FeedbackForm';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editThreshold, setEditThreshold] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({ title: '', threshold: 1000 });
  const [creating, setCreating] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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


  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomForm.title) {
      toast.error("Please enter a room name");
      return;
    }
    setCreating(true);
    try {
      await api.post('/rooms', newRoomForm);
      toast.success("Room created successfully!");
      setShowCreateRoomModal(false);
      setNewRoomForm({ title: '', threshold: 1000 });
      fetchRooms();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">

      {/* Professional Admin Navbar */}
      <div className="bg-white/40 backdrop-blur-2xl dark:bg-gray-900/40 border-b border-white/30 dark:border-gray-800 shadow-sm sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-blue/10 dark:bg-blue-900/30 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-brand-blue dark:text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Split<span className="text-brand-blue">App</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user?.role || 'Admin'}</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors"
              title="Give Feedback"
            >
              <Megaphone className="w-5 h-5" />
            </button>
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4 px-2 sm:px-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Room Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your active rooms and spending limits.</p>
          </div>

          {/* Stats Overview */}
          <div className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
            {rooms.length === 0 && (
              <button
                onClick={() => setShowCreateRoomModal(true)}
                className="w-full sm:w-auto px-8 py-4 bg-brand-blue text-white font-black rounded-[2rem] shadow-xl shadow-brand-blue/30 hover:bg-blue-700 hover:shadow-brand-blue/40 transform hover:-translate-y-1 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Room
              </button>
            )}

            <div className="w-full sm:w-auto bg-white dark:bg-gray-800 px-6 py-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 group transition-all hover:shadow-md">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-brand-blue dark:text-blue-400 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest">Total Rooms</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{rooms.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Grid (Single Column as requested) */}
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white dark:bg-gray-800 rounded-[2.5rem] animate-pulse shadow-sm border border-gray-100 dark:border-gray-700"></div>
            ))
          ) : rooms.map(room => (
            <div key={room.id} className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-1 w-full">
              <Link to={`/rooms/${room.id}`} className="block p-6 sm:p-8 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] bg-gradient-to-br from-brand-blue via-blue-600 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transform group-hover:rotate-6 transition-transform duration-500 flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-black">{room.title.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-gray-900 dark:text-white text-lg sm:text-xl truncate tracking-tight">{room.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          Active Room
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Threshold Section with In-place Edit */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-[1.5rem] p-4 sm:p-5 border border-gray-100/50 dark:border-gray-700/50 transition-colors group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10" onClick={(e) => e.preventDefault()}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Wallet className="w-3.5 h-3.5" /> Monthly Limit
                      </span>
                      {editingRoomId === room.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleSaveThreshold(e, room.id)}
                            disabled={updating}
                            className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/20 transition-all active:scale-90"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 rounded-xl bg-white dark:bg-gray-600 text-gray-400 hover:text-red-500 shadow-sm transition-all active:scale-90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleStartEdit(e, room)}
                          className="p-2 rounded-xl text-gray-400 hover:text-brand-blue hover:bg-white dark:hover:bg-gray-600 shadow-sm transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                          title="Edit Limit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {editingRoomId === room.id ? (
                      <div className="flex items-center gap-1 group/input">
                        <span className="text-2xl font-black text-brand-blue">₹</span>
                        <input
                          type="number"
                          value={editThreshold}
                          onChange={(e) => setEditThreshold(e.target.value)}
                          className="w-full bg-white dark:bg-gray-600 border-2 border-transparent focus:border-brand-blue rounded-xl px-3 py-1.5 text-xl sm:text-2xl font-black text-gray-900 dark:text-white focus:outline-none transition-all"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveThreshold(e, room.id);
                            if (e.key === 'Escape') handleCancelEdit(e);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                        ₹{room.threshold.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-6 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="flex -space-x-2 sm:-space-x-3 flex-shrink-0">
                        {[...Array(Math.min(3, room._count?.members || 1))].map((_, i) => (
                          <div key={i} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ${i === 0 ? 'bg-purple-100' : i === 1 ? 'bg-blue-100' : 'bg-emerald-100'
                            }`}></div>
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter truncate">
                        {(room._count?.members || 0)} Members
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-brand-blue font-black text-[10px] sm:text-sm uppercase tracking-widest group-hover:translate-x-1 transition-transform flex-shrink-0">
                      Enter into Room
                    </div>
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

      {/* Create Room Modal */}
      {showCreateRoomModal && rooms.length === 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateRoomModal(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-scale-up border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create New Room</h2>
              <button onClick={() => setShowCreateRoomModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Room Title</label>
                <input
                  type="text"
                  value={newRoomForm.title}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, title: e.target.value })}
                  placeholder="e.g. Dream House"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-brand-blue rounded-2xl text-gray-900 dark:text-white font-bold outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Monthly Threshold (Optional)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                  <input
                    type="number"
                    value={newRoomForm.threshold}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, threshold: e.target.value })}
                    placeholder="1000"
                    className="w-full pl-10 pr-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-brand-blue rounded-2xl text-gray-900 dark:text-white font-bold outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">Automatic alerts when spending exceeds this limit.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  className="py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="py-4 bg-brand-blue text-white font-black rounded-2xl shadow-lg shadow-brand-blue/30 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* AI Chat Helper */}
      {/* Feedback Form */}
      <FeedbackForm
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};

export default Dashboard;
