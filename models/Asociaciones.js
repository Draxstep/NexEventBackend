import sequelize from '../config/database.js';
import Departamento from './Departamento.js';
import Ciudad from './Ciudad.js';
import Categoria from './Categoria.js';
import TipoEntrada from './TipoEntrada.js';
import Evento from './Evento.js';
import EventoTipoEntrada from './EventoTipoEntrada.js';
import Compra from './Compra.js';
import Boleto from './Boleto.js';
import EventoInteres from './EventoInteres.js';
import Usuario from './Usuario.js';

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

// ==========================================
// Relación: Evento <-> EventoTipoEntrada
// ==========================================
Evento.hasMany(EventoTipoEntrada, {
  foreignKey: 'evento_id',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

EventoTipoEntrada.belongsTo(Evento, {
  foreignKey: 'evento_id',
  targetKey: 'id'
});

// ==========================================
// Relación: TipoEntrada <-> EventoTipoEntrada
// ==========================================
TipoEntrada.hasMany(EventoTipoEntrada, {
  foreignKey: 'tipo_entrada_id',
  sourceKey: 'id',
  onDelete: 'RESTRICT'
});

EventoTipoEntrada.belongsTo(TipoEntrada, {
  as: 'TipoEntrada',
  foreignKey: 'tipo_entrada_id',
  targetKey: 'id'
});

// ==========================================
// Relación: Compra <-> Boleto
// ==========================================
Usuario.hasMany(Compra, {
  foreignKey: 'usuario_id',
  sourceKey: 'id',
  onDelete: 'RESTRICT'
});

Compra.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  targetKey: 'id'
});

Compra.hasMany(Boleto, {
  foreignKey: 'compra_id',
  sourceKey: 'id',
  onDelete: 'CASCADE'
});

Boleto.belongsTo(Compra, {
  foreignKey: 'compra_id',
  targetKey: 'id'
});

// ==========================================
// Relación: EventoTipoEntrada <-> Boleto
// ==========================================
EventoTipoEntrada.hasMany(Boleto, {
  foreignKey: 'evento_tipo_id',
  sourceKey: 'id',
  onDelete: 'RESTRICT'
});

Boleto.belongsTo(EventoTipoEntrada, {
  as: 'EventoTipoEntrada',
  foreignKey: 'evento_tipo_id',
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

// ==========================================
// Relación: Usuario <-> EventoInteres
// ==========================================
Usuario.hasMany(EventoInteres, {
  foreignKey: 'usuario_id',
  sourceKey: 'id',
  onDelete: 'CASCADE' // Si se borra el usuario de Clerk/BD, se borran sus "me interesa"
});

EventoInteres.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  targetKey: 'id'
});

export {
  sequelize, 
  Departamento,
  Ciudad,
  Categoria,
  TipoEntrada,
  Evento,
  EventoTipoEntrada,
  Compra,
  Boleto,
  EventoInteres,
  Usuario
};