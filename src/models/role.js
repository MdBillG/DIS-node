const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Role name is required'],
    lowercase: true,
    trim: true,
    minlength: [2, 'Role name must be at least 2 characters long'],
    maxlength: [50, 'Role name cannot exceed 50 characters']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    minlength: [2, 'Display name must be at least 2 characters long'],
    maxlength: [100, 'Display name cannot exceed 100 characters']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Permissions are grouped by module
  permissions: {
    batch: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      ownOnly: { type: Boolean, default: false }, // e.g., teachers to their own batch
    },
    student: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      ownOnly: { type: Boolean, default: false }, // class teacher access only
      promoteOrRetain: { type: Boolean, default: false }, // 👈 NEW
    },
    attendance: {
      mark: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      ownOnly: { type: Boolean, default: false },
    },
    grades: {
      assign: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      ownOnly: { type: Boolean, default: false },
    },
    announcements: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    timetable: {
      manage: { type: Boolean, default: false },
      view: { type: Boolean, default: false },
    },
    roleManagement: {
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    userManagement: {
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      deactivate: { type: Boolean, default: false },
    },
  },

  isSystemRole: {
    type: Boolean,
    default: false, // true = cannot be deleted (e.g., admin)
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Role', roleSchema);
