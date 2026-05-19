class PasarelaPagoService {
    constructor() {
        this.baseUrl = process.env.PAGO_SERVICE_URL ?? 'http://localhost:8002';
    }

    async procesarPago(datosPago) {
        try {
            const response = await fetch(`${this.baseUrl}/procesar-pago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosPago)
            });

            const payload = await response.json().catch(() => null);

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