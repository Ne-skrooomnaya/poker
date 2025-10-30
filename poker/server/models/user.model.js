const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  telegramUsername: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true, // Password is now required
  },
  telegramId: {
    type: Number,
    unique: true,
    sparse: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  salt: {  // Add salt field
    type: String,
    required: true
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // STOP HASHING HERE!
    try {
      const salt = await bcrypt.genSalt(10);
      this.salt = salt;
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});


// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
