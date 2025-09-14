const express = require('express');
const {
  addApplicationToSheets,
  updateApplicationInSheets,
  deleteApplicationFromSheets
} = require('../controllers/sheetsController');

const router = express.Router();

// Google Sheets routes
router.post('/add-application', addApplicationToSheets);
router.put('/update-application', updateApplicationInSheets);
router.delete('/delete-application/:id', deleteApplicationFromSheets);

module.exports = router;
