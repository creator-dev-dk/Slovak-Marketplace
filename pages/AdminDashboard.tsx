
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAppStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
    ShieldAlert, Users, LayoutGrid, Star, Loader2, Trash2, Ban, CheckCircle, 
    Search, TrendingUp, AlertOctagon, Eye, BadgeCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

type AdminTab = 'overview' | 'users' | 'listings' | 'reviews';

const AdminDashboard: React.FC = () => {
    const { 
        user, fetchAdminData, adminUsers, adminStats, adminReviews, 
        listings, deleteListing, adminBanUser, adminDeleteReview, isLoading,
        fetchListings // Get all listings (admin sees everything via RLS but store logic filters active, so fetchListings might need adjustment if we want to see hidden ones. For now, rely on standard fetchListings which might miss hidden ones unless we update store logic. Assuming Admin wants to moderate ACTIVE content mostly)
    } = useAppStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchAdminData();
        fetchListings(); // Refresh listings
    }, [user, navigate, fetchAdminData, fetchListings]);

    if (!user || user.role !== 'admin') return null;

    if (isLoading && !adminStats.users) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
    }

    // Filter Logic
    const filteredUsers = adminUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredListings = listings.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredReviews = adminReviews.filter(r => r.comment.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <ShieldAlert className="text-indigo-600" size={32} />
                            Admin Control
                        </h1>
                        <p className="text-slate-500 mt-1">Manage users, content, and platform safety.</p>
                    </div>
                    
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        {(['overview', 'users', 'listings', 'reviews'] as AdminTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={24} /></div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+12% this week</span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
                            <p className="text-4xl font-bold text-slate-900 mt-2">{adminStats.users}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><LayoutGrid size={24} /></div>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Active</span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Listings</h3>
                            <p className="text-4xl font-bold text-slate-900 mt-2">{adminStats.listings}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Star size={24} /></div>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Reviews</h3>
                            <p className="text-4xl font-bold text-slate-900 mt-2">{adminStats.reviews}</p>
                        </div>
                    </motion.div>
                )}

                {activeTab !== 'overview' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Table Controls */}
                        <div className="p-4 border-b border-slate-200 flex gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder={`Search ${activeTab}...`} 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                                    <tr>
                                        {activeTab === 'users' && <>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </>}
                                        {activeTab === 'listings' && <>
                                            <th className="px-6 py-4">Item</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Seller</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </>}
                                        {activeTab === 'reviews' && <>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4">Comment</th>
                                            <th className="px-6 py-4">Reviewer</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeTab === 'users' && filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                                                        {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover"/> : u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{u.name}</p>
                                                        <p className="text-slate-400 text-xs">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.isBanned ? (
                                                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-bold"><AlertOctagon size={12}/> Banned</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle size={12}/> Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{u.role || 'User'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt || '').toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                {u.id !== user.id && (
                                                    <button 
                                                        onClick={() => adminBanUser(u.id, !u.isBanned)}
                                                        className={`p-2 rounded-lg transition-colors ${u.isBanned ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                        title={u.isBanned ? "Unban User" : "Ban User"}
                                                    >
                                                        {u.isBanned ? <CheckCircle size={18} /> : <Ban size={18} />}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'listings' && filteredListings.map(l => (
                                        <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={l.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                                    <span className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">{l.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-slate-700">{l.price} €</td>
                                            <td className="px-6 py-4 text-slate-600">{l.sellerName}</td>
                                            <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{l.category}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => {if(window.confirm('Delete listing?')) deleteListing(l.id)}} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {activeTab === 'reviews' && filteredReviews.map(r => (
                                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex text-amber-400 gap-0.5">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-slate-200"} />)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-slate-600 text-sm line-clamp-2 max-w-xs">{r.comment}</p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-xs">{r.reviewerName}</td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                 <button onClick={() => {if(window.confirm('Delete review?')) adminDeleteReview(r.id)}} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
