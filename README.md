# Platinum Autoservicios — Sitio Web Completo

## 📁 Estructura del Proyecto

```
platinum-autoservicios/
├── index.html              ← Página principal (todo el contenido)
├── sw.js                   ← Service Worker (PWA / offline)
├── README.md               ← Este archivo
├── css/
│   └── styles.css          ← Todos los estilos
├── js/
│   └── main.js             ← Toda la lógica JavaScript
└── assets/
    └── img/
        ├── logo.png
        ├── letrero.png
        ├── vehiculos.png
        ├── toldo.png
        ├── gomas.png
        ├── entrada.png
        ├── mas_vehiculos.png
        └── ubicanos.png
```

---

## 🚀 Abrir en VS Code y correr localmente

1. Descomprime el ZIP
2. Abre la carpeta en **VS Code**
3. Instala la extensión **Live Server** (si no la tienes)
4. Clic derecho en `index.html` → **Open with Live Server**
5. Se abre en `http://127.0.0.1:5500`

---

## 🔐 Sistema de Facturación

- Acceso: botón **"Panel"** en el footer del sitio
- Clave por defecto: **`1234`**
- Para cambiarla: abre `js/main.js` y busca `pin: '1234'`

### Funciones del panel:
- ✅ Crear facturas con número automático
- ➕ Agregar/eliminar ítems dinámicamente
- 💰 Cálculo automático de subtotal, ITBIS y total
- 👁️ Vista previa del documento idéntico al diseño oficial
- 🖨️ Imprimir / Guardar como PDF (Imprimir → Guardar como PDF)
- 📱 Enviar resumen al cliente por WhatsApp
- 📋 Lista de todas las facturas con búsqueda y filtros
- 📊 Estadísticas: total, pagadas, pendientes, ingresos

---

## ✏️ Cambios rápidos

| Qué cambiar | Dónde |
|---|---|
| Clave del panel | `js/main.js` → `pin: '1234'` |
| Teléfono | `js/main.js` → `phone: '18493417621'` |
| Cuentas bancarias | `js/main.js` → `banco1`, `banco2`, `titular` |
| Redes sociales | `index.html` → busca `platinumautoservicios` |
| Formulario Formspree | `index.html` → busca `YOUR_FORM_ID` (2 veces) |
| Google Analytics | `index.html` → descomenta el bloque GA4 al final |

---

## 🌐 Deploy en Vercel

```bash
# Desde Git Bash, dentro de la carpeta del proyecto:
git init
git add .
git commit -m "feat: Platinum Autoservicios - sitio completo con facturación"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/platinum-autoservicios.git
git push -u origin main
```

Luego en **vercel.com**:
1. New Project → importar el repositorio
2. Framework: **Other**
3. Output Directory: `./`
4. Build Command: *(vacío)*
5. Deploy ✅

---

## ✅ Checklist antes de entregar al cliente

- [ ] Cambiar `pin: '1234'` por una clave segura en `js/main.js`
- [ ] Reemplazar `YOUR_FORM_ID` (×2) con ID real de Formspree
- [ ] Actualizar URLs de Instagram y Facebook
- [ ] Verificar cuentas bancarias en `js/main.js`
- [ ] Probar el panel de facturación
- [ ] Probar imprimir/guardar una factura como PDF
- [ ] Probar envío por WhatsApp
- [ ] Hacer `git push` y deployar en Vercel

---

## 📞 Info del negocio

| Campo | Valor |
|---|---|
| Teléfono | 849-341-7621 |
| WhatsApp | wa.me/18493417621 |
| Correo | ventas@platinumautoservicios.com |
| Dirección | Entrada Cabañas Las Palmas, Barrio Ensanche Sinaí |
| Horario | Lunes – Sábado: 8:00 AM – 7:00 PM |
