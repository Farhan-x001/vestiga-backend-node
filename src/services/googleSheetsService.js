const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.range = process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A:Z';
  }

  async initialize() {
    try {
      // Initialize Google Sheets API
      this.auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('✅ Google Sheets service initialized');
    } catch (error) {
      console.error('❌ Google Sheets initialization error:', error.message);
      throw error;
    }
  }

  async addApplication(application) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const values = [
        [
          application._id,
          application.name,
          application.idNumber,
          application.address,
          application.mobile,
          application.email,
          application.photo || 'No photo',
          application.paymentStatus,
          application.createdAt ? new Date(application.createdAt).toLocaleString() : new Date().toLocaleString()
        ]
      ];

      const request = {
        spreadsheetId: this.spreadsheetId,
        range: this.range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: values
        }
      };

      const response = await this.sheets.spreadsheets.values.append(request);
      console.log('✅ Application added to Google Sheets:', response.data.updates.updatedRange);
      
      return {
        success: true,
        message: 'Application added to Google Sheets successfully',
        range: response.data.updates.updatedRange
      };
    } catch (error) {
      console.error('❌ Google Sheets add application error:', error.message);
      throw error;
    }
  }

  async updateApplication(application) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      // First, find the row with the application ID
      const searchRange = `${this.range.split('!')[0]}!A:A`;
      const searchResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: searchRange
      });

      const rows = searchResponse.data.values || [];
      let rowIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === application._id.toString()) {
          rowIndex = i + 1; // Google Sheets is 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        throw new Error('Application not found in Google Sheets');
      }

      const values = [
        [
          application._id,
          application.name,
          application.idNumber,
          application.address,
          application.mobile,
          application.email,
          application.photo || 'No photo',
          application.paymentStatus,
          application.updatedAt ? new Date(application.updatedAt).toLocaleString() : new Date().toLocaleString()
        ]
      ];

      const updateRange = `${this.range.split('!')[0]}!A${rowIndex}:I${rowIndex}`;
      const request = {
        spreadsheetId: this.spreadsheetId,
        range: updateRange,
        valueInputOption: 'RAW',
        resource: {
          values: values
        }
      };

      const response = await this.sheets.spreadsheets.values.update(request);
      console.log('✅ Application updated in Google Sheets:', response.data.updatedRange);
      
      return {
        success: true,
        message: 'Application updated in Google Sheets successfully',
        range: response.data.updatedRange
      };
    } catch (error) {
      console.error('❌ Google Sheets update application error:', error.message);
      throw error;
    }
  }

  async deleteApplication(applicationId) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      // Find the row with the application ID
      const searchRange = `${this.range.split('!')[0]}!A:A`;
      const searchResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: searchRange
      });

      const rows = searchResponse.data.values || [];
      let rowIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === applicationId) {
          rowIndex = i + 1; // Google Sheets is 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        console.log('Application not found in Google Sheets, skipping deletion');
        return {
          success: true,
          message: 'Application not found in Google Sheets'
        };
      }

      // Delete the row
      const request = {
        spreadsheetId: this.spreadsheetId,
        range: `${this.range.split('!')[0]}!${rowIndex}:${rowIndex}`,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      };

      await this.sheets.spreadsheets.batchUpdate(request);
      console.log('✅ Application deleted from Google Sheets');
      
      return {
        success: true,
        message: 'Application deleted from Google Sheets successfully'
      };
    } catch (error) {
      console.error('❌ Google Sheets delete application error:', error.message);
      throw error;
    }
  }
}

module.exports = new GoogleSheetsService();
