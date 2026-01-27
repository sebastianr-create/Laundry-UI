# 🎉 ¡Tu Dashboard está Listo!

## 📦 ¿Qué hay en el ZIP?

He creado una **aplicación web completa** para tu equipo de Olala Homes. Incluye:

- ✅ **Frontend moderno** con React (diseño profesional)
- ✅ **Backend en Node.js** que lee tus Google Sheets
- ✅ **Filtros** por Ciudad, Building y Fechas
- ✅ **Dashboard consolidado** con estadísticas
- ✅ **Scripts de instalación** automática
- ✅ **Documentación completa** en español

---

## 🚀 Cómo Empezar

### Opción 1: Instalar Localmente (Para probar)

1. **Descomprime el ZIP** en una carpeta
2. **Coloca tu `service_account.json`** en esa carpeta
3. **Ejecuta el script de instalación:**
   - **Windows**: Doble click en `setup.bat`
   - **Mac/Linux**: Abre terminal y ejecuta `./setup.sh`
4. **Inicia el servidor:** `npm start`
5. **Abre tu navegador:** http://localhost:3000

### Opción 2: Deploy en Internet (Para todo tu equipo)

**RECOMENDADO: Vercel (Gratis y fácil)**

1. **Lee el archivo `DEPLOY.md`** - tiene instrucciones paso a paso
2. **Sube el proyecto a GitHub** (sin service_account.json)
3. **Conecta con Vercel** en vercel.com
4. **Configura 2 variables de entorno:**
   - `FOLDER_ID`: `19D6nBJi6Z08VR7LeLfmy6w6P-2hMAOl2`
   - `GOOGLE_SERVICE_ACCOUNT`: (pega TODO el JSON de tu service_account.json)
5. **¡Listo!** Tendrás una URL como: `https://olala-laundry.vercel.app`

---

## 📚 Documentación Incluida

- **`README.md`** - Documentación técnica completa
- **`DEPLOY.md`** - Guía detallada de deployment
- **`QUICKSTART.md`** - Guía rápida en 3 pasos

---

## 🔧 Lo que Necesitas

1. **Node.js 18+** instalado (descarga de nodejs.org)
2. **Tu archivo `service_account.json`** de Google Cloud
3. **Acceso a los Google Sheets** con el service account

---

## ✨ Características de la App

### Filtros Disponibles:
- 🏙️ **Ciudad** (Barcelona, Madrid, Sur, Granada)
- 🏢 **Building** (Urban, Design, Forum, etc.)
- 📅 **Rango de fechas** (inicio y fin)

### Dashboard Muestra:
- 📊 Total de items únicos
- 📦 Cantidad total consolidada
- 📈 Promedio por item
- 📋 Lista completa ordenada por cantidad

### Funcionalidades:
- 🔄 Botón de refrescar datos
- 📱 Diseño responsive (funciona en móvil)
- ⚡ Datos en tiempo real desde Google Sheets
- 🎨 Interfaz moderna con gradientes y animaciones

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- El `.gitignore` está configurado para proteger `service_account.json`
- NUNCA subas `service_account.json` a GitHub
- Usa variables de entorno en producción
- El proyecto incluye todas las medidas de seguridad necesarias

---

## 🆘 ¿Necesitas Ayuda?

### Problema: "Service account not configured"
**Solución:** Asegúrate de que:
- El archivo `service_account.json` esté en la raíz del proyecto
- O que la variable `GOOGLE_SERVICE_ACCOUNT` esté configurada en producción

### Problema: No se cargan los datos
**Solución:** Verifica que:
1. El service account tenga permisos de "Editor" en los Google Sheets
2. El FOLDER_ID sea correcto
3. Los archivos contengan "2026" en el nombre

### Problema: Error al instalar
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Cómo Funciona

1. **El backend** lee automáticamente todos los Google Sheets en el folder
2. **Busca las columnas** "Tipo de prenda" y "Pedido reposición"
3. **Lee los datos** de BreezewayDATA para los buildings
4. **Consolida** las cantidades por prenda
5. **El frontend** muestra los datos con filtros interactivos

---

## 🎯 Próximos Pasos

1. **Prueba localmente** con `npm start`
2. **Verifica que los datos se cargan** correctamente
3. **Deploy en Vercel** para que tu equipo acceda
4. **Comparte la URL** con tu equipo

---

## 💡 Tips

- Los datos se actualizan cada vez que cargas la página
- Puedes dar acceso a múltiples personas sin instalar nada
- El hosting en Vercel es gratis y muy confiable
- Si necesitas más features, el código es fácil de extender

---

## 📞 Estructura del Proyecto

```
olala-laundry-dashboard/
├── server.js              # Backend que lee Google Sheets
├── public/
│   └── index.html         # Frontend con React
├── package.json           # Dependencias
├── .env.example          # Template de configuración
├── setup.sh              # Instalación automática (Mac/Linux)
├── setup.bat             # Instalación automática (Windows)
├── vercel.json           # Configuración para Vercel
├── README.md             # Documentación completa
├── DEPLOY.md             # Guía de deployment
└── QUICKSTART.md         # Guía rápida
```

---

## 🌟 Hecho para Olala Homes

Esta aplicación está diseñada específicamente para:
- Tracking de pedidos de lavandería
- Consolidación por ciudad y building
- Uso interno del equipo
- Fácil deployment y mantenimiento

**¡Disfruta tu nuevo dashboard!** 🎉

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0
