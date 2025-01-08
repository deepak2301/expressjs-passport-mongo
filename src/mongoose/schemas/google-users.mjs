import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);
export default GoogleUser;
