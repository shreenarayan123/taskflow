import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Search, 
  Calendar,
  Flag,
  CheckCircle,
  Clock,
  AlertTriangle,
  SortAsc,
  SortDesc
} from 'lucide-react';

const TaskFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  dueDateFilter,
  onDueDateFilterChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    status: statusFilter,
    priority: priorityFilter,
    dueDate: dueDateFilter,
    sort: sortBy,
    order: sortOrder
  });

  const statusOptions = [
    { value: '', label: 'All Status', icon: null },
    { value: 'Todo', label: 'Todo', icon: <Clock size={16} className="text-yellow-500" /> },
    { value: 'In Progress', label: 'In Progress', icon: <AlertTriangle size={16} className="text-blue-500" /> },
    { value: 'Completed', label: 'Completed', icon: <CheckCircle size={16} className="text-green-500" /> }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities', icon: null },
    { value: 'Low', label: 'Low', icon: <Flag size={16} className="text-gray-500" /> },
    { value: 'Medium', label: 'Medium', icon: <Flag size={16} className="text-orange-500" /> },
    { value: 'High', label: 'High', icon: <Flag size={16} className="text-red-500" /> }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
  ];

  const dueDateOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'today', label: 'Due Today' },
    { value: 'tomorrow', label: 'Due Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'no_due_date', label: 'No Due Date' }
  ];

  const applyFilters = () => {
    onStatusFilterChange(tempFilters.status);
    onPriorityFilterChange(tempFilters.priority);
    onDueDateFilterChange(tempFilters.dueDate);
    onSortChange(tempFilters.sort);
    onSortOrderChange(tempFilters.order);
    setShowAdvanced(false);
  };

  const resetFilters = () => {
    const resetState = {
      status: '',
      priority: '',
      dueDate: '',
      sort: 'createdAt',
      order: 'desc'
    };
    setTempFilters(resetState);
    onSearchChange('');
    onStatusFilterChange('');
    onPriorityFilterChange('');
    onDueDateFilterChange('');
    onSortChange('createdAt');
    onSortOrderChange('desc');
  };

  const hasActiveFilters = searchTerm || statusFilter || priorityFilter || dueDateFilter || sortBy !== 'createdAt' || sortOrder !== 'desc';

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter) count++;
    if (priorityFilter) count++;
    if (dueDateFilter) count++;
    if (sortBy !== 'createdAt' || sortOrder !== 'desc') count++;
    return count;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex space-x-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  statusFilter === option.value
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            showAdvanced || hasActiveFilters
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
          }`}
        >
          <Filter size={16} />
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={tempFilters.priority}
                onChange={(e) => setTempFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <select
                value={tempFilters.dueDate}
                onChange={(e) => setTempFilters(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                {dueDateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={tempFilters.sort}
                onChange={(e) => setTempFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTempFilters(prev => ({ ...prev, order: 'asc' }))}
                  className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    tempFilters.order === 'asc'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  <SortAsc size={16} />
                  <span>Asc</span>
                </button>
                <button
                  onClick={() => setTempFilters(prev => ({ ...prev, order: 'desc' }))}
                  className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    tempFilters.order === 'desc'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  <SortDesc size={16} />
                  <span>Desc</span>
                </button>
              </div>
            </div>
          </div>

          {/* Apply/Cancel Buttons */}
          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setTempFilters({
                  status: statusFilter,
                  priority: priorityFilter,
                  dueDate: dueDateFilter,
                  sort: sortBy,
                  order: sortOrder
                });
                setShowAdvanced(false);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showAdvanced && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          
          {searchTerm && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              <Search size={12} />
              <span>"{searchTerm}"</span>
              <button onClick={() => onSearchChange('')} className="cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}
          
          {statusFilter && (
            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              <span>Status: {statusFilter}</span>
              <button onClick={() => onStatusFilterChange('')} className="cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}
          
          {priorityFilter && (
            <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              <span>Priority: {priorityFilter}</span>
              <button onClick={() => onPriorityFilterChange('')} className="cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}
          
          {dueDateFilter && (
            <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              <Calendar size={12} />
              <span>{dueDateOptions.find(opt => opt.value === dueDateFilter)?.label}</span>
              <button onClick={() => onDueDateFilterChange('')} className="cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}
          
          {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
            <div className="flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              <span>Sort: {sortOptions.find(opt => opt.value === sortBy)?.label} ({sortOrder})</span>
              <button onClick={() => { onSortChange('createdAt'); onSortOrderChange('desc'); }} className="cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;