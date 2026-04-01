import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventoTipoEntrada = sequelize.define('EventoTipoEntrada', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  evento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_entrada_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  capacidad_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad_vendida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  tableName: 'evento_tipos_entrada',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['evento_id', 'tipo_entrada_id']
    }
  ]
});

export default EventoTipoEntrada;