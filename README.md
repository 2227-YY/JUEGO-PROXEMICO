# 🌐 ¡PROXÉMICA EN ACCIÓN! - Juego Educativo Interactivo

¡Bienvenido a **¡Proxémica en Acción!**, una aplicación web educativa, lúdica y moderna diseñada para que los estudiantes aprendan y dominen los principios de la **comunicación proxémica**, el uso del espacio personal y las normas de convivencia social mediante retos interactivos, competencia por equipos y una mascota inteligente animada llamada **Proxi**.

---

## 🚀 Características Principales

1. **Competencia por Equipos**:
   - Personalización interactiva de nombres de dos equipos y selección de emblemas (⚡, 🛡️, 🦁, 🐬, 🚀, 🌟, 🔥, 🪐).
   - Marcador superior permanente con visualización en tiempo real del puntaje, ronda en curso y turnos alternados con efectos luminosos de neón.

2. **Mascota Animada "Proxi"**:
   - Robot-explorador animado en SVG puro con antenas que pulsan, ojos digitales expresivos y boca que se mueve al hablar (`.is-speaking`).
   - Acompañamiento constante: da la bienvenida, explica las reglas, anuncia turnos, celebra aciertos, explica errores amablemente y proclama al ganador.
   - **Locución por Síntesis de Voz**: Utiliza la Web Speech API nativa del navegador en español, con botón de activación/silencio (🔊 / 🔇) y botón para repetir la voz.
   - **Efectos de Sonido Sintetizados**: Con Web Audio API nativo (sin archivos externos pesados).

3. **Ronda 1: Unir Conceptos (Matching Cards)**:
   - Dos columnas interactivas: Conceptos vs Definiciones (desordenadas aleatoriamente).
   - Incluye los 6 conceptos requeridos:
     * **Proxémica**
     * **Distancia íntima** (0 a 45 cm)
     * **Distancia personal** (45 cm a 1.20 m)
     * **Distancia social** (1.20 a 3.60 m)
     * **Distancia pública** (> 3.60 m)
     * **Respeto del espacio personal**
   - **+10 puntos** por cada acierto, con animación de tarjeta emparejada con el color del equipo en turno y cambio alternado de turno.

4. **Ronda 2: Completar Frases (Opción Múltiple)**:
   - 8 frases y situaciones contextualizadas sobre el espacio personal, ascensores/transporte, el contexto cultural (Edward T. Hall), la empatía y la flexibilidad de la burbuja proxémica.
   - **+15 puntos** por cada respuesta correcta.
   - Explicación pedagógica detallada inmediata después de cada respuesta.

5. **Integración Segura con Google Gemini API**:
   - Servidor backend en Node.js (`server.js`) que protege la clave de API en variables de entorno (`.env`).
   - Botón *"Pedir pista a Proxi"*: envía el contexto al endpoint seguro `/api/hint`, donde Gemini formula pistas sutiles y pedagógicas sin revelar la respuesta directa.
   - **Modo Fallback Offline**: Si no se dispone de API Key o si se abre el juego sin servidor, el juego sigue funcionando al 100% gracias a un banco de pistas expertas precargadas.

6. **Pantalla Final y Celebración**:
   - Lluvia de confeti animada en `<canvas>`.
   - Comparativa de puntos, anuncio del Campeón Proxémico o declaración de Empate Histórico.
   - Cuadro resumen con las 4 distancias y la Regla de Oro del espacio personal.
   - Opciones para jugar revancha o iniciar nueva partida.

---

## 📁 Estructura del Proyecto

```plaintext
proxemica-en-accion/
├── index.html          # Estructura semántica, accesibilidad y contenedores del juego
├── styles.css          # Diseño moderno, juvenil, glassmorphism, animaciones y responsive
├── script.js           # Lógica del juego, sintetizador de audio, voz, turnos y pistas
├── server.js           # Servidor Node.js backend seguro para la integración con Gemini
├── package.json        # Configuración de dependencias y scripts de ejecución
├── .env.example        # Plantilla de configuración para la clave de Google Gemini
├── .gitignore          # Archivos omitidos en el control de versiones
└── README.md           # Guía completa de instalación y uso
```

