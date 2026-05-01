import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  organization: user.organization,
  createdAt: user.createdAt
});

const isTeamflowAdminEmail = (email) => email?.toLowerCase() === 'teamflow@admin.com';

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const makeInviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export const registerOrganization = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { organizationName, name, email, password } = req.body;
    if (isTeamflowAdminEmail(email)) {
      return res.status(403).json({ message: 'This email is reserved for the TeamFlow admin account' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const slug = slugify(organizationName);
    const existingOrg = await Organization.findOne({ slug });
    if (existingOrg) {
      return res.status(409).json({ message: 'Organization name is already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const organization = await Organization.create({ name: organizationName, slug, inviteCode: makeInviteCode() });
    const user = await User.create({ name, email, password: passwordHash, role: 'admin', organization: organization._id });
    organization.owner = user._id;
    await organization.save();
    await user.populate('organization', 'name slug inviteCode');

    res.status(201).json({ token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, email, password, organizationCode } = req.body;
    if (isTeamflowAdminEmail(email)) {
      return res.status(403).json({ message: 'This email is reserved for the TeamFlow admin account' });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const organization = await Organization.findOne({ inviteCode: organizationCode?.trim().toUpperCase() });
    if (!organization) {
      return res.status(400).json({ message: 'A valid organization invite code is required' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash, role: 'member', organization: organization._id });
    await user.populate('organization', 'name slug inviteCode');
    const token = generateToken(user);

    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('organization', 'name slug inviteCode');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  if (req.user.populate) {
    await req.user.populate('organization', 'name slug inviteCode');
  }
  res.json({ user: publicUser(req.user) });
};

export const logout = (_req, res) => {
  res.json({ message: 'Logged out successfully' });
};
