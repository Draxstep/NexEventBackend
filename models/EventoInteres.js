import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

const EventoInteres = sequelize.define('EventoInteres', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    evento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true,
    }
}, {
    tableName: 'evento_interes',
    timestamps: false,
});

export default EventoInteres;