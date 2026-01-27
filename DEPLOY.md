# 🚀 Guía Rápida de Deploy - Olala Laundry Dashboard

## ✅ Lo que tienes listo

Ya tienes todos los archivos necesarios. Ahora solo necesitas:

1. Tu archivo `service_account.json`
2. Elegir dónde deployar (Vercel, Railway, o Render)

---

## 🎯 OPCIÓN 1: Deploy en Vercel (MÁS FÁCIL - RECOMENDADO)

### Paso a Paso:

#### 1. Crear cuenta en Vercel

Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita con tu email o GitHub.

#### 2. Subir el proyecto

**Opción A - Desde tu computadora:**

1. Descarga e instala [Vercel CLI](https://vercel.com/download)
2. Abre terminal en la carpeta del proyecto
3. Ejecuta:
   ```bash
   vercel login
   vercel
   ```
4. Sigue las instrucciones (presiona Enter para opciones por defecto)

**Opción B - Desde GitHub:**

1. Sube el proyecto a GitHub (sin `service_account.json` ni `.env`)
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Conecta tu repositorio de GitHub
4. Click en "Import"

#### 3. Configurar Variables de Entorno

Una vez deployado, en el dashboard de Vercel:

1. Ve a tu proyecto → Settings → Environment Variables
2. Añade estas variables:

**Variable 1:**
- Name: `FOLDER_ID`
- Value: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`

**Variable 2:**
- Name: `GOOGLE_SERVICE_ACCOUNT`
- Value: Abre tu `service_account.json`, copia TODO el contenido (debe ser una línea) y pégalo aquí

Ejemplo del contenido que debes pegar:
```json
{"type":"service_account","project_id":"olala-123456","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...","client_email":"laundry@olala-123456.iam.gserviceaccount.com"}
```

⚠️ **IMPORTANTE**: Debe ser TODO el JSON en una sola línea, sin saltos de línea adicionales.

#### 4. Redeploy

Después de añadir las variables:
1. Ve a "Deployments" en tu proyecto
2. Click en los 3 puntos del último deployment
3. Click "Redeploy"

#### 5. ¡Listo!

Tu dashboard estará disponible en: `https://tu-proyecto.vercel.app`

Comparte este link con tu equipo y todos podrán acceder.

---

## 🎯 OPCIÓN 2: Deploy en Railway

### Paso a Paso:

#### 1. Crear cuenta

Ve a [railway.app](https://railway.app) y crea cuenta gratuita.

#### 2. Nuevo proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub"
3. Conecta tu repositorio (debe estar en GitHub)
4. Railway detectará automáticamente que es un proyecto Node.js

#### 3. Variables de Entorno

En el dashboard del proyecto:

1. Click en tu servicio
2. Ve a "Variables"
3. Añade:
   - `FOLDER_ID`: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`
   - `GOOGLE_SERVICE_ACCOUNT`: (pega todo el JSON del service_account.json)

#### 4. Deploy

Railway hará deploy automáticamente. Te dará una URL pública.

---

## 🎯 OPCIÓN 3: Deploy en Render

### Paso a Paso:

#### 1. Crear cuenta

Ve a [render.com](https://render.com) y crea cuenta gratuita.

#### 2. Nuevo Web Service

1. Click en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: olala-laundry
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 3. Variables de Entorno

En "Environment":

1. Añade `FOLDER_ID`: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`
2. Añade `GOOGLE_SERVICE_ACCOUNT`: (pega todo el JSON)

#### 4. Deploy

Click en "Create Web Service". Render hará el deploy automáticamente.

---

## 🧪 Probar Localmente Primero

Antes de deployar, prueba que todo funcione local:

```bash
# 1. Instalar dependencias
npm install

# 2. Coloca service_account.json en la raíz del proyecto

# 3. Crear archivo .env
cp .env.example .env

# 4. Ejecutar servidor
npm start

# 5. Abre http://localhost:3000 en tu navegador
```

Si funciona local, funcionará en producción.

---

## 🔧 Verificar que el Service Account tiene acceso

1. Ve a Google Drive
2. Abre la carpeta con ID: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`
3. Click en "Share"
4. Verifica que el email del service account (está en `service_account.json` como `client_email`) aparezca con permisos de "Editor"

Si no aparece:
1. Copia el `client_email` de tu `service_account.json`
2. En Google Drive, click "Share" en la carpeta
3. Pega el email y dale permisos de "Editor"

---

## ❓ Problemas Comunes

### "Error loading service account"

**Solución**: Verifica que el JSON del service account esté completo y en una sola línea.

### "Cannot read properties of undefined"

**Solución**: Las variables de entorno no están configuradas correctamente. Revisa que hayas copiado TODO el JSON.

### "403 Forbidden"

**Solución**: El service account no tiene permisos en Google Sheets. Añádelo como Editor.

### "Files not found"

**Solución**: Verifica que el FOLDER_ID sea correcto y que los archivos tengan "2026" en el nombre.

---

## 📱 Compartir con tu Equipo

Una vez deployado:

1. Copia la URL pública (ej: `https://olala-laundry.vercel.app`)
2. Compártela con tu equipo
3. No necesitan instalar nada
4. Funciona en cualquier dispositivo (PC, tablet, móvil)
5. Los datos siempre estarán actualizados desde Google Sheets

---

## 🎉 ¡Listo!

Tu dashboard está funcionando. Ahora tu equipo puede:
- Ver pedidos consolidados
- Filtrar por ciudad y building
- Filtrar por fechas
- Refrescar datos en tiempo real

**¿Necesitas ayuda?** Revisa el README.md completo o los logs de tu plataforma de hosting.
