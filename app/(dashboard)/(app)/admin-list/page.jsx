"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, Phone, User, Plus, X, Briefcase, Lock, UserPlus, Trash2, MoreVertical } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  fullname: yup.string().required('Full name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  role: yup.string().required('role is required'),
  phone: yup.string().matches(/^[0-9]+$/, "Must be only digits").min(10, 'Phone number must be at least 10 digits'),
});
const AddClientModal = ({ isOpen, onClose, onAddClient }) => {
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
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, data);
      onAddClient(response.data);
      onClose();
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error adding client:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 z-[9999999] w-full sm:w-1/3 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 bg-black-500 text-white">
          <h2 className="text-xl text-white font-semibold">Add New Client</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6">
          {[
            { name: 'username', icon: User, label: 'Username', placeholder: 'Enter username' },
            { name: 'fullname', icon: User, label: 'Full Name', placeholder: 'Enter full name' },
            { name: 'email', icon: Mail, label: 'Email', placeholder: 'Enter email', type: 'email' },
            { name: 'password', icon: Lock, label: 'Password', placeholder: 'Enter password', type: 'password' },
            { name: 'role', icon: Briefcase, label: 'Role', placeholder: 'Enter role' },
            { name: 'phone', icon: Phone, label: 'Phone', placeholder: 'Enter phone number', type: 'tel' }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <div className="relative">
                <field.icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id={field.name}
                  type={field.type || 'text'}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className={`w-full pl-12 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none ${errors[field.name] ? 'border-red-500' : ''}`}
                />
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
              )}
            </div>
          ))}
        </form>
        <div className="p-6 border-t">
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full px-4 py-2 bg-black-500 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <UserPlus size={20} className="mr-2" />
              <span>Add Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const UserCard = ({ user, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-black-500" size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user.fullname}</h2>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
          <div className="relative">
           {user.id !==1 ? <button
              onClick={() => onDelete(user.id)}
              className="text-red-400 hover:text-gray-600"
            >
              <Trash2 size={20} />
            </button>:<></>}

          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="text-gray-400 mr-2" size={16} />
            <span className="text-gray-600">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center text-sm">
              <Phone className="text-gray-400 mr-2" size={16} />
              <span className="text-gray-600">{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminGridView = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch admin users');
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-admin/${userId}/`);
        setAdminUsers(adminUsers.filter(user => user.id !== userId));
        setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4 bg-red-100 border border-red-400 rounded">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Admin Users</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-black-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add admin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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