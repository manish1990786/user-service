const userService = require('../services/userService');

// Register a new user
const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.userId, req.body);
    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    await userService.deleteUser(req.user.userId);
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
};