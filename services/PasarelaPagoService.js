class PasarelaPagoService {
    constructor() {
        this.baseUrl = process.env.PAGO_SERVICE_URL ?? 'http://localhost:8002';
    }

    redactarPago(datosPago) {
        return {
            ...datosPago,
            numero_tarjeta: datosPago?.numero_tarjeta ? `****${datosPago.numero_tarjeta.slice(-4)}` : undefined,
            cvc: datosPago?.cvc ? '***' : undefined
        };
    }

    async procesarPago(datosPago) {
        try {
            console.log('[Pago] Request', {
                url: `${this.baseUrl}/procesar-pago`,
                payload: this.redactarPago(datosPago)
            });

            const response = await fetch(`${this.baseUrl}/procesar-pago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosPago)
            });

            const payload = await response.json().catch(() => null);

            console.log('[Pago] Response', {
                status: response.status,
                payload
            });

            if (!response.ok) {
                const error = new Error(payload?.detail || payload?.mensaje || 'No fue posible procesar el pago.');
                error.code = response.status === 400 || response.status === 422 ? 'PAGO_INVALIDO' : 'PAGO_SERVICIO_NO_DISPONIBLE';
                error.statusCode = response.status === 400 || response.status === 422 ? 400 : 503;
                throw error;
            }

            if (!payload || payload.status !== 'Aprobado') {
                const error = new Error(payload?.mensaje || 'El pago fue rechazado por la pasarela.');
                error.code = 'PAGO_RECHAZADO';
                error.statusCode = 402;
                throw error;
            }

            return payload;
        } catch (error) {
            console.log('[Pago] Error', {
                code: error.code,
                statusCode: error.statusCode,
                message: error.message
            });

            if (error.code) {
                throw error;
            }

            const serviceError = new Error('No se pudo conectar con la pasarela de pago.');
            serviceError.code = 'PAGO_SERVICIO_NO_DISPONIBLE';
            serviceError.statusCode = 503;
            serviceError.cause = error;
            throw serviceError;
        }
    }
}

export default new PasarelaPagoService();