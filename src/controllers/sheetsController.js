const googleSheetsService = require('../services/googleSheetsService');

// @desc    Add application to Google Sheets
// @route   POST /api/sheets/add-application
// @access  Public
const addApplicationToSheets = async (req, res) => {
  try {
    const { application } = req.body;
    
    if (!application) {
      return res.status(400).json({
        success: false,
        error: 'Missing application data',
        message: 'Application data is required'
      });
    }
    
    const result = await googleSheetsService.addApplication(application);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Application added to Google Sheets successfully'
    });
  } catch (error) {
    console.error('Add to sheets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to add application to Google Sheets'
    });
  }
};

// @desc    Update application in Google Sheets
// @route   PUT /api/sheets/update-application
// @access  Public
const updateApplicationInSheets = async (req, res) => {
  try {
    const { application } = req.body;
    
    if (!application || !application._id) {
      return res.status(400).json({
        success: false,
        error: 'Missing application data',
        message: 'Application data with ID is required'
      });
    }
    
    const result = await googleSheetsService.updateApplication(application);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Application updated in Google Sheets successfully'
    });
  } catch (error) {
    console.error('Update in sheets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to update application in Google Sheets'
    });
  }
};

// @desc    Delete application from Google Sheets
// @route   DELETE /api/sheets/delete-application/:id
// @access  Public
const deleteApplicationFromSheets = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Missing application ID',
        message: 'Application ID is required'
      });
    }
    
    const result = await googleSheetsService.deleteApplication(id);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Application deleted from Google Sheets successfully'
    });
  } catch (error) {
    console.error('Delete from sheets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to delete application from Google Sheets'
    });
  }
};

module.exports = {
  addApplicationToSheets,
  updateApplicationInSheets,
  deleteApplicationFromSheets
};
