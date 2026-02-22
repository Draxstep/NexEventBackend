import sequelize from '../config/database.js';
import Departamento from './Departamento.js';
import Ciudad from './Ciudad.js';

Departamento.hasMany(Ciudad, {
  foreignKey: 'departamento_id',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Ciudad.belongsTo(Departamento, {
  foreignKey: 'departamento_id',
  targetKey: 'id' 
});

export {
  sequelize, 
  Departamento,
  Ciudad,
};