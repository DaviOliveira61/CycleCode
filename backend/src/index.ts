import 'dotenv/config'; // Carrega e configura o dotenv no topo de tudo
import app from './app.js'; // Importe sem a extensão .ts

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Opcional, mas é uma boa prática para capturar erros de inicialização
server.on('error', (error) => {
  console.error('❌ Error on initialize:', error);
  process.exit(1); // Encerra o processo se o servidor não conseguir iniciar
});

