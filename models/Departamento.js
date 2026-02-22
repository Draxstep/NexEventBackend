import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Departamento = sequelize.define('Departamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, 
  }
}, {
  tableName: 'departamentos',
  timestamps: false,
});

export default Departamento;