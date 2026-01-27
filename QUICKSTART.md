# ⚡ Quick Start - Olala Laundry Dashboard

## 🎯 En 3 Pasos:

### 1️⃣ Instalar Dependencias

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

**Manual:**
```bash
npm install
cp .env.example .env
# Coloca service_account.json en la raíz
```

### 2️⃣ Iniciar Servidor

```bash
npm start
```

### 3️⃣ Abrir Dashboard

Abre tu navegador en: **http://localhost:3000**

---

## 🌐 Deploy en Internet (Para que todo tu equipo acceda)

### Vercel (Más Fácil - 5 minutos):

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configurar variables de entorno en vercel.com
# FOLDER_ID: 19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2
# GOOGLE_SERVICE_ACCOUNT: (pega todo el JSON de service_account.json)

# 5. Redeploy
vercel --prod
```

**¡Listo!** Tu URL será algo como: `https://olala-laundry-xyz.vercel.app`

---

## 📁 Estructura de Archivos

```
olala-laundry-dashboard/
├── 📄 server.js              ← Backend
├── 📄 package.json           ← Dependencias
├── 📄 service_account.json   ← TUS CREDENCIALES (no subir a Git)
├── 📄 .env                   ← Variables locales (no subir a Git)
├── 📁 public/
│   └── 📄 index.html         ← Frontend
└── 📄 README.md              ← Documentación completa
```

---

## ✅ Checklist Pre-Deploy

- [ ] `service_account.json` tiene permisos en Google Drive
- [ ] FOLDER_ID es correcto: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`
- [ ] Los archivos de Google Sheets tienen "2026" en el nombre
- [ ] Funciona localmente (`npm start`)
- [ ] Variables de entorno configuradas en el hosting

---

## 🆘 Ayuda Rápida

**No carga datos:**
- Verifica que el service account tenga acceso a los sheets
- Revisa que FOLDER_ID sea correcto

**Error al instalar:**
- Actualiza Node.js a versión 18+
- Ejecuta `npm install` de nuevo

**Funciona local pero no en producción:**
- Configura las variables de entorno en tu hosting
- Verifica los logs del hosting

---

## 📚 Más Información

- **Documentación completa**: Ver `README.md`
- **Guía de deploy detallada**: Ver `DEPLOY.md`
- **Hosting recomendado**: Vercel, Railway, Render (todos gratis)

---

Made with ❤️ for Olala Homes
