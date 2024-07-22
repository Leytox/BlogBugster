import User from "../models/user.model.js";

const getAccount = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateAccount = async (req, res) => {
  const { name, email, password } = req.body;
  try {
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

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password", null);
    return res.status(200).json({ user, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const skip = (page - 1) * limit;
  try {
    const users = await User.find(null, "-password", null)
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ users, message: "Successes" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getAccount, updateAccount, deleteAccount, getUsers, getUser };
