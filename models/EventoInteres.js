import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

const EventoInteres = sequelize.define('EventoInteres', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: DataTypes.STRING(255), 
        allowNull: false,
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
    indexes: [
        {
            unique: true,
            fields: ['evento_id', 'usuario_id'],
            name: 'uk_evento_usuario'
        }
    ]
});

export default EventoInteres;