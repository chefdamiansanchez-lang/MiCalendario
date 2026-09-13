# Doce Meses — Calendario

App web (PWA) de calendario: cada mes muestra una foto real de paisaje acorde
a su estación, tiene agenda por día y recordatorios con notificación tipo alarma.

## Qué incluye

- 12 meses, cada uno con una foto de paisaje distinta y acorde a la estación
  del año en el hemisferio sur (verano en dic-ene-feb, otoño en mar-abr-may,
  invierno en jun-jul-ago, primavera en sep-oct-nov). Fotos reales, libres de
  uso (licencia CC0, vía isorepublic.com).
- Calendario mensual con navegación (‹ ›) y botón para volver a "Hoy".
- Reloj y fecha en formato 24 hs.
- Al tocar un día se abre su agenda: podés anotar texto, hora y marcar
  "Avisarme con alarma".
- Colores sólidos, sin degradados decorativos.
- Instalable como app (PWA): manifest + ícono + funcionamiento offline del
  shell de la app.
- Los datos (eventos) se guardan en el propio celular (localStorage), no hay
  servidor.

## Importante sobre la alarma

Esto es una app web, no una app nativa compilada. La alarma funciona así:

- Si tenés la app abierta (o la abrís de nuevo) cerca del horario del
  recordatorio, te muestra una notificación / aviso.
- Si el celular apaga la app por completo o pasa mucho tiempo, un navegador
  no puede "despertar" solo para sonar una alarma exacta — eso requiere una
  app nativa de verdad. Por eso, al reabrir la app, revisa si quedó algún
  recordatorio pendiente de las últimas horas y te avisa igual.

Es la mejor aproximación posible sin pasar por Android Studio / Google Play.

## Cómo subirlo a GitHub Pages

1. Creá un repositorio nuevo en GitHub (por ejemplo `calendario-app`).
2. Subí todos los archivos de esta carpeta a la raíz del repo (podés
   arrastrarlos desde la web de GitHub con "Add file → Upload files", o con
   git desde tu PC).
3. Andá a **Settings → Pages**.
4. En "Source" elegí la rama `main` y la carpeta `/ (root)`. Guardá.
5. Esperá un minuto y entrá a la URL que te da GitHub
   (`https://tu-usuario.github.io/calendario-app/`).

## Cómo instalarla en el celular

1. Abrí la URL de GitHub Pages en Chrome (Android).
2. Tocá el menú (⋮) → **"Instalar app"** o **"Agregar a pantalla de inicio"**.
3. Quedará con ícono propio, sin barra del navegador, como una app más.

## Estructura de archivos

```
index.html          → estructura de la app
style.css           → estilos (colores sólidos, tipografía)
app.js              → calendario, agenda, recordatorios, reloj
manifest.json        → configuración de instalación (PWA)
service-worker.js    → funcionamiento offline del shell de la app
icons/               → íconos de la app (192, 512 y 512 maskable)
```

## Créditos de imágenes

Fotos de paisajes bajo licencia CC0 (uso libre, comercial y personal) de
[isorepublic.com](https://isorepublic.com/license/).
