import { Elysia, t } from 'elysia';
import { openapi } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors';
import { setupRoutes } from './infrastructure/http/routes/index.js';
import { UserRepository } from './infrastructure/database/repositories/UserRepository.impl.js';
import { UserUseCase, PaymentUseCase, AuthUseCase } from './core/use-cases/index.js';
import { PaymentRepository } from './infrastructure/database/repositories/PaymentRepository.impl.js';
import { UserController, PaymentController, AuthController } from './infrastructure/http/controllers/index.js';

// Initialize repositories
const userRepository = new UserRepository();
const paymentRepository = new PaymentRepository();

// Initialize use cases
const userUseCase = new UserUseCase(userRepository);
const paymentUseCase = new PaymentUseCase(paymentRepository);
const authUseCase = new AuthUseCase(userRepository);

// Initialize controllers
const userController = new UserController(userUseCase);
const paymentController = new PaymentController(paymentUseCase);
const authController = new AuthController(authUseCase);

// Initialize Elysia app
const app = new Elysia()
  .use(openapi())
  .use(cors())

// Setup routes
setupRoutes(app, userController, paymentController, authController);


// Start the server
const port = process.env.PORT || 3001;
app.listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
