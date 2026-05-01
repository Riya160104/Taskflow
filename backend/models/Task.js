import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Project from './Project.js';

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 200] }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Projects', key: 'id' }
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  }
});

Task.belongsTo(Project, { foreignKey: 'projectId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Project.hasMany(Task, { foreignKey: 'projectId' });

export default Task;