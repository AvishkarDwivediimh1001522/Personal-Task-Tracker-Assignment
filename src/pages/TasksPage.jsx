import React, { useState, useEffect } from 'react';

// Helper component for expandable description
const ExpandableDescription = ({ description, isCard = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!description) return null;
  
  return (
    <div className={`mt-2 ${isCard ? 'text-center' : ''}`}>
      <p className={`text-gray-600 ${expanded ? '' : isCard ? 'line-clamp-1' : 'line-clamp-3'}`}>
        {description}
      </p>
      {description.length > (isCard ? 35 : 70) && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-1 cursor-pointer"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

// Helper component for priority display
const PriorityBadge = ({ priority }) => {
  const getPriorityInfo = () => {
    switch (priority) {
      case 'important':
        return { text: 'Important', icon: '★', color: 'bg-red-300 text-red-800' };
      case 'medium':
        return { text: 'Medium', icon: '●', color: 'bg-yellow-300 text-yellow-800' };
      case 'least':
        return { text: 'Low', icon: '⬇', color: 'bg-blue-300 text-blue-800' };
      default:
        return { text: 'Medium', icon: '●', color: 'bg-yellow-300 text-yellow-800' };
    }
  };

  const { text, icon, color } = getPriorityInfo();
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span className="mr-1 text-sm">{icon}</span> {text}
    </span>
  );
};

// Format short date for mobile cards
const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
  });
};

