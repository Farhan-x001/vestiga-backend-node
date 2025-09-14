const Application = require('../models/Application');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Public
const createApplication = async (req, res) => {
  try {
    const application = new Application(req.body);
    const savedApplication = await application.save();
    
    res.status(201).json({
      success: true,
      data: savedApplication._id,
      message: 'Application created successfully'
    });
  } catch (error) {
    console.error('Create application error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate Entry',
        message: 'An application with this ID number already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to create application'
    });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Public
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch applications'
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Public
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Invalid application ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch application'
    });
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Public
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application,
      message: 'Application updated successfully'
    });
  } catch (error) {
    console.error('Update application error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Invalid application ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to update application'
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Public
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Invalid application ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to delete application'
    });
  }
};

// @desc    Delete multiple applications
// @route   DELETE /api/applications/bulk
// @access  Public
const deleteMultipleApplications = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Request',
        message: 'Please provide an array of application IDs to delete'
      });
    }
    
    const result = await Application.deleteMany({
      _id: { $in: ids }
    });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} application(s) deleted successfully`
    });
  } catch (error) {
    console.error('Delete multiple applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to delete applications'
    });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  deleteMultipleApplications
};
