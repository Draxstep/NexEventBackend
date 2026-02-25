# NexEvent API - Documentación para el Equipo de Frontend

**Base URL:** `http://localhost:3000/api`

**Fecha de generación:** 25 de febrero de 2026

---

## Tabla de Contenidos

1. [Información General](#información-general)
2. [Categorías](#categorías)
   - [GET /api/categorias](#get-apicategorias)
   - [POST /api/categorias](#post-apicategorias)
3. [Departamentos](#departamentos)
   - [GET /api/departamentos](#get-apidepartamentos)
   - [POST /api/departamentos](#post-apidepartamentos)
   - [GET /api/departamentos/:id/ciudades](#get-apidepartamentosidciudades)
4. [Eventos](#eventos)
   - [GET /api/eventos](#get-apieventos)
   - [GET /api/eventos/activos](#get-apieventosactivos)
   - [POST /api/eventos](#post-apieventos)
   - [GET /api/eventos/:id](#get-apieventosid)
   - [PUT /api/eventos/:id](#put-apieventosid)
   - [PATCH /api/eventos/:id/estado](#patch-apieventosidestado)
5. [Intereses de Evento](#intereses-de-evento)
   - [POST /api/intereses](#post-apiintereses)
   - [GET /api/intereses/evento/:evento_id/conteo](#get-apiintereseseventoevento_idconteo)
6. [Manejo Global de Errores](#manejo-global-de-errores)

---

## Información General

- **Protocolo:** HTTP
- **Formato de datos:** JSON (`Content-Type: application/json`)
- **Autenticación:** Ningún endpoint requiere autenticación en la versión actual.
- **CORS:** Orígenes permitidos: `http://localhost:5173`, `http://localhost:5174`, `http://localhost:3000`.

---

## Categorías

---

### GET /api/categorias

**Descripción:** Obtiene la lista completa de todas las categorías registradas, ordenadas alfabéticamente por nombre. Útil para poblar selectores o filtros de categorías en formularios de creación/edición de eventos.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna un arreglo con todas las categorías ordenadas por nombre ascendente.

```json
[
  {
    "id": 1,
    "nombre": "Conferencia"
  },
  {
    "id": 2,
    "nombre": "Taller"
  }
]
```

**❌ Errores Posibles:**

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### POST /api/categorias

**Descripción:** Crea una nueva categoría de evento. Antes de llegar al controlador, el middleware `validarCreacionCategoria` verifica que el campo `nombre` sea un texto válido y no vacío. El controlador también valida la presencia del campo. Úsalo desde un panel de administración para agregar nuevas categorías.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | `Content-Type: application/json` |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| nombre | String (máx. 50 caracteres) | Sí | Nombre de la categoría. Debe ser un texto válido no vacío. Se aplica `trim()` automáticamente. |

**Ejemplo de Body (JSON):**

```json
{
  "nombre": "Conferencia"
}
```

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 201):**

La categoría fue creada exitosamente. Retorna el objeto de la categoría recién creada.

```json
{
  "id": 1,
  "nombre": "Conferencia"
}
```

**❌ Errores Posibles:**

**Status 400 (Bad Request):** El campo `nombre` no fue enviado, no es un string o está vacío. Este error es emitido por el **middleware de validación**.

```json
{
  "error": "Datos invalidos.",
  "details": "El campo 'nombre' es obligatorio y debe ser un texto valido."
}
```

**Status 400 (Bad Request):** El campo `nombre` no fue enviado. Este error es emitido por el **controlador** (si el middleware no lo atrapó).

```json
{
  "error": "El nombre de la categoria es obligatorio."
}
```

**Status 409 (Conflict):** Ya existe una categoría con ese nombre (restricción `UNIQUE`).

```json
{
  "error": "Esta categoria ya existe."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

## Departamentos

---

### GET /api/departamentos

**Descripción:** Obtiene la lista completa de todos los departamentos registrados, ordenados alfabéticamente por nombre. Útil para poblar el primer selector en un flujo de selección de ubicación (Departamento → Ciudad).

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna un arreglo con todos los departamentos ordenados por nombre ascendente.

```json
[
  {
    "id": 1,
    "nombre": "Antioquia"
  },
  {
    "id": 2,
    "nombre": "Cundinamarca"
  }
]
```

**❌ Errores Posibles:**

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### POST /api/departamentos

**Descripción:** Crea un nuevo departamento. El middleware `validarCreacionDepartamento` valida que el campo `nombre` sea un texto válido antes de llegar al controlador. Úsalo desde un panel de administración para agregar nuevos departamentos al sistema.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | `Content-Type: application/json` |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| nombre | String (máx. 100 caracteres) | Sí | Nombre del departamento. Debe ser un texto válido no vacío. Se aplica `trim()` automáticamente. |

**Ejemplo de Body (JSON):**

```json
{
  "nombre": "Antioquia"
}
```

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 201):**

El departamento fue creado exitosamente. Retorna el objeto del departamento recién creado.

```json
{
  "id": 1,
  "nombre": "Antioquia"
}
```

**❌ Errores Posibles:**

**Status 400 (Bad Request):** El campo `nombre` no fue enviado, no es un string o está vacío. Emitido por el **middleware de validación**.

```json
{
  "error": "Datos inválidos",
  "details": "El campo 'nombre' es obligatorio y debe ser un texto válido."
}
```

**Status 400 (Bad Request):** El campo `nombre` no fue enviado. Emitido por el **controlador**.

```json
{
  "error": "El nombre del departamento es obligatorio."
}
```

**Status 409 (Conflict):** Ya existe un departamento con ese nombre (restricción `UNIQUE`).

```json
{
  "error": "Este departamento ya está registrado."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### GET /api/departamentos/:id/ciudades

**Descripción:** Obtiene la lista de ciudades que pertenecen a un departamento específico, ordenadas alfabéticamente. Se usa para poblar el selector de ciudades una vez que el usuario ha seleccionado un departamento.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Integer | ID del departamento del cual se quieren obtener las ciudades. |

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna un arreglo con las ciudades del departamento indicado. Si el departamento no tiene ciudades o el ID no existe, retorna un arreglo vacío.

```json
[
  {
    "id": 1,
    "nombre": "Medellín",
    "departamento_id": 1
  },
  {
    "id": 2,
    "nombre": "Envigado",
    "departamento_id": 1
  }
]
```

**❌ Errores Posibles:**

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

## Eventos

---

### GET /api/eventos

**Descripción:** Obtiene la lista de **todos** los eventos (activos e inactivos), ordenados por fecha ascendente. Cada evento incluye información resumida junto con su categoría y ciudad asociadas. Ideal para una vista de administración o listado general.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna un arreglo de eventos con datos resumidos. Cada evento incluye objetos anidados `Categoria` y `Ciudad`.

```json
[
  {
    "id": 1,
    "nombre": "Tech Conference 2026",
    "fecha": "2026-05-15",
    "lugar": "Centro de Convenciones Plaza Mayor",
    "imagen_url": "https://ejemplo.com/imagen.jpg",
    "Categoria": {
      "id": 1,
      "nombre": "Conferencia"
    },
    "Ciudad": {
      "nombre": "Medellín"
    }
  },
  {
    "id": 2,
    "nombre": "Taller de Node.js",
    "fecha": "2026-06-20",
    "lugar": "Biblioteca EPM",
    "imagen_url": null,
    "Categoria": {
      "id": 2,
      "nombre": "Taller"
    },
    "Ciudad": {
      "nombre": "Bogotá"
    }
  }
]
```

> **Nota para el Frontend:** Los campos retornados por evento son: `id`, `nombre`, `fecha`, `lugar`, `imagen_url`. Los campos `Categoria` y `Ciudad` son objetos anidados.

**❌ Errores Posibles:**

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### GET /api/eventos/activos

**Descripción:** Obtiene la lista de eventos que están **activos** (`estado: true`), ordenados por fecha ascendente. Usa este endpoint para mostrar al público únicamente los eventos habilitados. La estructura de respuesta es idéntica a `GET /api/eventos`.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna un arreglo de eventos activos con la misma estructura que `GET /api/eventos`.

```json
[
  {
    "id": 1,
    "nombre": "Tech Conference 2026",
    "fecha": "2026-05-15",
    "lugar": "Centro de Convenciones Plaza Mayor",
    "imagen_url": "https://ejemplo.com/imagen.jpg",
    "Categoria": {
      "id": 1,
      "nombre": "Conferencia"
    },
    "Ciudad": {
      "nombre": "Medellín"
    }
  }
]
```

**❌ Errores Posibles:**

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### POST /api/eventos

**Descripción:** Crea un nuevo evento. El middleware `validarCreacionEvento` valida que los campos obligatorios estén presentes, que el nombre no exceda 100 caracteres, que la fecha no sea anterior a la fecha actual y que la imagen (si se provee) sea formato JPG o PNG. Úsalo desde el formulario de creación de eventos.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | `Content-Type: application/json` |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| nombre | String (máx. 100) | Sí | Nombre del evento. |
| fecha | String (DATEONLY) | Sí | Fecha del evento en formato `YYYY-MM-DD`. Debe ser igual o posterior a la fecha actual. |
| lugar | String (máx. 255) | Sí | Lugar físico donde se realizará el evento. |
| hora | String (TIME) | Sí | Hora del evento en formato `HH:MM:SS` o `HH:MM`. |
| categoria_id | Integer | Sí | ID de la categoría a la que pertenece el evento. Debe existir en la tabla `categorias`. |
| ciudad_id | Integer | Sí | ID de la ciudad donde se realizará el evento. Debe existir en la tabla `ciudades`. |
| descripcion | String (TEXT) | No | Descripción detallada del evento. |
| imagen_url | String (TEXT) | No | URL de la imagen del evento. Si se provee, debe terminar en `.jpg` o `.png`. |
| valor | Decimal (10,2) | No | Valor/precio del evento. |

**Ejemplo de Body (JSON):**

```json
{
  "nombre": "Tech Conference 2026",
  "fecha": "2026-05-15",
  "lugar": "Centro de Convenciones Plaza Mayor",
  "hora": "09:00:00",
  "categoria_id": 1,
  "ciudad_id": 3,
  "descripcion": "Una conferencia sobre las últimas tendencias en tecnología.",
  "imagen_url": "https://ejemplo.com/imagen-evento.jpg",
  "valor": 50000.00
}
```

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 201):**

El evento fue creado exitosamente. Retorna un mensaje de confirmación.

```json
{
  "message": "Evento agregado correctamente."
}
```

**❌ Errores Posibles:**

**Status 400 (Bad Request):** Faltan campos obligatorios. Emitido por el **middleware de validación**.

```json
{
  "error": "Faltan datos obligatorios",
  "details": "nombre, fecha, lugar, hora, categoria_id y ciudad_id son requeridos."
}
```

**Status 400 (Bad Request):** El nombre del evento supera los 100 caracteres.

```json
{
  "error": "Nombre demasiado largo",
  "details": "El nombre del evento no puede superar los 100 caracteres."
}
```

**Status 400 (Bad Request):** La fecha del evento es anterior a la fecha actual.

```json
{
  "error": "Fecha inválida",
  "details": "La fecha del evento debe ser igual o posterior a la fecha actual."
}
```

**Status 400 (Bad Request):** La imagen no tiene formato JPG o PNG.

```json
{
  "error": "La imagen debe ser formato JPG o PNG."
}
```

**Status 400 (Bad Request):** La `categoria_id` o `ciudad_id` no existen en la base de datos (violación de clave foránea).

```json
{
  "error": "Inconsistencia de datos: La categoría o la ciudad seleccionada no existe."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### GET /api/eventos/:id

**Descripción:** Obtiene el detalle completo de un evento específico por su ID. Incluye la categoría, la ciudad y el departamento al que pertenece la ciudad. Ideal para la vista de detalle de un evento.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Integer | ID del evento que se desea consultar. |

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna el objeto completo del evento con datos anidados de `Categoria`, `Ciudad` y `Departamento`. Los campos `categoria_id` y `ciudad_id` son excluidos del nivel raíz ya que la información se entrega en los objetos anidados.

```json
{
  "id": 1,
  "nombre": "Tech Conference 2026",
  "fecha": "2026-05-15",
  "lugar": "Centro de Convenciones Plaza Mayor",
  "hora": "09:00:00",
  "descripcion": "Una conferencia sobre las últimas tendencias en tecnología.",
  "imagen_url": "https://ejemplo.com/imagen-evento.jpg",
  "valor": "50000.00",
  "fecha_creacion": "2026-02-20T15:30:00.000Z",
  "estado": true,
  "Categoria": {
    "id": 1,
    "nombre": "Conferencia"
  },
  "Ciudad": {
    "id": 3,
    "nombre": "Medellín",
    "Departamento": {
      "id": 1,
      "nombre": "Antioquia"
    }
  }
}
```

> **Nota para el Frontend:** La estructura de datos anidados es: `evento.Ciudad.Departamento.nombre` para acceder al nombre del departamento. El campo `valor` se retorna como String decimal (ej. `"50000.00"`).

**❌ Errores Posibles:**

**Status 404 (Not Found):** No existe un evento con el ID proporcionado.

```json
{
  "error": "Evento no encontrado."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### PUT /api/eventos/:id

**Descripción:** Actualiza todos los datos de un evento existente. Pasa por el mismo middleware de validación que la creación (`validarCreacionEvento`), por lo que aplican las mismas reglas de validación. Úsalo desde el formulario de edición de eventos.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | `Content-Type: application/json` |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Integer | ID del evento que se desea actualizar. |

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| nombre | String (máx. 100) | Sí | Nombre del evento. |
| fecha | String (DATEONLY) | Sí | Fecha del evento en formato `YYYY-MM-DD`. Debe ser igual o posterior a la fecha actual. |
| lugar | String (máx. 255) | Sí | Lugar físico donde se realizará el evento. |
| hora | String (TIME) | Sí | Hora del evento en formato `HH:MM:SS` o `HH:MM`. |
| categoria_id | Integer | Sí | ID de la categoría. Debe existir en la tabla `categorias`. |
| ciudad_id | Integer | Sí | ID de la ciudad. Debe existir en la tabla `ciudades`. |
| descripcion | String (TEXT) | No | Descripción detallada del evento. |
| imagen_url | String (TEXT) | No | URL de la imagen del evento. Si se provee, debe terminar en `.jpg` o `.png`. |
| valor | Decimal (10,2) | No | Valor/precio del evento. |

**Ejemplo de Body (JSON):**

```json
{
  "nombre": "Tech Conference 2026 - Edición Especial",
  "fecha": "2026-06-20",
  "lugar": "Auditorio Principal Universidad Nacional",
  "hora": "10:00:00",
  "categoria_id": 1,
  "ciudad_id": 5,
  "descripcion": "Edición especial con speakers internacionales.",
  "imagen_url": "https://ejemplo.com/nueva-imagen.png",
  "valor": 75000.00
}
```

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 201):**

El evento fue actualizado exitosamente. Retorna un mensaje de confirmación junto con el objeto del evento actualizado.

```json
{
  "message": "Evento actualizado correctamente.",
  "evento": {
    "id": 1,
    "nombre": "Tech Conference 2026 - Edición Especial",
    "fecha": "2026-06-20",
    "lugar": "Auditorio Principal Universidad Nacional",
    "hora": "10:00:00",
    "categoria_id": 1,
    "descripcion": "Edición especial con speakers internacionales.",
    "imagen_url": "https://ejemplo.com/nueva-imagen.png",
    "valor": "75000.00",
    "fecha_creacion": "2026-02-20T15:30:00.000Z",
    "ciudad_id": 5,
    "estado": true
  }
}
```

**❌ Errores Posibles:**

**Status 400 (Bad Request):** Faltan campos obligatorios (middleware de validación). Mismos errores que en `POST /api/eventos`.

```json
{
  "error": "Faltan datos obligatorios",
  "details": "nombre, fecha, lugar, hora, categoria_id y ciudad_id son requeridos."
}
```

**Status 400 (Bad Request):** La `categoria_id` o `ciudad_id` no existen en la base de datos.

```json
{
  "error": "Inconsistencia de datos: La categoría o la ciudad seleccionada no existe."
}
```

**Status 404 (Not Found):** No existe un evento con el ID proporcionado.

```json
{
  "error": "Evento no encontrado."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### PATCH /api/eventos/:id/estado

**Descripción:** Alterna (toggle) el estado de un evento entre activo (`true`) e inactivo (`false`). Si el evento está activo, pasa a inactivo y viceversa. Útil para activar/desactivar eventos desde un panel de administración sin necesidad de eliminarlos.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Integer | ID del evento cuyo estado se desea cambiar. |

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica (el estado se alterna automáticamente).

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

El estado fue cambiado exitosamente. El mensaje varía dependiendo del nuevo estado.

**Cuando el evento se activa:**

```json
{
  "message": "Evento activado.",
  "evento": {
    "id": 1,
    "nombre": "Tech Conference 2026",
    "fecha": "2026-05-15",
    "lugar": "Centro de Convenciones Plaza Mayor",
    "hora": "09:00:00",
    "categoria_id": 1,
    "descripcion": "Una conferencia sobre las últimas tendencias.",
    "imagen_url": "https://ejemplo.com/imagen.jpg",
    "valor": "50000.00",
    "fecha_creacion": "2026-02-20T15:30:00.000Z",
    "ciudad_id": 3,
    "estado": true
  }
}
```

**Cuando el evento se inactiva:**

```json
{
  "message": "Evento inactivado.",
  "evento": {
    "id": 1,
    "nombre": "Tech Conference 2026",
    "estado": false
  }
}
```

> **Nota para el Frontend:** Puedes usar el campo `evento.estado` del response para actualizar la UI inmediatamente sin necesidad de hacer otra petición GET.

**❌ Errores Posibles:**

**Status 404 (Not Found):** No existe un evento con el ID proporcionado.

```json
{
  "error": "Evento no encontrado."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

## Intereses de Evento

---

### POST /api/intereses

**Descripción:** Registra un nuevo interés (like/me interesa) sobre un evento. Cada llamada a este endpoint crea un nuevo registro de interés. No requiere autenticación ni identifica al usuario, simplemente incrementa el conteo. Úsalo cuando un usuario hace clic en "Me interesa" en la vista de un evento.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | `Content-Type: application/json` |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):** Ninguno

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| evento_id | Integer | Sí | ID del evento sobre el cual se registra el interés. Debe existir en la tabla `eventos`. |

**Ejemplo de Body (JSON):**

```json
{
  "evento_id": 1
}
```

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 201):**

El interés fue registrado exitosamente. Retorna un mensaje de confirmación junto con el objeto del interés creado.

```json
{
  "message": "Interés registrado exitosamente.",
  "interes": {
    "id": 15,
    "evento_id": 1,
    "fecha_creacion": "2026-02-25T14:30:00.000Z"
  }
}
```

**❌ Errores Posibles:**

**Status 400 (Bad Request):** El campo `evento_id` no fue enviado en el body.

```json
{
  "error": "El ID del evento es obligatorio."
}
```

**Status 404 (Not Found):** El evento con el `evento_id` proporcionado no existe.

```json
{
  "error": "El evento no existe."
}
```

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

### GET /api/intereses/evento/:evento_id/conteo

**Descripción:** Obtiene el número total de intereses registrados para un evento específico. Úsalo para mostrar el contador de "Me interesa" junto a un evento.

#### 🔒 Autenticación y Headers

| Propiedad | Valor |
|---|---|
| Requiere Token | No |
| Roles permitidos | Cualquiera |
| Headers extra | Ninguno |

#### 📥 Parámetros de la Solicitud (Request)

**Parámetros de Ruta (Path):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| evento_id | Integer | ID del evento del cual se quiere obtener el conteo de intereses. |

**Parámetros de Consulta (Query):** Ninguno

**Cuerpo de la Solicitud (Body):** No aplica

#### 📤 Respuestas (Responses)

**✅ Éxito (Status 200):**

Retorna el ID del evento y el total de interesados. Si el evento no tiene intereses o el ID no existe, retorna `total_interesados: 0`.

```json
{
  "evento_id": 1,
  "total_interesados": 42
}
```

**❌ Errores Posibles:**

**Status 500 (Internal Server Error):** Error inesperado en el servidor.

```json
{
  "error": "Error interno del servidor"
}
```

---

## Manejo Global de Errores

El backend cuenta con un middleware global de manejo de errores (`errorHandler`). Cualquier error no controlado en los controladores o servicios que sea capturado por el `asyncHandler` será procesado por este middleware.

### Comportamiento:

- Si el error tiene un `statusCode` definido (errores personalizados como 404, 409, etc.), se retorna ese código con el mensaje del error.
- Si el error **no** tiene un `statusCode`, se retorna un **Status 500** con un mensaje genérico.

### Formato estándar de error:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

### Tabla resumen de códigos de error:

| Código | Significado | Cuándo ocurre |
|---|---|---|
| 400 | Bad Request | Datos de entrada faltantes, inválidos o inconsistentes (ej. clave foránea inexistente). |
| 404 | Not Found | El recurso solicitado (evento, etc.) no existe. |
| 409 | Conflict | Se intenta crear un registro que viola una restricción de unicidad (ej. categoría o departamento duplicado). |
| 500 | Internal Server Error | Error inesperado del servidor. El mensaje real se oculta al cliente por seguridad. |
