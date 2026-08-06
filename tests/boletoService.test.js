import { describe, it, expect, vi, afterEach } from 'vitest';
import BoletoService from '../services/BoletoService.js';
import { Boleto } from '../models/Asociaciones.js';

vi.mock('../models/Asociaciones.js', () => ({
    Boleto: {
        findOne: vi.fn()
    },
    // Otros modelos si son necesarios
    EventoTipoEntrada: {},
    TipoEntrada: {},
    Evento: {}
}));

describe('BoletoService - validarAcceso', () => {

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should throw 400 error if the event date has already passed', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);
        const pastDateStr = pastDate.toISOString().split('T')[0];

        const mockBoleto = {
            id: 50,
            estado: 'Activo',
            codigo_qr_individual: 'QR_OLD_EVENT',
            EventoTipoEntrada: {
                TipoEntrada: { nombre: 'General' },
                Evento: { nombre: 'Evento Viejo', fecha: pastDateStr }
            },
            update: vi.fn().mockResolvedValue(true)
        };

        Boleto.findOne.mockResolvedValue(mockBoleto);

        await expect(BoletoService.validarAcceso('QR_OLD_EVENT')).rejects.toMatchObject({
            message: "El evento ya ha finalizado.",
            code: 'EVENTO_FINALIZADO',
            statusCode: 400
        });

        expect(mockBoleto.update).not.toHaveBeenCalled();
    });
});