import express from 'express';
import cors from 'cors';
import routes from './src/routes/router';
import config from './src/config/environment';
import initializeFirebase from './src/config/firebase';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const startServer = async (): Promise<void> => {
  try {
    initializeFirebase();
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port} [${config.server.nodeEnv}]`);
      console.log(`   Health: http://localhost:${config.server.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();