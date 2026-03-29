import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import OrderTracking from '../components/OrderTracking';

const Profile: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const { user, logout, setUser, token } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user && token) {
      fetchOrders();
    }
  }, [activeTab, user, token]);

  const fetchOrders = async () => {
    if (!user || !token) return;
    setOrdersLoading(true);
    try {
      const data = await api.getUserOrders(user._id, token);
      setOrders(data as any[]);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!token) {
      alert("You must be logged in to update your profile picture.");
      return;
    }

    // Show preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploadStatus('loading');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.updateProfilePic(formData, token);
      
      // Update the user context with the new URL
      if (user) {
         setUser({ ...user, profilePicUrl: res.profilePicUrl });
      }
      setUploadStatus('success');
      
      // Clear preview URL to release memory since we have the real URL from server now
      URL.revokeObjectURL(localUrl);
      setPreviewUrl(null);

      // Auto clear success status after 3 seconds
      setTimeout(() => setUploadStatus('idle'), 3000);

    } catch (err: any) {
      console.error("Profile Pic Upload Error:", err);
      setUploadStatus('error');
      alert(`Failed to upload picture: ${err.message || "Please check your Cloudinary config"}`);
      setPreviewUrl(null);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const addressData = {
        street: data.get('street'),
        city: data.get('city'),
        state: data.get('state'),
        zip: data.get('zipCode'), // Backend expects 'zip'
        country: data.get('country'),
        phone: data.get('phone'),
        type: data.get('type')
      };

      let res;
      if (editingAddress) {
        res = await api.updateAddress(editingAddress._id, addressData, token);
      } else {
        res = await api.addAddress(addressData, token);
      }

      if (user) {
        setUser({ ...user, addresses: res });
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      form.reset();
    } catch (err: any) {
      console.error("Save Address Error:", err);
      if (err.message) console.error(err.message);
      alert(`Failed to save address: ${err.message || "Unknown Error"}`);
    }
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    if (!token) return;

    try {
      const res = await api.deleteAddress(id, token);
      if (user) {
        setUser({ ...user, addresses: res });
      }
    } catch (err) {
      console.error("Delete Address Error:", err);
      alert("Failed to delete address");
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const num = data.get('number') as string;

    // Luhn check
    if (!luhnCheck(num.replace(/\D/g, ''))) {
      alert("Invalid Card Number");
      return;
    }

    try {
      const card = {
        number: num, // Send full number for backend validation (will not be stored)
        cardHolder: data.get('holder'),
        last4Digits: num.slice(-4),
        expiry: data.get('expiry'),
        brand: 'HOLDER' // Simplified
      };
      const res = await api.addCard(card, token);
      if (user) {
        setUser({ ...user, paymentMethods: res });
      }
      setShowCardModal(false);
      form.reset();
    } catch (err) {
      console.error("Add Card Error:", err);
      alert("Failed to add card");
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    if (!token) return;

    try {
      const res = await api.deleteCard(id, token);
      if (user) {
        setUser({ ...user, paymentMethods: res });
      }
    } catch (err) {
      console.error("Delete Card Error:", err);
      alert("Failed to delete card");
    }
  };

  const luhnCheck = (val: string) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(val.charAt(i)) * j;
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
      checksum = checksum + calc;
      if (j === 1) { j = 2; } else { j = 1; }
    }
    return (checksum % 10) === 0;
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 rounded-full bg-primary/10 p-1 mb-3 group cursor-pointer">
              {uploadStatus === 'loading' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-full">
                   <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <img 
                alt="Profile Picture" 
                className={`w-full h-full rounded-full object-cover transition-opacity ${uploadStatus === 'loading' ? 'opacity-50' : 'opacity-100'}`} 
                src={previewUrl || user?.profilePicUrl || "https://ui-avatars.com/api/?background=random&name=" + encodeURIComponent(user?.name || 'User')} 
              />
              
              <label htmlFor="profile-upload" className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="material-icons text-white text-sm">photo_camera</span>
                <span className="text-white text-[10px] font-medium mt-1 uppercase tracking-wider">Change</span>
              </label>

              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleProfilePicChange} 
                disabled={uploadStatus === 'loading'}
              />
            </div>

            {uploadStatus === 'success' && (
              <span className="text-xs text-green-500 font-medium mb-2 animate-pulse">Updated successfully!</span>
            )}
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {user?.name || 'Loading...'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || 'Loading...'}
            </p>
          </div>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'}`}>
              <span className={`material-icons ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>person</span>
              <span className="font-medium">Profile</span>
            </button>
            <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${activeTab === 'addresses' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'}`}>
              <span className={`material-icons ${activeTab === 'addresses' ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>location_on</span>
              <span className="font-medium">Addresses</span>
            </button>
            <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${activeTab === 'wallet' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'}`}>
              <span className={`material-icons ${activeTab === 'wallet' ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>account_balance_wallet</span>
              <span className="font-medium">Wallet</span>
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'}`}>
              <span className={`material-icons ${activeTab === 'orders' ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>shopping_bag</span>
              <span className="font-medium">My Orders</span>
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <span className="material-icons text-red-500">logout</span>
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        {(activeTab === 'addresses' || activeTab === 'profile') && (
          /* Address Section */
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Addresses</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your shipping and billing locations.</p>
              </div>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
              >
                <span className="material-icons text-sm">add</span>
                Add New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.addresses?.map((addr: any) => (
                <div key={addr._id} className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                  {addr.isDefault && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Default</span>
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons text-gray-400 text-xl">
                        {addr.type === 'Work' ? 'work' : addr.type === 'Other' ? 'place' : 'home'}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{addr.type || 'Home'}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {user.name}<br />
                      {addr.street}<br />
                      {addr.city}, {addr.state} {addr.zip || addr.zipCode}<br />
                      {addr.country}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{addr.phone}</p>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => handleEditAddress(addr)} className="flex items-center justify-center w-[36px] h-[36px] rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-blue-500 hover:text-white transition-colors ml-auto">
                      <span className="material-icons text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="flex items-center justify-center w-[36px] h-[36px] rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-red-500 hover:text-white transition-colors">
                      <span className="material-icons text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {(!user?.addresses || user.addresses.length === 0) && (
                <div className="col-span-1 md:col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-gray-400 text-3xl">location_off</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No addresses saved yet.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {(activeTab === 'wallet' || activeTab === 'profile') && (
          /* Wallet Section */
          <section id="wallet" className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Wallet</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Securely manage your payment methods.</p>
              </div>
              <button onClick={() => setShowCardModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium">
                <span className="material-icons text-sm">add_card</span>
                Add Card
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {user?.paymentMethods?.map((card: any) => (
                  <div key={card._id} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 shadow-lg">
                    <div className="absolute top-4 right-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteCard(card._id)} className="text-white/50 hover:text-red-400">
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="text-xs text-gray-400">Debit/Credit</span>
                      <div className="italic font-bold text-xl tracking-tighter opacity-80">{card.brand || 'CARD'}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-3 mb-2 text-lg tracking-widest font-mono">
                          <span>****</span><span>****</span><span>****</span><span>{card.last4Digits}</span>
                        </div>
                        <div className="flex gap-6 text-xs text-gray-400">
                          <div>
                            <span className="block text-[10px] uppercase">Card Holder</span>
                            <span className="text-white font-medium uppercase">{card.cardHolder}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase">Expires</span>
                            <span className="text-white font-medium">{card.expiry}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!user?.paymentMethods || user.paymentMethods.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No cards saved.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {activeTab === 'orders' && (
          /* Orders Section */
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Order History</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Review and track your previous purchases.</p>
            </div>

            {ordersLoading ? (
               <div className="flex flex-col gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>)}
               </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                           <img src={order.items[0]?.product?.image} className="w-full h-full object-contain mix-blend-multiply" alt="Order" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                            {order.items.length === 1 ? order.items[0]?.product?.name : `${order.items[0]?.product?.name} + ${order.items.length - 1} more`}
                          </h4>
                          <p className="text-sm text-gray-500">Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-2">
                         <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-gray-900 dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {order.orderStatus}
                            </span>
                         </div>
                         <button 
                           onClick={() => {
                             setSelectedOrder(order);
                             setShowOrderDetails(true);
                           }}
                           className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                         >
                           Track Order <span className="material-icons text-sm">arrow_forward</span>
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <span className="material-icons text-gray-300 text-6xl mb-4">shopping_cart_checkout</span>
                <p className="text-gray-500 dark:text-gray-400 font-medium">You haven't placed any orders yet.</p>
                <button onClick={() => window.location.href = '#/'} className="mt-4 text-primary font-bold hover:underline">Start Shopping</button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value="Home" defaultChecked={editingAddress?.type === 'Home' || !editingAddress?.type} />
                      <span className="text-gray-700 dark:text-gray-300">Home</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value="Work" defaultChecked={editingAddress?.type === 'Work'} />
                      <span className="text-gray-700 dark:text-gray-300">Work</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value="Other" defaultChecked={editingAddress?.type === 'Other'} />
                      <span className="text-gray-700 dark:text-gray-300">Other</span>
                    </label>
                  </div>
                </div>
                <input
                  name="street"
                  placeholder="Street Address"
                  required
                  defaultValue={editingAddress?.street}
                  className="col-span-2 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  name="city"
                  placeholder="City"
                  required
                  defaultValue={editingAddress?.city}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  name="state"
                  placeholder="State"
                  required
                  defaultValue={editingAddress?.state}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  name="zipCode"
                  placeholder="ZIP Code"
                  required
                  defaultValue={editingAddress?.zip || editingAddress?.zipCode}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  name="country"
                  placeholder="Country"
                  required
                  defaultValue={editingAddress?.country}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  required
                  defaultValue={editingAddress?.phone}
                  className="col-span-2 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Card</h2>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <input
                  name="number"
                  placeholder="Card Number"
                  maxLength={19}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length > 12 && !luhnCheck(val)) {
                      e.target.setCustomValidity("Invalid Card Number");
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                />
              </div>
              <input name="holder" placeholder="Card Holder Name" required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input name="expiry" placeholder="MM/YY" required className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input name="cvc" placeholder="CVC" required maxLength={4} className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowCardModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Track Your Order</h2>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">ID: #{selectedOrder._id}</p>
                </div>
                <button onClick={() => setShowOrderDetails(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <span className="material-icons-round">close</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Delivery Progress</h3>
                       <OrderTracking 
                         steps={selectedOrder.trackingHistory || []} 
                         currentStatus={selectedOrder.orderStatus} 
                       />
                    </div>
                    
                    <div className="space-y-8">
                       <div>
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Item Details</h3>
                          <div className="space-y-4">
                             {selectedOrder.items.map((item: any, idx: number) => (
                               <div key={idx} className="flex gap-4 items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                  <img src={item.product?.image} className="w-12 h-12 object-contain mix-blend-multiply" alt="product" />
                                  <div className="flex-1 min-w-0">
                                     <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.product?.name}</p>
                                     <p className="text-xs text-gray-500">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-inner">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Order Summary</h3>
                          <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span className="text-slate-400">Subtotal</span>
                                <span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-400">Shipping</span>
                                <span className="text-emerald-400 font-bold">FREE</span>
                             </div>
                             <div className="pt-4 border-t border-slate-700 flex justify-between font-black text-lg">
                                <span>Total Amount</span>
                                <span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                       <span className="material-icons text-blue-600">headset_mic</span>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-900 dark:text-white">Need help with this order?</p>
                       <p className="text-[10px] text-gray-500">Our customer support is available 24/7</p>
                    </div>
                 </div>
                 <button className="w-full md:w-auto px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                    Contact Support
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;