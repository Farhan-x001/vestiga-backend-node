const express = require('express');
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  deleteMultipleApplications
} = require('../controllers/applicationController');

const router = express.Router();

// Application routes
router.route('/')
  .post(createApplication)
  .get(getAllApplications);

router.route('/bulk')
  .delete(deleteMultipleApplications);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
