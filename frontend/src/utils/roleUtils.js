export const isAdmin = (user) => user?.role === 'admin';
export const isTeamflowAdmin = (user) => user?.role === 'teamflow-admin';

export const canUpdateTaskStatus = (user, task) => {
  return isAdmin(user) || task?.assignee?._id === user?._id || task?.assignee === user?._id;
};
