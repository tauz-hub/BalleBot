import mongoose from 'mongoose';

const Jury = new mongoose.Schema({
  name: String,
  github: String,
  avatar_url: String,
});

export default Jury;
