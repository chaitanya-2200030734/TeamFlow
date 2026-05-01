import { validationResult } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

const taskPopulate = [
  { path: 'project', select: 'name color members owner status organization' },
  { path: 'assignee', select: 'name email role avatar' },
  { path: 'createdBy', select: 'name email role avatar' }
];

const assertProjectAccess = (project, user) => {
  return user.role === 'admin' || project.members.some((memberId) => memberId.toString() === user._id.toString());
};

export const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter = { organization: req.user.organization };

    ['project', 'status', 'priority'].forEach((key) => {
      if (req.query[key]) filter[key] = req.query[key];
    });

    if (req.query.unassigned === 'true' || req.query.assignee === 'unassigned') {
      filter.assignee = null;
    } else if (req.query.assignee) {
      filter.assignee = req.query.assignee;
    }

    if (req.query.overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $ne: 'done' };
    }

    if (req.user.role !== 'admin') {
      const projectIds = await Project.find({ organization: req.user.organization, members: req.user._id }).distinct('_id');
      filter.project = filter.project ? filter.project : { $in: projectIds };
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate(taskPopulate)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    res.json({ tasks, page, total, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ organization: req.user.organization, assignee: req.user._id }).populate(taskPopulate).sort({ dueDate: 1, updatedAt: -1 });
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const project = await Project.findOne({ _id: req.body.project, organization: req.user.organization });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.body.assignee && !project.members.some((memberId) => memberId.toString() === req.body.assignee)) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    const task = await Task.create({ ...req.body, organization: req.user.organization, createdBy: req.user._id });
    await task.populate(taskPopulate);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, organization: req.user.organization }).populate(taskPopulate);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!assertProjectAccess(task.project, req.user)) {
      return res.status(403).json({ message: 'Project membership required' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, organization: req.user.organization }).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAssignee = task.assignee?.toString() === req.user._id.toString();
    if (req.user.role !== 'admin') {
      const requestedKeys = Object.keys(req.body);
      if (!isAssignee || requestedKeys.some((key) => key !== 'status')) {
        return res.status(403).json({ message: 'Members can only update their assigned task status' });
      }
    }

    let targetProject = task.project;
    if (req.body.project && req.body.project !== task.project._id.toString()) {
      targetProject = await Project.findOne({ _id: req.body.project, organization: req.user.organization });
      if (!targetProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
    }

    if (req.body.assignee && !targetProject.members.some((memberId) => memberId.toString() === req.body.assignee)) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    Object.assign(task, req.body);
    await task.save();
    await task.populate(taskPopulate);
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAssignee = task.assignee?.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isAssignee) {
      return res.status(403).json({ message: 'Only admins and assignees can update status' });
    }

    task.status = req.body.status;
    await task.save();
    await task.populate(taskPopulate);
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
