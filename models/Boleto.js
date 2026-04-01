import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Boleto = sequelize.define('Boleto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  compra_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  evento_tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  codigo_qr_individual: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Válido',
    validate: {
      isIn: [['Válido', 'Usado', 'Cancelado']]
    }
  }
}, {
  tableName: 'boletos',
  timestamps: false,
});

export default Boleto;