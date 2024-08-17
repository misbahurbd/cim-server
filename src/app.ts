import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { sendResponse } from './utils';
import router from './routes';
import notFoundErrorHandler from './middlewares/notFoundHandler';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';

// Initialize Express App
const app: Application = express();

// Initialize Parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://cim-client-a6.vercel.app',
      'https://cim-client.vercel.app',
    ],
    credentials: true,
  }),
);

// Initialize default router
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Welcome to Computer Item Management System',
    data: null,
  });
});

// Initialize application router
app.use('/api', router);

// Initialize not found error handler
app.use('*', notFoundErrorHandler);

// Initialize global error handler
app.use(globalErrorHandler);

// Export default App
export default app;
