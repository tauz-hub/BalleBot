import mongoose from 'mongoose';

const Group = new mongoose.Schema({
  id: String,
  name: String,
  lider: String,
  liderDisc: String,
  liderGH: String,
  crew: [String],
  status: String,
});

export default Group;
