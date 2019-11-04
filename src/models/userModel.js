import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
}, {
    collection: 'user'
});

userSchema.pre('save', function() {
  const hashedPassword = bcrypt.hashSync(this.password, 12);
  this.password = hashedPassword;
});

const User = mongoose.model('User', userSchema);

export default User;