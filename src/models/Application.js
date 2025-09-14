const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  idNumber: {
    type: String,
    required: [true, 'ID Number is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'ID Number cannot exceed 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid mobile number'],
    maxlength: [20, 'Mobile number cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  photo: {
    type: String,
    default: null,
    maxlength: [10000000, 'Photo data cannot exceed 10MB']
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'DONE'],
    default: 'PENDING'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
applicationSchema.index({ email: 1 });
applicationSchema.index({ mobile: 1 });
applicationSchema.index({ paymentStatus: 1 });
applicationSchema.index({ createdAt: -1 });

// Virtual for formatted creation date
applicationSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  // Ensure payment status is uppercase
  if (this.paymentStatus) {
    this.paymentStatus = this.paymentStatus.toUpperCase();
  }
  
  // Handle empty photo strings
  if (this.photo === '') {
    this.photo = null;
  }
  
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
