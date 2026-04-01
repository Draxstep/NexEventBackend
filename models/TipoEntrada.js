import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TipoEntrada = sequelize.define('TipoEntrada', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'tipos_entrada',
  timestamps: false,
});

export default TipoEntrada;