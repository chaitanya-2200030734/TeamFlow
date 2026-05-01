import Project from '../models/Project.js';

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

export const requireTeamflowAdmin = (req, res, next) => {
  if (req.user?.role !== 'teamflow-admin') {
    return res.status(403).json({ message: 'TeamFlow admin access required' });
  }

  next();
};

export const requireMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  next();
};

export const requireSelfOrAdmin = (req, res, next) => {
  const isSelf = req.user?._id?.toString() === req.params.id;
  if (!isSelf && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }

  next();
};

export const requireProjectMember = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }

    const projectId = req.params.id || req.params.projectId || req.body.project;
    const project = await Project.findOne({ _id: projectId, organization: req.user.organization });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const belongsToProject = project.members.some((memberId) => memberId.toString() === req.user._id.toString());

    if (!belongsToProject) {
      return res.status(403).json({ message: 'Project membership required' });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};
