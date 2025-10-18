const Task = require('../models/Task');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', dueDate } = req.query;
    
    // Build filter object
    let filter = { userId: req.user.id };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Handle due date filters
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      switch (dueDate) {
        case 'today':
          filter.dueDate = {
            $gte: today,
            $lt: tomorrow
          };
          break;
        case 'tomorrow':
          const dayAfterTomorrow = new Date(tomorrow);
          dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
          filter.dueDate = {
            $gte: tomorrow,
            $lt: dayAfterTomorrow
          };
          break;
        case 'this_week':
          filter.dueDate = {
            $gte: today,
            $lt: nextWeek
          };
          break;
        case 'overdue':
          filter.dueDate = { $lt: today };
          filter.status = { $ne: 'Completed' };
          break;
        case 'no_due_date':
          filter.dueDate = { $exists: false };
          break;
      }
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get total tasks count
    const total = await Task.countDocuments({ userId });

    // Get completed tasks count
    const completed = await Task.countDocuments({ 
      userId, 
      status: 'Completed' 
    });

    // Get in progress tasks count
    const inProgress = await Task.countDocuments({ 
      userId, 
      status: 'In Progress' 
    });

    // Get todo tasks count
    const todo = await Task.countDocuments({ 
      userId, 
      status: 'Todo' 
    });

    // Get overdue tasks count (tasks with due date in the past and not completed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = await Task.countDocuments({ 
      userId, 
      dueDate: { $lt: today },
      status: { $ne: 'Completed' }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        inProgress,
        todo,
        overdue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};