import express from 'express';
import User from '../models/User.js';
import { auth, requireAdmin } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(auth, requireAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      users: users.map(user => user.toJSON())
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get pending users
router.get('/pending-users', async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending', 
      emailVerified: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users: pendingUsers.map(user => user.toJSON())
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending users'
    });
  }
});

// Approve user
router.post('/approve-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User is not pending approval'
      });
    }

    user.status = 'approved';
    user.approvedAt = new Date();
    user.approvedBy = req.user._id;
    await user.save();

    // Send approval email
    const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    const emailTemplate = emailService.generateApprovalEmail(
      user.firstName, 
      user.lastName, 
      loginLink
    );
    await emailService.sendEmail(user.email, emailTemplate);

    res.json({
      success: true,
      message: 'User approved successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user'
    });
  }
});

// Reject user
router.post('/reject-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User is not pending approval'
      });
    }

    user.status = 'rejected';
    await user.save();

    // Send rejection email
    const emailTemplate = emailService.generateRejectionEmail(user.firstName, reason);
    await emailService.sendEmail(user.email, emailTemplate);

    res.json({
      success: true,
      message: 'User rejected successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user'
    });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ 
      status: 'pending', 
      emailVerified: true 
    });
    const approvedUsers = await User.countDocuments({ status: 'approved' });
    const rejectedUsers = await User.countDocuments({ status: 'rejected' });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    res.json({
      success: true,
      stats: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers,
        rejected: rejectedUsers,
        verified: verifiedUsers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Create admin user (for initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Create admin user
    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'admin',
      status: 'approved',
      emailVerified: true
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: admin.toJSON()
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user'
    });
  }
});

export default router; 