---

## ⚙️ Requisitos Previos

- **Node.js** (versión 18 o superior recomendada, testeado en Node v24).
- Un navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- *(Opcional)* Clave de API de Google Gemini (puedes obtenerla gratis en [Google AI Studio](https://aistudio.google.com/)).

---

## 🛠️ Instrucciones de Instalación y Ejecución

### Opción A: Modo Completo con Servidor e Inteligencia Artificial (Recomendada)

1. **Abrir la terminal** en la carpeta del proyecto:
   ```bash
   cd "C:\Users\SANTY&PIPE\.gemini\antigravity\scratch\proxemica-en-accion"
   ```

2. **Instalar dependencias de Node.js**:
   ```bash
   npm install
   ```

3. **Configurar la Clave de Google Gemini**:
   - Crea una copia del archivo `.env.example` y nómbrala `.env`:
     ```bash
     copy .env.example .env
     ```
   - Abre `.env` y coloca tu clave de API:
     ```env
     GEMINI_API_KEY=AIzaSy...tu_clave_real_aqui
     PORT=3000
     ```

4. **Iniciar el Servidor**:
   ```bash
   npm start
   ```
   *(o alternativamente: `node server.js`)*

5. **Abrir en tus dispositivos**:
   - **En tu computador**: [http://localhost:3000](http://localhost:3000)
   - **En tu celular o tableta (mismo Wi-Fi)**: Ingresa la dirección IP de tu red local que muestra la consola al iniciar (ej. `http://192.168.40.175:3000`).

---

### Opción B: Modo Rápido / Autónomo (Sin instalar nada)

Si deseas probar el juego de forma inmediata sin configurar un servidor:
1. Simplemente haz doble clic en el archivo **`index.html`** o ábrelo en cualquier navegador web.
2. El juego se ejecutará con todas sus funciones visuales, audio, voz y el banco de pistas pedagógicas precargadas de Proxi.

---

## 📚 Fundamento Teórico Educativo: Las Distancias de Hall

El antropólogo estadounidense **Edward T. Hall** definió en 1963 la **Proxémica** como el estudio de cómo el ser humano estructura, utiliza y percibe inconscientemente el espacio físico en sus interacciones cotidianas.

| Zona | Rango de Distancia | Situaciones Típicas |
| :--- | :--- | :--- |
| **Distancia Íntima** | `0 a 45 cm` | Afecto, caricias, abrazos, confidencias, susurros. Reservada a familiares y seres amados. |
| **Distancia Personal** | `45 cm a 1.20 m` | Conversaciones relajadas entre amigos, compañeros de colegio, recreos o fiestas. |
| **Distancia Social** | `1.20 a 3.60 m` | Interacciones laborales, atención en comercios, trámites bancarios y conocidos ocasionales. |
| **Distancia Pública** | `Más de 3.60 m` | Conferencias, discursos formales, clases magistrales en auditorios y eventos masivos. |

### La Regla de Oro: Empatía y Consentimiento
La burbuja del espacio personal es **dinámica y culturalmente variable**. Invadirla sin permiso suele provocar incomodidad y tensión (como ocurre en un elevador lleno). El respeto y la empatía son esenciales para una convivencia armónica.

---

## 🛡️ Seguridad y Buenas Prácticas

- **Protección de Credenciales**: La variable `GEMINI_API_KEY` se procesa exclusivamente en el backend (`server.js`) a través de variables de entorno. Jamás se expone en el código cliente del navegador (`script.js`).
- **Resiliencia**: Si la API de Gemini no responde por límites de cuota o falta de conexión, la aplicación no se bloquea ni genera errores: conmuta automáticamente al sistema de pistas locales.
- **Rendimiento**: Todos los estilos, gráficos vectoriales SVG, animaciones CSS y sonidos generados por Web Audio API funcionan de manera autónoma sin requerir descargas externas de audio ni librerías pesadas.

---

¡Disfruta aprendiendo y compitiendo en **¡Proxémica en Acción!** 🎉
