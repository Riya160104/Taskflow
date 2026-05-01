import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Project from './Project.js';

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Projects', key: 'id' }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  }
});

Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId' });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId' });

export default ProjectMember;