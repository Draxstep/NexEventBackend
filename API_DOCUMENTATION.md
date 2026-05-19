# NexEvent API - Documentacion para el Equipo de Frontend

**Base URL:** `http://localhost:3000/api`

**Fecha de generacion:** 14 de abril de 2026

---

## Tabla de Contenidos

1. [Informacion General](#informacion-general)
2. [Categorias](#categorias)
   - [GET /api/categorias](#get-apicategorias)
   - [POST /api/categorias](#post-apicategorias)
3. [Departamentos](#departamentos)
   - [GET /api/departamentos](#get-apidepartamentos)
   - [POST /api/departamentos](#post-apidepartamentos)
   - [GET /api/departamentos/:id/ciudades](#get-apidepartamentosidciudades)
4. [Tipos de Entrada](#tipos-de-entrada)
   - [GET /api/tipos-entrada](#get-apitipos-entrada)
   - [POST /api/tipos-entrada](#post-apitipos-entrada)
5. [Eventos](#eventos)
   - [GET /api/eventos](#get-apieventos)
   - [GET /api/eventos/activos](#get-apieventosactivos)

- [GET /api/eventos/cancelados](#get-apieventoscancelados)
- [GET /api/eventos/completados](#get-apieventoscompletados)
- [POST /api/eventos](#post-apieventos)
- [GET /api/eventos/:id](#get-apieventosid)
- [PUT /api/eventos/:id](#put-apieventosid)
- [PATCH /api/eventos/completar-pasados](#patch-apieventoscompletar-pasados)
- [PATCH /api/eventos/:id/estado](#patch-apieventosidestado)

6. [Configuracion de Entradas por Evento](#configuracion-de-entradas-por-evento)
   - [PUT /api/evento-tipos-entrada/:evento_id](#put-apievento-tipos-entradaevento_id)
   - [GET /api/evento-tipos-entrada/:evento_id/disponibilidad](#get-apievento-tipos-entradaevento_iddisponibilidad)
7. [Intereses de Evento](#intereses-de-evento)
   - [POST /api/intereses](#post-apiintereses)
   - [GET /api/intereses/evento/:evento_id/conteo](#get-apiintereseseventoevento_idconteo)
   - [GET /api/intereses/evento/:evento_id/verificar/:usuario_id](#get-apiintereseseventoevento_idverificarusuario_id)
   - [DELETE /api/intereses/evento/:evento_id/usuario/:usuario_id](#delete-apiintereseseventoevento_idusuariousuario_id)
   - [GET /api/intereses/usuario/:usuario_id/eventos](#get-apiinteresesusuariousuario_ideventos)
8. [Boletos](#boletos)
   - [POST /api/boletos/generar](#post-apiboletosgenerar)
   - [POST /api/boletos/validar-acceso](#post-apiboletosvalidar-acceso)
   - [PATCH /api/boletos/:boleto_id/cancelar](#patch-apiboletosboleto_idcancelar)
9. [Compras](#compras)

- [POST /api/compras](#post-apicompras)
- [GET /api/compras/usuario/:usuario_id/historial](#get-apicomprasusuariousuario_idhistorial)
- [GET /api/compras/:compra_id](#get-apicomprascompra_id)

10. [Reportes](#reportes)

- [GET /api/reportes/metricas-generales](#get-apireportesmetricas-generales)
- [GET /api/reportes/ventas/evento/:evento_id](#get-apireportesventaseventoevento_id)

11. [Webhooks](#webhooks)

- [POST /api/webhook/clerk](#post-apiwebhookclerk)

12. [Manejo Global de Errores](#manejo-global-de-errores)

---

## Informacion General

- **Protocolo:** HTTP
- **Formato de datos:** JSON (`Content-Type: application/json`)
- **Autenticacion:** Ningun endpoint requiere autenticacion en la version actual.
- **CORS:** Origenes permitidos: `http://localhost:5173`, `http://localhost:5174`, `http://localhost:3000`.

---

## Categorias

---

### GET /api/categorias

**Descripcion:** Obtiene todas las categorias ordenadas alfabeticamente por nombre.

**Exito (200):**

```json
[
  {
    "id": 1,
    "nombre": "Conferencia"
  }
]
```

**Errores comunes:** `500`.

---

### POST /api/categorias

**Descripcion:** Crea una categoria.

**Body:**

```json
{
  "nombre": "Conferencia"
}
```

**Exito (201):**

```json
{
  "id": 1,
  "nombre": "Conferencia"
}
```

**Errores comunes:**

- `400` datos invalidos.
- `409` categoria duplicada.
- `500` error interno.

---

## Departamentos

---

### GET /api/departamentos

**Descripcion:** Obtiene todos los departamentos ordenados por nombre.

**Exito (200):**

```json
[
  {
    "id": 1,
    "nombre": "Antioquia"
  }
]
```

**Errores comunes:** `500`.

---

### POST /api/departamentos

**Descripcion:** Crea un departamento.

**Body:**

```json
{
  "nombre": "Antioquia"
}
```

**Exito (201):**

```json
{
  "id": 1,
  "nombre": "Antioquia"
}
```

**Errores comunes:**

- `400` datos invalidos.
- `409` departamento duplicado.
- `500` error interno.

---

### GET /api/departamentos/:id/ciudades

**Descripcion:** Obtiene las ciudades de un departamento.

**Exito (200):**

```json
[
  {
    "id": 1,
    "nombre": "Medellin",
    "departamento_id": 1
  }
]
```

**Errores comunes:** `500`.

---

## Tipos de Entrada

---

### GET /api/tipos-entrada

**Descripcion:** Obtiene todos los tipos de entrada ordenados por nombre.

**Exito (200):**

```json
[
  {
    "id": 1,
    "nombre": "General"
  },
  {
    "id": 2,
    "nombre": "VIP"
  }
]
```

**Errores comunes:** `500`.

---

### POST /api/tipos-entrada

**Descripcion:** Crea un tipo de entrada.

**Body:**

```json
{
  "nombre": "General"
}
```

**Exito (201):**

```json
{
  "id": 1,
  "nombre": "General"
}
```

**Errores comunes:**

- `400` datos invalidos.
- `409` tipo de entrada duplicado.
- `500` error interno.

---

## Eventos

---

### GET /api/eventos

**Descripcion:** Obtiene todos los eventos ordenados por fecha.

**Exito (200):**

```json
[
  {
    "id": 1,
    "nombre": "Tech Conference 2026",
    "fecha": "2026-05-15",
    "lugar": "Centro de Convenciones",
    "imagen_url": "https://ejemplo.com/imagen.jpg",
    "estado": "Activo",
    "estado_entradas": "AVAILABLE",
    "Categoria": {
      "id": 1,
      "nombre": "Conferencia"
    },
    "Ciudad": {
      "nombre": "Medellin"
    }
  }
]
```

**Errores comunes:** `500`.

---

### GET /api/eventos/activos

**Descripcion:** Obtiene eventos activos (`estado = 'Activo'`).

**Exito (200):** Arreglo con estructura similar a `GET /api/eventos`.

**Errores comunes:** `500`.

---

### GET /api/eventos/cancelados

**Descripcion:** Obtiene eventos cancelados (`estado = 'Cancelado'`).

**Exito (200):** Arreglo con estructura similar a `GET /api/eventos/activos`.

**Errores comunes:** `500`.

---

### GET /api/eventos/completados

**Descripcion:** Obtiene eventos completados (`estado = 'Completado'`).

**Exito (200):** Arreglo con estructura similar a `GET /api/eventos/activos`.

**Errores comunes:** `500`.

---

### POST /api/eventos

**Descripcion:** Crea un evento.

**Notas de envio:**

- Soporta `multipart/form-data` (campo de archivo `imagen`) por el middleware de upload.
- Tambien puede recibir `imagen_url` en body si no se sube archivo.

**Body JSON de ejemplo:**

```json
{
  "nombre": "Tech Conference 2026",
  "fecha": "2026-05-15",
  "lugar": "Centro de Convenciones",
  "hora": "09:00:00",
  "categoria_id": 1,
  "ciudad_id": 3,
  "descripcion": "Conferencia de tecnologia",
  "imagen_url": "https://ejemplo.com/imagen.jpg"
}
```

**Exito (201):**

```json
{
  "message": "Evento agregado correctamente.",
  "evento": {
    "id": 1,
    "nombre": "Tech Conference 2026"
  }
}
```

**Errores comunes:**

- `400` validaciones de campos.
- `400` inconsistencias de FK (categoria/ciudad inexistente).
- `500` error interno.

---

### GET /api/eventos/:id

**Descripcion:** Obtiene detalle de un evento con categoria, ciudad y departamento.

**Exito (200):** objeto del evento.

**Errores comunes:**

- `404` evento no encontrado.
- `500` error interno.

---

### PUT /api/eventos/:id

**Descripcion:** Actualiza un evento.

**Body:** mismos campos de `POST /api/eventos`.

**Exito (200):**

```json
{
  "message": "Evento actualizado correctamente.",
  "evento": {
    "id": 1,
    "nombre": "Evento actualizado"
  }
}
```

**Errores comunes:**

- `400` validaciones de campos.
- `400` inconsistencias de FK.
- `404` evento no encontrado.
- `500` error interno.

---

### PATCH /api/eventos/:id/estado

**Descripcion:** Actualiza el estado del evento a un valor permitido.

**Body:**

```json
{
  "estado": "Completado"
}
```

Valores permitidos para `estado`: `Activo`, `Completado`, `Cancelado`.

**Exito (200):**

```json
{
  "message": "Estado del evento actualizado a Completado.",
  "evento": {
    "id": 1,
    "estado": "Completado"
  }
}
```

**Errores comunes:**

- `400` estado faltante o invalido.
- `404` evento no encontrado.
- `500` error interno.

---

### PATCH /api/eventos/completar-pasados

**Descripcion:** Marca como `Completado` todos los eventos cuya `fecha` es menor a la fecha actual (`CURRENT_DATE`) y que aun no estan completados.

**Exito (200):**

```json
{
  "message": "Se actualizaron 3 evento(s) a Completado.",
  "registros_actualizados": 3
}
```

**Errores comunes:**

- `500` error interno.

---

## Configuracion de Entradas por Evento

---

### PUT /api/evento-tipos-entrada/:evento_id

**Descripcion:** Configura tipos de entrada para un evento.

**Comportamiento actual:**

- Crea o actualiza los tipos enviados en el payload.
- Si un tipo existente no viene en el payload, se elimina.
- Si se intenta eliminar un tipo con entradas vendidas, la operacion falla.
- Si se actualiza un tipo existente, `capacidad_total` no puede ser menor a `cantidad_vendida`.

**Body (array):**

```json
[
  {
    "tipo_entrada_id": 1,
    "precio": 12000,
    "capacidad_total": 30
  },
  {
    "tipo_entrada_id": 2,
    "precio": 25000,
    "capacidad_total": 10
  }
]
```

**Exito (200):**

```json
{
  "message": "Entradas del evento configuradas correctamente.",
  "configuracion": [
    {
      "id": 1,
      "tipo_entrada_id": 1,
      "tipo_entrada": {
        "id": 1,
        "nombre": "General"
      },
      "precio": "12000.00",
      "capacidad_total": 30,
      "cantidad_vendida": 0,
      "asientos_disponibles": 30
    }
  ]
}
```

**Errores comunes:**

- `400` evento_id invalido.
- `400` payload invalido.
- `400` tipo de entrada inexistente.
- `404` evento no encontrado.
- `409` capacidad menor que vendida.
- `500` error interno.

---

### GET /api/evento-tipos-entrada/:evento_id/disponibilidad

**Descripcion:** Obtiene disponibilidad por tipo de entrada (`capacidad_total - cantidad_vendida`).

**Exito (200):** arreglo de configuraciones con `asientos_disponibles`.

**Errores comunes:**

- `400` evento_id invalido.
- `404` evento no encontrado.
- `500` error interno.

---

## Intereses de Evento

---

### POST /api/intereses

**Descripcion:** Registra interes de un usuario por un evento.

**Body:**

```json
{
  "evento_id": 1,
  "usuario_id": "user_abc123"
}
```

**Exito (201):**

```json
{
  "message": "Interes registrado exitosamente.",
  "interes": {
    "id": 10,
    "evento_id": 1,
    "usuario_id": "user_abc123"
  }
}
```

**Errores comunes:**

- `400` falta evento_id o usuario_id.
- `404` evento no existe.
- `500` error interno.

---

### GET /api/intereses/evento/:evento_id/conteo

**Descripcion:** Obtiene total de interesados por evento.

**Exito (200):**

```json
{
  "evento_id": 1,
  "total_interesados": 42
}
```

**Errores comunes:** `500`.

---

### GET /api/intereses/evento/:evento_id/verificar/:usuario_id

**Descripcion:** Indica si el usuario ya marco interes en el evento.

**Exito (200):**

```json
{
  "evento_id": 1,
  "interesado": true
}
```

**Errores comunes:** `500`.

---

### DELETE /api/intereses/evento/:evento_id/usuario/:usuario_id

**Descripcion:** Elimina el interes de un usuario por un evento.

**Exito (200):**

```json
{
  "message": "Interes eliminado exitosamente."
}
```

**Errores comunes:** `500`.

---

### GET /api/intereses/usuario/:usuario_id/eventos

**Descripcion:** Lista los eventos marcados como interesados por un usuario.

**Exito (200):**

```json
[
  {
    "id": 1,
    "nombre": "Tech Conference 2026",
    "fecha": "2026-05-15",
    "hora": "09:00:00",
    "lugar": "Centro de Convenciones",
    "imagen_url": null,
    "valor": "50000.00",
    "ciudad": "Medellin"
  }
]
```

**Errores comunes:** `500`.

---

## Boletos

---

### POST /api/boletos/generar

**Descripcion:** Genera boletos individuales para una compra existente.

**Body:**

```json
{
  "compra_id": 1,
  "detallesCompra": [
    {
      "evento_tipo_id": 1,
      "cantidad": 2
    }
  ]
}
```

**Exito (201):**

```json
{
  "message": "Boletos generados correctamente.",
  "total_generados": 2,
  "boletos": [
    {
      "id": 1,
      "compra_id": 1,
      "evento_tipo_id": 1,
      "codigo_qr_individual": "uuid",
      "estado": "Válido"
    }
  ]
}
```

**Errores comunes:**

- `400` payload invalido.
- `400` tipo de evento inexistente.
- `404` compra no encontrada.
- `500` error interno.

---

### POST /api/boletos/validar-acceso

**Descripcion:** Valida un boleto por codigo QR individual y lo marca como usado.

**Body:**

```json
{
  "codigo_qr_individual": "uuid-del-boleto"
}
```

**Exito (200):**

```json
{
  "message": "Acceso permitido. Boleto validado correctamente.",
  "boleto": {
    "id": 1,
    "estado": "Usado",
    "tipo_entrada": {
      "id": 1,
      "nombre": "General"
    },
    "evento": {
      "id": 1,
      "nombre": "Tech Conference 2026"
    }
  }
}
```

**Errores comunes:**

- `400` codigo qr invalido.
- `400` entrada invalida o ya utilizada.
- `404` boleto no encontrado.
- `500` error interno.

---

### PATCH /api/boletos/:boleto_id/cancelar

**Descripcion:** Cancela un boleto si aun no ha sido usado.

**Exito (200):**

```json
{
  "message": "Boleto cancelado correctamente.",
  "boleto": {
    "id": 1,
    "estado": "Cancelado"
  }
}
```

**Errores comunes:**

- `400` boleto_id invalido.
- `400` no se puede cancelar un boleto usado.
- `404` boleto no encontrado.
- `500` error interno.

---

## Compras

---

### POST /api/compras

**Descripcion:** Procesa una compra completa (valida usuario, evento activo, stock), cobra el pago en la pasarela externa, crea la compra, genera boletos y actualiza `cantidad_vendida` por tipo de entrada.

**Body:**

```json
{
  "usuario_id": "user_3ANBwCd4QgPpjjBNyZxxaOS4aqo",
  "evento_id": 1,
  "detallesCompra": [
    {
      "tipo_entrada_id": 1,
      "cantidad": 2
    },
    {
      "tipo_entrada_id": 2,
      "cantidad": 1
    }
  ],
  "pago": {
    "franquicia": "Visa",
    "numero_tarjeta": "4111111111111111",
    "cvc": "123",
    "fecha_expiracion": "12/28"
  }
}
```

**Exito (201):**

```json
{
  "message": "Compra procesada exitosamente.",
  "compra": {
    "id": 15,
    "usuario_id": "user_3ANBwCd4QgPpjjBNyZxxaOS4aqo",
    "fecha_compra": "2026-04-01T20:15:00.000Z",
    "monto_total": "420000.00",
    "codigo_qr_general": "e7ec6c03-df01-4558-a5bf-7f74a91c4f14",
    "Usuario": {
      "id": "user_3ANBwCd4QgPpjjBNyZxxaOS4aqo",
      "email": "correo@ejemplo.com",
      "nombre": "Usuario Demo"
    },
    "Boletos": []
  },
  "pago": {
    "status": "Aprobado",
    "transaccion_id": "pb_id",
    "mensaje": "Pago aprobado"
  }
}
```

**Errores comunes:**

- `400` payload invalido (`usuario_id`, `evento_id`, `detallesCompra`, `pago`).
- `400` evento no disponible o tipo no disponible para el evento.
- `404` usuario no encontrado.
- `402` pago rechazado por la pasarela.
- `503` pasarela de pago no disponible.
- `409` stock insuficiente.
- `500` error interno.

---

### GET /api/compras/usuario/:usuario_id/historial

**Descripcion:** Retorna el historial de compras de un usuario, ordenado por `fecha_compra` descendente.

**Exito (200):**

```json
[
  {
    "id": 15,
    "fecha_compra": "2026-04-01T20:15:00.000Z",
    "monto_total": "420000.00",
    "codigo_qr_general": "e7ec6c03-df01-4558-a5bf-7f74a91c4f14"
  }
]
```

**Errores comunes:**

- `400` `usuario_id` invalido.
- `404` usuario no encontrado.
- `500` error interno.

---

### GET /api/compras/:compra_id

**Descripcion:** Obtiene el detalle de una compra con usuario, boletos, tipo de entrada y datos del evento.

**Exito (200):**

```json
{
  "id": 15,
  "usuario_id": "user_3ANBwCd4QgPpjjBNyZxxaOS4aqo",
  "fecha_compra": "2026-04-01T20:15:00.000Z",
  "monto_total": "420000.00",
  "codigo_qr_general": "e7ec6c03-df01-4558-a5bf-7f74a91c4f14",
  "Usuario": {
    "id": "user_3ANBwCd4QgPpjjBNyZxxaOS4aqo",
    "email": "correo@ejemplo.com",
    "nombre": "Usuario Demo"
  },
  "Boletos": [
    {
      "id": 101,
      "codigo_qr_individual": "11f0a537-93c6-4205-b070-46cebf9e6540",
      "estado": "Válido"
    }
  ]
}
```

**Errores comunes:**

- `400` `compra_id` invalido.
- `404` compra no encontrada.
- `500` error interno.

---

## Reportes

---

### GET /api/reportes/metricas-generales

**Descripcion:** Retorna metricas globales del sistema para dashboards administrativos.

**Nota:** `eventos_pasados` corresponde actualmente a eventos con `estado = 'Completado'`.

**Exito (200):**

```json
{
  "total_ganancias": 1520000,
  "eventos_activos": 12,
  "eventos_pasados": 8,
  "usuarios_registrados": 340
}
```

**Errores comunes:**

- `500` error interno.

---

### GET /api/reportes/ventas/evento/:evento_id

**Descripcion:** Obtiene el reporte de ventas por tipo de entrada para un evento especifico.

**Parametros de ruta:**

- `evento_id` (entero positivo)

**Exito (200):**

```json
{
  "evento": {
    "id": 1,
    "nombre": "Tech Conference 2026"
  },
  "ventas": [
    {
      "id": 4,
      "tipo_entrada_id": 1,
      "cantidad_vendida": 35,
      "capacidad_total": 100,
      "ganancia": "420000.00",
      "TipoEntrada": {
        "id": 1,
        "nombre": "General"
      }
    },
    {
      "id": 5,
      "tipo_entrada_id": 2,
      "cantidad_vendida": 10,
      "capacidad_total": 30,
      "ganancia": "500000.00",
      "TipoEntrada": {
        "id": 2,
        "nombre": "VIP"
      }
    }
  ]
}
```

**Errores comunes:**

- `400` `evento_id` invalido.
- `404` evento no encontrado.
- `500` error interno.

---

## Webhooks

---

### POST /api/webhook/clerk

**Descripcion:** Recibe eventos de Clerk (`user.created`, `user.updated`, `user.deleted`) y sincroniza usuarios en BD.

**Headers requeridos:**

- `svix-id`
- `svix-timestamp`
- `svix-signature`

**Exito (200):**

```json
{
  "success": true
}
```

**Errores comunes:**

- `400` faltan headers Svix.
- `400` firma de webhook invalida.
- `500` falta secreto o error interno procesando evento.

---

## Manejo Global de Errores

El backend usa un middleware global (`errorHandler`) para capturar excepciones no manejadas.

### Comportamiento

- Si el error tiene `statusCode`, responde con ese codigo y mensaje.
- Si no tiene `statusCode`, responde `500` con mensaje generico.

### Formato estandar de error

```json
{
  "error": "Mensaje descriptivo del error"
}
```

### Tabla resumen de codigos de error

| Codigo | Significado           | Cuando ocurre                                                   |
| ------ | --------------------- | --------------------------------------------------------------- |
| 400    | Bad Request           | Datos faltantes, invalidos o reglas de negocio incumplidas.     |
| 404    | Not Found             | Recurso solicitado inexistente.                                 |
| 409    | Conflict              | Conflictos de negocio (por ejemplo, capacidad menor a vendida). |
| 500    | Internal Server Error | Error inesperado del servidor.                                  |
