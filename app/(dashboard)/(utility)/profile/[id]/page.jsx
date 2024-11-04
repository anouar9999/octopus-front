"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Building2, Phone, Mail, MapPin, Users, Calendar, BarChart, Clock, KeyRound, Edit } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderSection client={client} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsSection client={client} />
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
       
        <ProjectsSection projects={client.projects} /> 
        <MembersSection members={client.members} />
   
          
        </div>
      </div>
    </div>
  );
};

const HeaderSection = ({ client }) => {
  // Calculate company metrics
  const projectsInProgress = client.projects?.filter(p => p.progress > 0 && p.progress < 100).length || 0;
  const completedProjects = client.projects?.filter(p => p.progress === 100).length || 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* Company Basic Info */}
        <div className="px-4 lg:px-8 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo with hover effect */}
              <div className="group relative">
                <div className="w-16 h-16 rounded-xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-[#0b77b7] dark:group-hover:border-blue-500">
                  <img
                    src={client.CompanyImage || '/placeholder-logo.png'}
                    alt={`${client.CompanyName} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {client.CompanyName}
                  </h1>
                  <div className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#0b77b7] dark:bg-blue-900/50 dark:text-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0b77b7] mr-1.5"></span>
                    Active Client
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                    Business
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    {client.CompanyAddress?.split(',').pop().trim()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`mailto:${client.CompanyEmail}`}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2 text-[#0b77b7]" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {client.CompanyEmail}
                </span>
              </a>
              <a
                href={`tel:${client.CompanyPhoneNumber}`}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Phone className="w-4 h-4 mr-2 text-[#0b77b7]" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {client.CompanyPhoneNumber}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-4 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <QuickStat
              icon={<Users className="w-4 h-4 text-[#0b77b7]" />}
              label="Team Members"
              value={client.members?.length || 0}
            />
            <QuickStat
              icon={<BarChart className="w-4 h-4 text-[#0b77b7]" />}
              label="Active Projects"
              value={projectsInProgress}
            />
            <QuickStat
              icon={<Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500" />}
              label="Completed"
              value={completedProjects}
            />
          </div>

      
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  </div>
);


const StatsSection = ({ client }) => {
  // Calculate total members by role
  const roleStats = client.members?.reduce((acc, member) => {
    acc[member.MemberRole] = (acc[member.MemberRole] || 0) + 1;
    return acc;
  }, {});

  // Calculate project metrics
  const projectMetrics = client.projects?.reduce((acc, project) => {
    if (project.progress === 100) acc.completed++;
    else if (project.progress > 0) acc.inProgress++;
    else acc.notStarted++;
    acc.totalProgress += project.progress;
    return acc;
  }, { completed: 0, inProgress: 0, notStarted: 0, totalProgress: 0 });

  const avgProgress = projectMetrics ? 
    Math.round(projectMetrics.totalProgress / (client.projects?.length || 1)) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Team Size */}
      <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Size</h3>
          <Users className="h-5 w-5 text-[#0b77b7]" />
        </div>
        <div className="mt-2">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {client.members?.length || 0}
          </p>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {Object.entries(roleStats || {}).map(([role, count]) => (
              <span key={role} className="inline-flex items-center mr-3">
                {role}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</h3>
          <BarChart className="h-5 w-5 text-[#0b77b7]" />
        </div>
        <div className="mt-2">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {client.projects?.length || 0}
          </p>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>In Progress</span>
              <span className="font-medium">{projectMetrics?.inProgress || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completed</span>
              <span className="font-medium">{projectMetrics?.completed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Progress</h3>
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200">
            {avgProgress}%
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#0b77b7] h-2 rounded-full transition-all duration-500"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Overall project completion rate
          </p>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest Activity</h3>
          <Clock className="h-5 w-5 text-[#0b77b7]" />
        </div>
        <div className="mt-2">
          <div className="space-y-2">
            {client.projects?.slice(0, 2).map((project, index) => (
              <div key={index} className="text-xs">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {project.title}
                </div>
                <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0b77b7]" />
                  {project.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoSection = ({ client }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
      Company Information
    </h2>
    <div className="space-y-6">
      <InfoItem
        icon={<Mail className="h-5 w-5 text-[#0b77b7]" />}
        label="Email Address"
        value={client.CompanyEmail}
      />
      <InfoItem
        icon={<Phone className="h-5 w-5 text-[#0b77b7]" />}
        label="Phone Number"
        value={client.CompanyPhoneNumber}
      />
      <InfoItem
        icon={<MapPin className="h-5 w-5 text-[#0b77b7]" />}
        label="Location"
        value={client.CompanyAddress}
      />
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const MembersSection = ({ members }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Team Members</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members?.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  </div>
);

const MemberCard = ({ member }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Get random gradient colors for avatar
  const getRandomGradient = () => {
    const gradients = [
      'from-[#0b77b7] to-blue-500',
      'from-purple-500 to-indigo-500',
      'from-emerald-500 to-teal-500',
      'from-rose-500 to-pink-500'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Get status indicator based on role
  const getRoleStyle = (role) => {
    const styles = {
      dev: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
      admin: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300' },
      manager: { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300' },
      default: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' }
    };
    return styles[role.toLowerCase()] || styles.default;
  };

  const roleStyle = getRoleStyle(member.MemberRole);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="p-4">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRandomGradient()} flex items-center justify-center shadow-sm`}>
                <span className="text-lg font-semibold text-white">
                  {member.MemberFullName.charAt(0)}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#0b77b7] transition-colors duration-200">
                {member.MemberFullName}
              </h3>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                  {member.MemberRole}
                </span>
              </div>
            </div>
          </div>

          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Contact Details */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-3">
            {/* Email */}
            <a 
              href={`mailto:${member.MemberEmail}`}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#0b77b7] dark:hover:text-blue-400 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#0b77b7]" />
              </div>
              <span className="truncate">{member.MemberEmail}</span>
            </a>

            {/* Phone */}
            <a 
              href={`tel:${member.MemberPhone}`}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#0b77b7] dark:hover:text-blue-400 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <span>{member.MemberPhone}</span>
            </a>

            {/* Password */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="font-mono">
                  {showPassword ? member.MemberPassword : '••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon 
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"} 
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

const ContactDetail = ({ icon, value }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
    {icon}
    <span>{value}</span>
  </div>
);

const ProjectsSection = ({ projects }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Projects</h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {projects?.map((project, index) => (
          <>
                    <ProjectCard key={index} project={project} />
                   


          </>
        ))}
      </div>
    </div>
  </div>
);
const ProjectCard = ({ project }) => {
  // Function to determine status color based on progress
  const getStatusColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 50) return "bg-yellow-500";
    return "bg-[#0b77b7]";
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = end - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Project stages (from database schema)
  const stages = [
    { name: "reperage", label: "Repérage" },
    { name: "maquette", label: "Maquette" },
    { name: "dessins_technique", label: "Dessins Technique" },
    { name: "simulation", label: "Simulation" },
    { name: "realisation", label: "Réalisation" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                project.progress === 100 
                  ? "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  : "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              }`}>
                {project.progress}% Complete
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </div>
          
          {project.location && (
            <a 
              href={project.location} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#0b77b7] hover:text-blue-700 dark:text-blue-400"
            >
              <MapPin className="h-4 w-4" />
              <span>View Location</span>
            </a>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-4 w-4 text-[#0b77b7]" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.start_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="h-4 w-4 text-[#0b77b7]" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(project.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Time Remaining</p>
            <span className={`text-sm font-medium ${
              getDaysRemaining(project.end_date) < 0 
                ? "text-red-600 dark:text-red-400"
                : "text-gray-900 dark:text-white"
            }`}>
              {getDaysRemaining(project.end_date)} days
            </span>
          </div>
        </div>

        {/* Project Stages */}
        <div className="flex items-center justify-between mt-4">
          {stages.map((stage, index) => {
            const isCompleted = project.stages?.find(s => s.stage === stage.name)?.completed;
            return (
              <div 
                key={stage.name}
                className="flex flex-col items-center"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? "bg-green-100 dark:bg-green-900/50"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isCompleted
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`} />
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-5">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Section Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team & Projects Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 text-red-500">
        <Icon icon="mdi:alert-circle" className="h-6 w-6" />
        <h3 className="text-lg font-medium">Error Loading Profile</h3>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {message}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default Profile;