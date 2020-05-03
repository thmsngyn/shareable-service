import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  email: String,
  loggedIn: Boolean,
});

export const AccountModel = mongoose.model("Account", AccountSchema);
