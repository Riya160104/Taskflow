import User from './User.js';
import Project from './Project.js';
import ProjectMember from './ProjectMember.js';
import Task from './Task.js';

// User <-> Project (createdBy)
Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Project, { foreignKey: 'createdBy' });

// User <-> Project (many-to-many through ProjectMember)
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', otherKey: 'projectId' });
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', otherKey: 'userId' });

// ProjectMember associations (for direct queries)
ProjectMember.belongsTo(User, { foreignKey: 'userId' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(ProjectMember, { foreignKey: 'userId' });
Project.hasMany(ProjectMember, { foreignKey: 'projectId' });

// Task associations
Task.belongsTo(Project, { foreignKey: 'projectId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Project.hasMany(Task, { foreignKey: 'projectId' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });

export { User, Project, ProjectMember, Task };