const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Role name is required'],
    lowercase: true,
    enum: {
      values: ['admin', 'teacher', 'student', 'principal'],
      message: 'Role name must be one of: admin, teacher, student, principal'
    },
    trim: true,
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

  // 👇 canLogin is true for admin, principal, teacher only
  canLogin: {
    type: Boolean,
    default: function () {
      return ['admin', 'teacher', 'principal'].includes(this.name);
    }
  },

  // 👇 Login credentials (only for login-enabled roles)
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true, // allows multiple nulls
    validate: {
      validator: function (val) {
        // only validate if role can login
        if (this.canLogin && !val) return false;
        if (val && !/.+@.+\..+/.test(val)) return false;
        return true;
      },
      message: 'A valid email is required for this role'
    }
  },

  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [128, 'Password cannot exceed 128 characters'],
    select: false,
    validate: {
      validator: function (val) {
        if (this.canLogin && !val) return false;
        return true;
      },
      message: 'Password is required for this role'
    }
  },

  // Permissions grouped by module
  permissions: {
    batch: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      ownOnly: { type: Boolean, default: false },
    },
    student: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      ownOnly: { type: Boolean, default: false },
      promoteOrRetain: { type: Boolean, default: false },
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
    default: false,
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

// 🔒 Hash password before saving (only for login-enabled roles)
roleSchema.pre('save', async function (next) {
  if (!this.canLogin || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧠 Compare passwords (for login)
roleSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🕒 Update timestamp
roleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Role', roleSchema);
