import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Plus,
  BarChart3,
  Filter,
  ArrowUp,
  ArrowDown,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { taskAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, recentResponse] = await Promise.all([
        taskAPI.getTaskStats(),
        taskAPI.getTasks({ limit: 5, sort: 'createdAt', order: 'desc' })
      ]);
      
      setStats(statsResponse.data.data); 
      setRecentTasks(recentResponse.data.data); 
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening with your tasks today
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button 
                onClick={() => navigate('/tasks')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 btn-hover cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </button>
              <button 
                onClick={() => navigate('/tasks')}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 btn-hover cursor-pointer shadow-md border border-gray-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={BarChart3}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={stats.total > 0 ? { value: 0, isUp: true } : null}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={stats.total > 0 ? { value: 0, isUp: true } : null}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            trend={stats.total > 0 ? { value: 0, isUp: true } : null}
          />
          <StatCard
            title="Todo"
            value={stats.todo}
            icon={Calendar}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend={stats.total > 0 ? { value: 0, isUp: true } : null}
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="bg-gradient-to-r from-red-500 to-red-600"
            trend={stats.total > 0 ? { value: 0, isUp: false } : null}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-in-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Recent Tasks</h3>
                </div>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  View all →
                </button>
              </div>
              
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task, index) => (
                    <TaskCard key={task._id} task={task} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h4>
                  <p className="text-gray-500 mb-4">Create your first task to get started</p>
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="space-y-6">
            {/* Completion Rate */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 animate-slide-in-right">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
              <div className="relative">
                <div className="flex items-center justify-center w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray={`${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}, 100`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: '#3b82f6'}} />
                        <stop offset="100%" style={{stopColor: '#10b981'}} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionButton
                  icon={Plus}
                  label="Create New Task"
                  onClick={() => navigate('/tasks')}
                  color="bg-blue-500 hover:bg-blue-600"
                />
                <QuickActionButton
                  icon={Filter}
                  label="Filter Tasks"
                  onClick={() => navigate('/tasks')}
                  color="bg-purple-500 hover:bg-purple-600"
                />
                <QuickActionButton
                  icon={TrendingUp}
                  label="View Analytics"
                  onClick={() => navigate('/tasks')}
                  color="bg-green-500 hover:bg-green-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 card-hover animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isUp ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ml-1 ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}%
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// TaskCard Component
const TaskCard = ({ task, index }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => navigate('/tasks')}
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

// QuickActionButton Component
const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-3 text-white rounded-lg transition-all duration-200 btn-hover cursor-pointer ${color}`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

// Helper functions (moved outside component to avoid re-creation)
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'text-green-600 bg-green-100';
    case 'in progress': return 'text-blue-600 bg-blue-100';
    case 'todo': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-orange-600 bg-orange-100';
    case 'low': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default Dashboard;