const DashboardPage = () => {
  const username = localStorage.getItem('username');
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  
  // Fixed state initialization
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);

  // Update stats when tasks change
  useEffect(() => {
    setTaskStats({
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true; // 'all' filter
  });

  // Sort tasks by creation date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleAddTask = () => {
    setCurrentTask(null);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      priority: 'medium',
      description: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Reset endDate if it becomes before startDate
    if (name === 'startDate' && formData.endDate && value > formData.endDate) {
      setFormData(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const newTask = {
      id: currentTask?.id || Date.now(),
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      priority: formData.priority,
      description: formData.description,
      completed: currentTask?.completed || false,
      createdAt: currentTask?.createdAt || new Date().toISOString()
    };
    
    if (currentTask) {
      setTasks(tasks.map(task => task.id === currentTask.id ? newTask : task));
    } else {
      setTasks([...tasks, newTask]);
    }
    
    setShowModal(false);
  };

  const handleStatusChange = (taskId, status) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: status === 'completed' } : task
    ));
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      startDate: task.startDate,
      endDate: task.endDate,
      priority: task.priority,
      description: task.description
    });
    setShowModal(true);
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year : 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-xl shadow-lg w-[80vw] h-[78vh] flex flex-col overflow-hidden"
            style={{ maxWidth: '1000px' }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800 text-center font-serif">
                Add your task to your personal task manager
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter task title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.startDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.endDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="important">Important ★</option>
                    <option value="medium">Medium ●</option>
                    <option value="least">Low ⬇</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Describe your task..."
                ></textarea>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 px-8 rounded-lg transition duration-200 cursor-pointer"
                >
                  {currentTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 cursor-pointer">
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg> */}
            <div>
              Task  deleted successfully!
            </div>
            <span className='text-lg ml-2'>&times;</span>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif md:text-4xl font-bold text-gray-800 mb-2 ">
            Welcome back, <span className="text-blue-600 max-w-[45vh] overflow-hidden text-ellipsis ">{username || 'Guest'}</span> 👋
          </h1>
          

          <p className="text-gray-500 text-lg">
            Here's what's happening with your tasks today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Tasks Card */}
          <div className="bg-blue-50 hover:bg-blue-100 cursor-pointer rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-200 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-800">{taskStats.total}</p>
              </div>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-green-50 hover:bg-green-100 cursor-pointer rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-200 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-semibold text-gray-800">{taskStats.completed}</p>
              </div>
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="bg-yellow-50 hover:bg-yellow-100 cursor-pointer rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-200 mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-semibold text-gray-800">{taskStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={handleAddTask}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 rounded-full bg-blue-100 mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Add Task</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-green-50 transition-colors">
              <div className="p-3 rounded-full bg-green-100 mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Edit Tasks</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="p-3 rounded-full bg-purple-100 mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">View All</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-red-50 transition-colors">
              <div className="p-3 rounded-full bg-red-100 mb-2">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Delete</span>
            </button>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Tasks</h2>
            <span className="text-sm text-gray-500">
              {taskStats.completed} completed • {taskStats.pending} pending
            </span>
          </div>
          
          {/* Filter Buttons */}
          {/* <div><p>Sort the Tasks.</p></div> */}
          {/* <div className="flex space-x-4 mb-4 ">
            <button 
              onClick={() => setCurrentFilter('all')}
              className={`sm:px-4 py-2 px-2 cursor-pointer rounded-lg transition-colors ${
                currentFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Tasks
            </button>
            <button 
              onClick={() => setCurrentFilter('completed')}
              className={`sm:px-4 px-1 py-2 cursor-pointer rounded-lg transition-colors ${
                currentFilter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setCurrentFilter('pending')}
              className={`sm:px-4 px-2 py-2 cursor-pointer rounded-lg transition-colors ${
                currentFilter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
          </div> */}

          <div className="flex space-x-4 max-[460px]:space-x-1 mb-4">
  <button 
    onClick={() => setCurrentFilter('all')}
    className={`sm:px-4 py-2 px-2 cursor-pointer rounded-lg transition-colors 
      max-[460px]:px-2 max-[460px]:py-1 max-[460px]:text-sm ${
      currentFilter === 'all' 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    All Tasks
  </button>
  <button 
    onClick={() => setCurrentFilter('completed')}
    className={`sm:px-4 px-2 py-2 cursor-pointer rounded-lg transition-colors 
      max-[460px]:px-2 max-[460px]:py-1 max-[460px]:text-sm ${
      currentFilter === 'completed' 
        ? 'bg-green-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    Completed
  </button>
  <button 
    onClick={() => setCurrentFilter('pending')}
    className={`sm:px-4 px-2 py-2 cursor-pointer rounded-lg transition-colors 
      max-[460px]:px-2 max-[460px]:py-1 max-[460px]:text-sm ${
      currentFilter === 'pending' 
        ? 'bg-yellow-500 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    Pending
  </button>
</div>

          
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 ">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No tasks found. Create your first task!</p>
            </div>
          ) : (
            <>
              {/* Card view for mobile screens (less than 768px) */}
              <div className="lg:hidden space-y-4 ">
                {sortedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`rounded-xl p-4 my-5 shadow-sm border transition-all duration-200 hover:shadow-md ${
                      task.completed 
                        ? 'bg-green-100 border-green-200 hover:bg-green-200' 
                        : 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200'
                    }`}
                  >
                    {/* Title and Date */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-xl font-serif text-center truncate flex-1 mr-2">
                        {task.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatShortDate(task.createdAt)}
                      </span>
                    </div>
                    
                    {/* Priority oreder */}
                    <div className="col-span-6 lg:col-span-2 text-center my-3">
                          <PriorityBadge priority={task.priority} />
                    </div>

                    {/* Checkboxes and Actions */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-300 my-4">
                      <div className="flex space-x-4">
                        <label className="inline-flex flex-col items-center">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleStatusChange(task.id, 'completed')}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="ml-1 text-xs">Completed</span>
                        </label>
                        <label className="inline-flex flex-col items-center">
                          <input
                            type="checkbox"
                            checked={!task.completed}
                            onChange={() => handleStatusChange(task.id, 'pending')}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="ml-1 text-xs">Pending</span>
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                          title="Edit task"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                          title="Delete task"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className=''>
                      <ExpandableDescription description={task.description} isCard />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Table view for medium screens and above */}
              <div className="hidden  max-h-170 overflow-y-auto lg:block ">
                {/* Table header */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-200 hover:bg-gray-400 rounded-lg">
                  <div className="col-span-4 font-medium text-gray-700">Title</div>
                  <div className="col-span-2 font-medium text-gray-700">Status</div>
                  <div className="col-span-2 font-medium text-gray-700">Priority</div>
                  <div className="col-span-2 font-medium text-gray-700">Date Added</div>
                  <div className="col-span-2 font-medium text-gray-700">Actions</div>
                </div>
                
                <div className="space-y-4 mt-4 min-w-[1020px] overflow-x-auto">
                  {sortedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                        task.completed 
                          ? 'bg-green-100 border-green-200 hover:bg-green-200' 
                          : 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200'
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-4 p-4 items-center">
                        {/* Task Title */}
                        <div className="col-span-12 md:col-span-4">
                          <h3 className="font-medium font-serif text-xl text-gray-900 truncate">{task.title}</h3>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-12 lg:col-span-2">
                          <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleStatusChange(task.id, 'completed')}
                                className="h-4 w-4 text-blue-600 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Done</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={!task.completed}
                                onChange={() => handleStatusChange(task.id, 'pending')}
                                className="h-4 w-4 text-blue-600 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Pending</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Priority */}
                        <div className="col-span-6 lg:col-span-2">
                          <PriorityBadge priority={task.priority} />
                        </div>
                        
                        {/* Date */}
                        <div className="col-span-6 lg:col-span-2">
                          <p className="text-sm text-gray-500">
                            {formatDate(task.createdAt)}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-12 lg:col-span-2">
                          <div className="flex space-x-2 justify-end lg:justify-start">
                            <button
                              onClick={() => handleEdit(task)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                              title="Edit task"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                              title="Delete task"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="px-4 pb-4 ">
                        <ExpandableDescription description={task.description} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;