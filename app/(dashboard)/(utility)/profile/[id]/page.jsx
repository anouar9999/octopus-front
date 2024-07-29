"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

const Profile = ({ params: { id } }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async (companyId) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}/`
        );
        setClient(response.data);
      } catch (error) {
        console.error("Error fetching company details:", error.message);
        setError("Failed to load company details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails(id);
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!client) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <HeaderSection client={client} />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MembersSection members={client.members} />
        </div>
        <div>
          <InfoSection client={client} />
        </div>
      </div>
      <ProjectsSection projects={client.projects} />
    </div>
  );
};

const HeaderSection = ({ client }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <div className="h-32 bg-gradient-to-r from-black-500 to-black-600"></div>
    <div className="px-6 py-4 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
      <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg -mt-12 overflow-hidden">
        <img src={client.CompanyImage || '/placeholder-logo.png'} alt={`${client.CompanyName} logo`} className="w-full h-full object-cover" />
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.CompanyName}</h1>
        <p className="text-sm text-white dark:text-gray-300">description</p>
      </div>
    </div>
  </div>
);

const MembersSection = ({ members }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
      <span className="text-sm text-gray-500 dark:text-gray-400">{members?.length || 0} members</span>
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {members?.map((member, index) => (
        <MemberCard key={index} member={member} />
      ))}
    </div>
  </div>
);

const MemberCard = ({ member }) => (
  <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <Icon icon="mdi:account" className="text-2xl text-indigo-600 dark:text-indigo-300" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.MemberFullName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.MemberRole}</p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <ContactInfo icon="mdi:phone" value={member.MemberPhone} />
      <ContactInfo icon="mdi:email" value={member.MemberEmail} />
      <ContactInfo icon="mdi:password" value={member.MemberPassword} />
    </div>
  </div>
);

const ContactInfo = ({ icon, value }) => (
  <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-full px-3 py-1">
    <Icon icon={icon} className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300" />
    <span className="text-xs text-gray-700 dark:text-gray-200">{value}</span>
  </div>
);

const InfoSection = ({ client }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Information</h2>
    </div>
    <div className="px-6 py-4 space-y-4">
      <InfoItem icon="mdi:email" label="Email" value={client.CompanyEmail} />
      <InfoItem icon="mdi:phone" label="Phone" value={client.CompanyPhoneNumber} />
      <InfoItem icon="mdi:map-marker" label="Address" value={client.CompanyAddress} />
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <Icon icon={icon} className="text-xl text-gray-600 dark:text-gray-300" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

const ProjectsSection = ({ projects }) => (
  <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
      <span className="text-sm text-gray-500 dark:text-gray-400">{projects?.length || 0} projects</span>
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out">
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
      <div className="flex justify-between items-center">
        <div>
        <span className="px-2  py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">{project.start_date}</span>

<span className="px-2 py-1 mx-2 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-blue-900 dark:text-red-200">{project.end_date}</span>

        </div>
     <span className="text-xs text-gray-500 dark:text-gray-400"> <span className="text-xs font-semibold bg-black" > Progress  : </span>{project.progress}%</span>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
    </div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  </div>
);

export default Profile;