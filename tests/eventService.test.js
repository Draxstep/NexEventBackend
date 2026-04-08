import { describe, it, expect, vi, afterEach } from 'vitest';
import EventoService from '../services/EventoService.js';
import { Evento } from '../models/Asociaciones.js';

vi.mock('../models/Asociaciones.js', () => ({
  Evento: {
    create: vi.fn(),
  }
}));

describe('EventoService - createEvent', () => {
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  const getDate = (daysAhead = 1) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  };

  const baseEventData = {
    nombre: 'Tech Conference 2024',
    lugar: 'Convention Center',
    categoria_id: 100,
    ciudad_id: 5
  };

  it('should successfully create an event when data and date are valid (Happy Path)', async () => {
    const validData = { ...baseEventData, fecha: getDate(10) };
    const mockCreatedEvent = { id: 99, ...validData };
    
    Evento.create.mockResolvedValue(mockCreatedEvent);

    const result = await EventoService.crear(validData);

    expect(result).toEqual(mockCreatedEvent);
    expect(Evento.create).toHaveBeenCalledWith(validData);
  });
    it('should throw a 400 error if the category or city does not exist (Foreign Key Error)', async () => {
        const validData = { ...baseEventData, fecha: getDate(5) };

        const seqError = new Error("ForeignKeyConstraintError");
        seqError.name = 'SequelizeForeignKeyConstraintError';
        Evento.create.mockResolvedValue({ id: 99, ...validData });

        await expect(EventoService.crear(validData)).rejects.toMatchObject({
            message: "Inconsistencia de datos: La categoría o la ciudad seleccionada no existe.",
            statusCode: 400
        });
    });

});
