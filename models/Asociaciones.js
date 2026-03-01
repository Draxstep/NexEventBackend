import sequelize from '../config/database.js';
import Departamento from './Departamento.js';
import Ciudad from './Ciudad.js';
import Categoria from './Categoria.js';
import Evento from './Evento.js';
import EventoInteres from './EventoInteres.js';

// ==========================================
// Relación: Departamento <-> Ciudad
// ==========================================
Departamento.hasMany(Ciudad, {
  foreignKey: 'departamento_id',
  sourceKey: 'id',
  onDelete: 'CASCADE' 
});

Ciudad.belongsTo(Departamento, {
  foreignKey: 'departamento_id',
  targetKey: 'id' 
});

// ==========================================
// Relación: Ciudad <-> Evento
// ==========================================
Ciudad.hasMany(Evento, {
  foreignKey: 'ciudad_id',
  sourceKey: 'id',
  onDelete: 'RESTRICT' 
});

Evento.belongsTo(Ciudad, {
  foreignKey: 'ciudad_id',
  targetKey: 'id'
});

// ==========================================
// Relación: Categoria <-> Evento
// ==========================================
Categoria.hasMany(Evento, {
  foreignKey: 'categoria_id',
  sourceKey: 'id',
  onDelete: 'RESTRICT' 
});

Evento.belongsTo(Categoria, {
  as: 'Categoria',
  foreignKey: 'categoria_id',
  targetKey: 'id'
});

// ==========================================
// Relación: Evento <-> EventoInteres
// ==========================================
Evento.hasMany(EventoInteres, {
    foreignKey: 'evento_id',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

EventoInteres.belongsTo(Evento, {
    foreignKey: 'evento_id',
    targetKey: 'id'
});

export {
  sequelize, 
  Departamento,
  Ciudad,
  Categoria,
  Evento,
  EventoInteres
};