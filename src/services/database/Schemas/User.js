import mongoose from 'mongoose';

const User = new mongoose.Schema({
  username: String,
  userId: String,
  messageId: String,
  level: Number,
  name: String,
  hasGroup: { type: Boolean, default: false },
});

export default User;
