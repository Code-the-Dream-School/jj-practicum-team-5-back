const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  first: {
    type: String,
    required: [true, 'Please provide first name'],
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [25, 'First name cannot exceed 25 characters'],
    trim: true,
    match: [/^[A-Za-z]+$/, 'First name can only contain letters']
  },
  last: {
    type: String,
    required: [true, 'Please provide last name'],
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [25, 'Last name cannot exceed 25 characters'],
    trim: true,
    match: [/^[A-Za-z]+$/, 'Last name can only contain letters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [254, 'Email cannot exceed 254 characters'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [10, 'Password must be at least 10 characters long'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{10,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ],
  }
  
},
{
  timestamps: true 
})

userSchema.pre('save', async function (next){
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash

    next()
})

userSchema.methods.createJWT = function () {
    
  return jwt.sign(
    { userId: this._id, name: `${this.first} ${this.last}` },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
      algorithm: 'HS256',
    }
  );
};


userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}


const userAuth = mongoose.model('logindatas', userSchema)

module.exports = userAuth;