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
    categoria_id: 1,
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

  describe('calculateStateTickets', () => {
    it('should return UNCONFIGURED if total capacity is 0 even if tickets exist', () => {
      const tickets = [
        { capacidad_total: 0, cantidad_vendida: 0 },
        { capacidad_total: 0, cantidad_vendida: 0 }
      ];
      const result = EventoService.calculateStateTickets(tickets);
      expect(result).toBe('UNCONFIGURED');
    });

    it('should return SOLD_OUT if sum of all tickets is full', () => {
      const tickets = [
        { capacidad_total: 50, cantidad_vendida: 50 },
        { capacidad_total: 50, cantidad_vendida: 50 }
      ];
      const result = EventoService.calculateStateTickets(tickets);
      expect(result).toBe('SOLD_OUT');
    });
  });
});

