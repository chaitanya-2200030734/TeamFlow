import User from '../models/User.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Organization from '../models/Organization.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ organization: req.user.organization }).select('-password').sort({ name: 1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, organization: req.user.organization }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      avatar: req.body.avatar
    };
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organization },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot remove your own account from the team' });
    }

    const organization = await Organization.findById(req.user.organization);
    if (organization?.owner?.toString() === req.params.id) {
      return res.status(400).json({ message: 'Organization owner cannot be removed' });
    }

    const user = await User.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Task.updateMany({ organization: req.user.organization, assignee: user._id }, { assignee: null });
    await Project.updateMany({ organization: req.user.organization, members: user._id }, { $pull: { members: user._id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
