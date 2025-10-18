import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { taskAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    count: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    dueDate: ''
  });

  // Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data.data); // Fix: tasks are in response.data.data
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
        count: response.data.count
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (search) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleStatusFilterChange = (status) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePriorityFilterChange = (priority) => {
    setFilters({ ...filters, priority, page: 1 });
  };

  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy, page: 1 });
  };

  const handleSortOrderChange = (sortOrder) => {
    setFilters({ ...filters, sortOrder, page: 1 });
  };

  const handleDueDateFilterChange = (dueDate) => {
    setFilters({ ...filters, dueDate, page: 1 });
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSaved = () => {
    setShowTaskForm(false);
    const isEditing = editingTask !== null;
    setEditingTask(null);
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    setPagination(prev => ({
      ...prev,
      total: prev.total - 1,
      count: prev.count - 1
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.pages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm rounded-xl border transition-all duration-200 cursor-pointer ${
            i === pagination.page
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
              <p className="text-gray-600">Organize and track your tasks efficiently</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
              
              {/* Create Task Button */}
              <button 
                onClick={handleCreateTask}
                className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white text-sm font-medium rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 btn-hover cursor-pointer shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                Create Task
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <TaskFilters
            searchTerm={filters.search}
            onSearchChange={handleSearchChange}
            statusFilter={filters.status}
            onStatusFilterChange={handleStatusFilterChange}
            priorityFilter={filters.priority}
            onPriorityFilterChange={handlePriorityFilterChange}
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            sortOrder={filters.sortOrder}
            onSortOrderChange={handleSortOrderChange}
            dueDateFilter={filters.dueDate}
            onDueDateFilterChange={handleDueDateFilterChange}
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Task Info */}
              <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-4 animate-fade-in">
                <p className="text-sm text-blue-700 font-medium">
                  Showing {pagination.count} of {pagination.total} tasks
                  {filters.search && ` matching "${filters.search}"`}
                  {filters.status && ` with status "${filters.status}"`}
                  {filters.priority && ` with priority "${filters.priority}"`}
                </p>
              </div>

              {tasks.length > 0 ? (
                <>
                  {/* Task Grid/List */}
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
                      : 'space-y-4'
                  } animate-fade-in`}>
                    {tasks.map((task, index) => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        viewMode={viewMode}
                        onTaskUpdated={handleTaskUpdated}
                        onTaskDeleted={handleTaskDeleted}
                        onEditTask={handleEditTask}
                        index={index}
                      />
                    ))}
                  </div>
                  {renderPagination()}
                </>
              ) : (
                /* Empty State */
                <div className="text-center py-16 animate-fade-in">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                      <FileText size={64} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">No tasks found</h3>
                    <p className="text-gray-500 mb-8 text-lg">
                      {filters.search || filters.status || filters.priority
                        ? 'Try adjusting your filters or create a new task'
                        : 'Get started by creating your first task'}
                    </p>
                    <button 
                      onClick={handleCreateTask}
                      className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white text-sm font-medium rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 btn-hover cursor-pointer"
                    >
                      <Plus size={18} className="mr-2" />
                      Create Your First Task
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskSaved}
          onTaskUpdated={handleTaskSaved}
          task={editingTask}
        />
      </div>
    </div>
  );
};

export default TaskList;