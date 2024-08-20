import User from "../models/user.model.js";

const getAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password -_id -__v", null);
    return res.status(200).json({ user, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateAccount = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password)
      return res.status(400).json({ message: "Fill all fields" });
    await User.findByIdAndUpdate(req.user.id, { name, email, password }, null);
    return res.status(200).json({ message: "Account updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id, null);
    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getAccount, updateAccount, deleteAccount };