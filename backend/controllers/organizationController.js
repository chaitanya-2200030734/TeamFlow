import crypto from 'crypto';
import Organization from '../models/Organization.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const makeInviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export const getOrganizations = async (_req, res, next) => {
  try {
    const organizations = await Organization.find()
      .select('name slug inviteCode createdAt')
      .sort({ createdAt: -1 });

    res.json({ organizations });
  } catch (error) {
    next(error);
  }
};

export const resetInviteCode = async (req, res, next) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.user.organization,
      { inviteCode: makeInviteCode() },
      { new: true, runValidators: true }
    ).select('name slug inviteCode');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ organization });
  } catch (error) {
    next(error);
  }
};

export const resetOrganizationInviteCode = async (req, res, next) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { inviteCode: makeInviteCode() },
      { new: true, runValidators: true }
    ).select('name slug inviteCode createdAt');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ organization });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    await Promise.all([
      User.deleteMany({ organization: organization._id }),
      Project.deleteMany({ organization: organization._id }),
      Task.deleteMany({ organization: organization._id })
    ]);

    res.json({ message: 'Organization removed' });
  } catch (error) {
    next(error);
  }
};
