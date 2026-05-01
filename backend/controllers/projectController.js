import { validationResult } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const projectPopulate = [
  { path: 'owner', select: 'name email role avatar' },
  { path: 'members', select: 'name email role avatar' }
];

export const getProjects = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin'
      ? { organization: req.user.organization }
      : { organization: req.user.organization, members: req.user._id };
    const projects = await Project.find(query).populate(projectPopulate).sort({ createdAt: -1 });
    const taskCounts = await Task.aggregate([
      { $match: { project: { $in: projects.map((project) => project._id) } } },
      { $group: { _id: '$project', total: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } } } }
    ]);
    const countMap = new Map(taskCounts.map((item) => [item._id.toString(), item]));

    res.json({
      projects: projects.map((project) => ({
        ...project.toObject(),
        taskStats: countMap.get(project._id.toString()) || { total: 0, done: 0 }
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const requestedMembers = [...new Set([...(req.body.members || []), req.user._id.toString()])];
    const allowedMembers = await User.find({ _id: { $in: requestedMembers }, organization: req.user.organization }).distinct('_id');
    const members = [...new Set(allowedMembers.map((memberId) => memberId.toString()))];
    const project = await Project.create({ ...req.body, organization: req.user.organization, owner: req.user._id, members });
    await project.populate(projectPopulate);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, organization: req.user.organization }).populate(projectPopulate);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const canAccess = req.user.role === 'admin' || project.members.some((member) => member._id.toString() === req.user._id.toString());
    if (!canAccess) {
      return res.status(403).json({ message: 'Project membership required' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organization },
      req.body,
      { new: true, runValidators: true }
    ).populate(projectPopulate);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project and related tasks deleted' });
  } catch (error) {
    next(error);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId, organization: req.user.organization });
    const project = await Project.findOne({ _id: req.params.id, organization: req.user.organization });

    if (!user || !project) {
      return res.status(404).json({ message: 'Project or user not found' });
    }

    if (!project.members.some((memberId) => memberId.toString() === userId)) {
      project.members.push(userId);
      await project.save();
    }

    await project.populate(projectPopulate);
    res.json({ project });
  } catch (error) {
    next(error);
  }
};

export const removeProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() === req.params.userId) {
      return res.status(400).json({ message: 'Project owner cannot be removed from their own project' });
    }

    project.members = project.members.filter((memberId) => memberId.toString() !== req.params.userId);
    await project.save();
    await Task.updateMany({ project: project._id, assignee: req.params.userId }, { assignee: null });
    await project.populate(projectPopulate);
    res.json({ project });
  } catch (error) {
    next(error);
  }
};

export const getProjectMembers = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, organization: req.user.organization }).populate('members', 'name email role avatar');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const canAccess = req.user.role === 'admin' || project.members.some((member) => member._id.toString() === req.user._id.toString());
    if (!canAccess) {
      return res.status(403).json({ message: 'Project membership required' });
    }

    res.json({ members: project.members });
  } catch (error) {
    next(error);
  }
};
