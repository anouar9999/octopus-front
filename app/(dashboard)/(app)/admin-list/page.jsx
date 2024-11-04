"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, Phone, User, Plus, X, Briefcase, Lock, UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  fullname: yup.string().required('Full name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  role: yup.string().required('Role is required'),
  phone: yup.string().matches(/^[0-9]+$/, "Must be only digits").min(10, 'Phone number must be at least 10 digits'),
});

const FormField = ({ icon: Icon, label, error, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      <Icon size={16} className="text-gray-500" />
      {label}
    </label>
    <input 
      className={`w-full px-4 py-2 border rounded-lg ${error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'} focus:outline-none focus:ring-2`}
      {...props}
    />
    {error && (
      <p className="text-red-500 text-xs flex items-center gap-1">
        <AlertCircle size={12} />
        {error.message}
      </p>
    )}
  </div>
);

const AddClientModal = ({ isOpen, onClose, onAddClient }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      fullname: '',
      email: '',
      role: '',
      phone: '',
      password: '',
      is_admin: 'true'
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, data);
      onAddClient(response.data);
      alert('New admin user has been added successfully');
      onClose();
      reset();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add new admin user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-semibold">Add New Admin</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <FormField
                icon={User}
                label="Username"
                placeholder="Enter username"
                {...register('username')}
                error={errors.username}
              />
              <FormField
                icon={User}
                label="Full Name"
                placeholder="Enter full name"
                {...register('fullname')}
                error={errors.fullname}
              />
              <FormField
                icon={Mail}
                label="Email"
                type="email"
                placeholder="Enter email"
                {...register('email')}
                error={errors.email}
              />
              <FormField
                icon={Lock}
                label="Password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                error={errors.password}
              />
              <FormField
                icon={Briefcase}
                label="Role"
                placeholder="Enter role"
                {...register('role')}
                error={errors.role}
              />
              <FormField
                icon={Phone}
                label="Phone"
                type="tel"
                placeholder="Enter phone number"
                {...register('phone')}
                error={errors.phone}
              />
            </div>
          </form>
          
          <div className="p-6 border-t bg-gray-50">
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus size={20} />
                  Add Admin User
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{user.username}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
             admin
            </span>
          </div>
        </div>
        {user.is_superuser== true && (
          <button
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg  group-hover:opacity-100 transition-all duration-200"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 size={16} />  
          </button>
        )}
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            <span>{user.phone}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const AdminGridView = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin-users/`);
      setAdminUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      alert("Failed to fetch admin users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = adminUsers.filter(user =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, adminUsers]);

  const handleAddClient = (newClient) => {
    setAdminUsers([...adminUsers, newClient]);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-admin/${userId}/`);
        setAdminUsers(adminUsers.filter(user => user.id !== userId));
        alert('Admin user has been deleted successfully');
      } catch (error) {
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Admin
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>No admin users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} onDelete={handleDeleteUser} />
        ))}
      </div>

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddClient={handleAddClient}
      />
    </div>
  );
};

export default AdminGridView;