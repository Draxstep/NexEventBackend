import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Ciudad = sequelize.define('Ciudad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'ciudades',
  timestamps: false,
});

export default Ciudad;