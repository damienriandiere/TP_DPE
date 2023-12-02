import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedSearches: { type: Array, required: false },
});

const UserModel = model('DRI_Users', userSchema);

export default UserModel;