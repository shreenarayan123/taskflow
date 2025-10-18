import React from 'react';
import { 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Calendar,
  User,
  Flag
} from 'lucide-react';
import { taskAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TaskItem = ({ task, viewMode, onTaskUpdated, onTaskDeleted, onEditTask, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const handleStatusChange = async (newStatus) => {
    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
      onTaskUpdated();
      toast.success(`Task marked as ${newStatus.toLowerCase()}!`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    toast((t) => (
      <div className="flex items-center">
        <div className="flex-1">
          <p className="font-medium text-gray-900">Delete Task</p>
          <p className="text-sm text-gray-600">Are you sure you want to delete "{task.title}"?</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await taskAPI.deleteTask(task._id);
                onTaskDeleted(task._id);
                toast.success('Task deleted successfully!');
              } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task');
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      style: {
        background: '#fff',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: '0.75rem',
        padding: '1rem',
        maxWidth: '400px',
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'todo':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <AlertTriangle size={14} className="text-red-600" />;
      case 'medium':
        return <Flag size={14} className="text-orange-600" />;
      case 'low':
      default:
        return <Flag size={14} className="text-gray-600" />;
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in card-hover"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
                {isOverdue && (
                  <div className="flex items-center space-x-1 text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    <AlertTriangle size={14} />
                    <span className="text-xs font-medium">Overdue</span>
                  </div>
                )}
              </div>
              
              {task.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Created {formatDate(task.createdAt)}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-4">
              <div className="flex flex-col space-y-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1">{task.priority}</span>
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit task"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {task.status !== 'Todo' && (
                <button
                  onClick={() => handleStatusChange('Todo')}
                  className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors cursor-pointer"
                >
                  Mark as Todo
                </button>
              )}
              {task.status !== 'In Progress' && (
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors cursor-pointer"
                >
                  In Progress
                </button>
              )}
              {task.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition-colors cursor-pointer"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Card)
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in card-hover"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
              {isOverdue && (
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
              )}
            </div>
            {task.description && (
              <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
            )}
          </div>
          
          <div className="flex space-x-1 ml-3">
            <button
              onClick={() => onEditTask(task)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit task"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDeleteTask}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            <span className="ml-1">{task.priority}</span>
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-2 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar size={14} />
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center space-x-2">
              <Clock size={14} />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                Due {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Status Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {task.status !== 'Todo' && (
              <button
                onClick={() => handleStatusChange('Todo')}
                className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors cursor-pointer"
              >
                Todo
              </button>
            )}
            {task.status !== 'In Progress' && (
              <button
                onClick={() => handleStatusChange('In Progress')}
                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors cursor-pointer"
              >
                In Progress
              </button>
            )}
            {task.status !== 'Completed' && (
              <button
                onClick={() => handleStatusChange('Completed')}
                className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition-colors cursor-pointer"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;