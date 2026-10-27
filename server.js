
// ¡PROXÉMICA EN ACCIÓN!

try {
  require('dotenv').config();
} catch (e) {
  // dotenv no instalado aún, se usa el entorno actual
}

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Obtener la IP local de la red Wi-Fi / Ethernet
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Pistas educativas de respaldo (fallback) por si no hay conexión o no hay API key
const DEFAULT_HINTS = {
  matching: {
    "Proxémica": "Piensa en la ciencia que estudia la 'burbuja' invisible que rodea a cada persona y cómo nos distribuimos en el espacio.",
    "Distancia íntima": "Es la distancia del afecto profundo, abrazos y confidencias. ¡Menos de medio metro (0 a 45 cm)!",
    "Distancia personal": "Es la distancia entre amigos cercanos o compañeros de clase en el recreo (45 cm a 1.2 metros), al alcance de un brazo.",
    "Distancia social": "Usada en el trabajo, con desconocidos o al comprar en una tienda (1.2 a 3.6 metros). No hay contacto físico.",
    "Distancia pública": "Ideal para oradores, conferencias o docentes ante un gran salón. ¡Más de 3.6 metros!",
    "Respeto del espacio personal": "Tiene que ver con la empatía: no invadir la burbuja de los demás sin su permiso para que todos se sientan cómodos."
  },
  general: [
    "Recuerda que Edward T. Hall clasificó las distancias en cuatro zonas: íntima, personal, social y pública.",
    "El contexto cultural influye mucho: algunas culturas son de más cercanía física y otras prefieren más distancia.",
    "Si sientes que alguien invade tu espacio en un elevador o una fila, tu reacción es natural: ¡es tu instinto proxémico!",
    "La distancia personal promedio equivale aproximadamente a la longitud de tu brazo extendido."
  ]
};

// Función para solicitar pista a la API oficial de Google Gemini
async function getGeminiHint(payload) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'tu_clave_de_gemini_aqui') {
    return null;
  }

  const { round, concept, definition, question, teamName } = payload;
  
  const systemInstruction = `Eres Proxi, la alegre y simpática mascota robot-exploradora de un juego educativo sobre comunicación proxémica para estudiantes.
Tu personalidad es entusiasta, curiosa, amable y muy pedagógica.
Tu objetivo es dar una pista breve, educativa e inspiradora (máximo 2 oraciones, menos de 35 palabras) para ayudar al ${teamName || 'equipo'} a resolver el reto actual.
REGLA DE ORO: ¡NUNCA des la respuesta textual o explícita! Ayúdalos a razonar relacionando la distancia física (centímetros o metros), la relación entre las personas o el contexto social.
Responde siempre en español. No uses markdown de títulos ni listas, solo texto continuo y un emoji amigable.`;

  let userPrompt = '';
  if (round === 1) {
    userPrompt = `El equipo debe emparejar el concepto proxémico: "${concept}". Su definición está relacionada con: "${definition || 'las distancias humanas'}". Dame una pista divertida para que reconozcan su significado sin decir la respuesta.`;
  } else {
    userPrompt = `El equipo está respondiendo la siguiente frase/pregunta: "${question}". Dame una pista para guiar su deducción sin decirles la opción correcta.`;
  }

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nPregunta: ${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 120
          }
        })
      });

      if (!response.ok) {
        console.warn(`[Gemini API] Modelo ${model} respondió con status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText && generatedText.trim()) {
        return generatedText.trim();
      }
    } catch (err) {
      console.warn(`[Gemini API Error] Fallo al consultar ${model}:`, err.message);
    }
  }

  return null;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer(async (req, res) => {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Endpoint de estado del servidor y configuración de IA
  if (req.method === 'GET' && pathname === '/api/status') {
    const hasKey = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'tu_clave_de_gemini_aqui');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      geminiConfigured: hasKey,
      message: hasKey
        ? 'Google Gemini API activa y lista para generar pistas dinámicas.'
        : 'Google Gemini no configurado. El juego utilizará pistas pedagógicas precargadas.'
    }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/hint') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.socket.destroy(); 
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const geminiHint = await getGeminiHint(payload);

        if (geminiHint) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            hint: geminiHint,
            source: 'gemini',
            petMood: 'happy'
          }));
          return;
        }

        // Fallback 
        let fallbackHint = '';
        if (payload.concept && DEFAULT_HINTS.matching[payload.concept]) {
          fallbackHint = DEFAULT_HINTS.matching[payload.concept];
        } else {
          const randomIndex = Math.floor(Math.random() * DEFAULT_HINTS.general.length);
          fallbackHint = DEFAULT_HINTS.general[randomIndex];
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          hint: fallbackHint,
          source: 'default',
          petMood: 'curious'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acceso denegado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
    
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error interno al leer archivo');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const isKeyActive = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'tu_clave_de_gemini_aqui');
  const localIp = getLocalIpAddress();

  console.log('========================================================');
  console.log('  🌟 ¡PROXÉMICA EN ACCIÓN! - Servidor Educativo');
  console.log('========================================================');
  console.log(`  💻 En este computador : http://localhost:${PORT}`);
  console.log(`  📱 Desde celular/tablet: http://${localIp}:${PORT}`);
  console.log('--------------------------------------------------------');
  if (isKeyActive) {
    console.log('  ✨ Google Gemini API: [CONECTADO Y ACTIVO]');
  } else {
    console.log('  ℹ️  Google Gemini API: [MODO PISTAS OFFLINE / FALLBACK]');
    console.log('     Para activar IA en tiempo real, añade GEMINI_API_KEY en tu archivo .env');
  }
  console.log('========================================================\n');
});
