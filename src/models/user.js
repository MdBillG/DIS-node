const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },

  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },

  fatherName: {
    type: String,
    trim: true,

  // If true, user must change password on next login
  mustChangePassword: {
    type: Boolean,
    default: false
  },
    default: ''
  },

  motherName: {
    type: String,
    trim: true,
    default: ''
  },

  husbandName: {
    type: String,
    trim: true,
    default: ''
  },

  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },

  dateOfJoining: {
    type: Date,
    default: Date.now
  },

  aadharNumber: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{12}$/, 'Aadhar number must be a 12-digit number'],
    trim: true
  },

  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },

  profilePic: {
    type: String,
    default: '', // URL of uploaded profile image
  },

  address: {
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    postalCode: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'India' }
  },

  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'User role is required']
  },

  roleName: {
    type: String,
    required: [true, 'User role name is required']
  },
    // Assigned batch for teacher (single) and student (array)
    assignedBatch: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    }],

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
},
{
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// 🔒 Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🧠 Compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
