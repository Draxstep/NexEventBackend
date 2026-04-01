import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

const Compra = sequelize.define('Compra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha_compra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  monto_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  codigo_qr_general: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'compras',
  timestamps: false,
});

export default Compra;