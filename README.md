# 🧺 Olala Laundry Dashboard 2026

Dashboard moderno para tracking de pedidos de lavandería desde Google Sheets.

## 📋 Características

- ✅ Filtros por Ciudad, Building y Rango de Fechas
- ✅ Dashboard consolidado con estadísticas en tiempo real
- ✅ Diseño moderno y responsive
- ✅ Conexión directa a Google Sheets
- ✅ Actualización automática de datos

## 🚀 Instalación Local

### 1. Prerrequisitos

- Node.js 18+ instalado
- Tu archivo `service_account.json` de Google Cloud

### 2. Configuración

```bash
# Clonar o descargar los archivos
cd olala-laundry-dashboard

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
```

### 3. Configurar Service Account

Coloca tu archivo `service_account.json` en la raíz del proyecto:

```
olala-laundry-dashboard/
├── server.js
├── package.json
├── service_account.json  ← Aquí
├── .env
└── public/
    └── index.html
```

### 4. Ejecutar Localmente

```bash
npm start
```

Abre tu navegador en: `http://localhost:3000`

## 🌐 Deploy en Vercel (RECOMENDADO)

### Paso 1: Preparar el proyecto

1. Crea una cuenta gratuita en [Vercel](https://vercel.com)
2. Instala Vercel CLI (opcional):

```bash
npm i -g vercel
```

### Paso 2: Deploy

**Opción A: Deploy desde la terminal**

```bash
vercel
```

**Opción B: Deploy desde GitHub**

1. Sube el proyecto a GitHub
2. Conecta tu repositorio en Vercel
3. Vercel detectará automáticamente el proyecto

### Paso 3: Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto → Settings → Environment Variables:

1. **FOLDER_ID**: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`
2. **GOOGLE_SERVICE_ACCOUNT**: Pega TODO el contenido de tu `service_account.json` aquí (como texto)

Ejemplo de cómo pegar GOOGLE_SERVICE_ACCOUNT:
```json
{"type":"service_account","project_id":"tu-proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"...","client_id":"..."}
```

⚠️ **IMPORTANTE**: Copia TODO el JSON en una sola línea.

### Paso 4: Redeploy

Después de añadir las variables, haz redeploy del proyecto.

## 🔧 Deploy en Railway

1. Crea cuenta en [Railway](https://railway.app)
2. Crea nuevo proyecto → Deploy from GitHub
3. Añade variables de entorno:
   - `FOLDER_ID`
   - `GOOGLE_SERVICE_ACCOUNT`
4. Railway detectará automáticamente el `package.json` y ejecutará `npm start`

## 🔧 Deploy en Render

1. Crea cuenta en [Render](https://render.com)
2. New → Web Service
3. Conecta tu repositorio
4. Configuración:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Añade variables de entorno en el dashboard

## 📂 Estructura del Proyecto

```
olala-laundry-dashboard/
├── server.js              # Backend Node.js + Express
├── package.json           # Dependencias
├── service_account.json   # Credenciales Google (NO subir a Git)
├── .env                   # Variables locales (NO subir a Git)
├── .env.example          # Template de variables
├── .gitignore            # Archivos ignorados por Git
├── README.md             # Esta documentación
└── public/
    └── index.html        # Frontend React
```

## 🔐 Seguridad

- ⚠️ **NUNCA** subas `service_account.json` a GitHub
- ⚠️ **NUNCA** subas `.env` a GitHub
- ✅ Usa variables de entorno en producción
- ✅ El `.gitignore` ya está configurado para proteger estos archivos

## 🐛 Troubleshooting

### Error: "Service account not configured"

**Solución**: Verifica que:
1. El archivo `service_account.json` esté en la raíz del proyecto
2. O que la variable `GOOGLE_SERVICE_ACCOUNT` esté configurada en producción

### Error: "Cannot find module 'googleapis'"

**Solución**:
```bash
npm install
```

### Los datos no se cargan

**Solución**: Verifica que:
1. El Service Account tiene acceso de "Editor" a los Google Sheets
2. El FOLDER_ID es correcto
3. Los archivos contienen "2026" en el nombre

### La app funciona local pero no en producción

**Solución**:
1. Verifica que las variables de entorno estén configuradas en el hosting
2. Revisa los logs del hosting para ver errores específicos

## 📊 Uso

1. **Filtrar por Ciudad**: Selecciona la ciudad en el dropdown
2. **Filtrar por Building**: Selecciona el edificio específico
3. **Filtrar por Fechas**: Usa los selectores de fecha inicio/fin
4. **Refrescar Datos**: Click en el botón "🔄 Refrescar"

## 🔄 Actualización de Datos

Los datos se actualizan:
- Al cargar la página
- Al hacer click en "Refrescar"
- Los filtros se aplican en tiempo real

## 🎨 Personalización

Para cambiar colores o estilos, edita el archivo `public/index.html` en la sección `<style>`.

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección de Troubleshooting
2. Verifica los logs del servidor: `npm start`
3. Comprueba que el Service Account tiene permisos

## 📝 Notas

- El sistema lee automáticamente todas las hojas de Google Sheets en el folder especificado
- Solo procesa archivos que contengan "2026" en el nombre
- Ignora hojas como "info apt", "breezewaydata", "formulas", etc.
- Busca columnas con "Prenda" o "Artículo" y "Reposición" o "Pedido"

## 🌟 Próximas Mejoras

- [ ] Exportar a Excel/PDF
- [ ] Gráficos de tendencias
- [ ] Alertas de stock bajo
- [ ] Histórico de pedidos
- [ ] Sistema de notificaciones

---

Hecho con ❤️ para Olala Homes
