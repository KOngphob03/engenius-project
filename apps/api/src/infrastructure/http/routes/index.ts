import { Elysia, t } from 'elysia';
import { UserController, PaymentController, AuthController } from '../controllers/index.js';

/**
 * Setup routes with dependencies
 */
export function setupRoutes(
  app: Elysia,
  userController: UserController,
  paymentController: PaymentController,
  authController: AuthController,
) {
  // Health check
  app.get('/', () => ({
    message: 'Engenius API - Hexagonal Architecture',
    version: '1.0.0',
    status: 'healthy',
  }));

  // Auth routes
  app.post('/auth/login',
    async ({ body }) => {
      const { email, password } = body;
      return await authController.login(email, password);
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
      }),
      detail: {
        summary: 'Login with email and password',
        description: 'Authenticate user with email and password',
        tags: ['Auth'],
      },
    }
  );

  app.post('/auth/logout',
    async ({ body }) => {
      const { userId } = body as { userId: string };
      return await authController.logout(userId);
    },
    {
      body: t.Object({
        userId: t.String(),
      }),
      detail: {
        summary: 'Logout user',
        description: 'Clear user token and logout',
        tags: ['Auth'],
      },
    }
  );

  app.get('/auth/verify',
    async ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return { error: 'No token provided', status: 401 };
      }
      return await authController.verifyToken(token);
    },
    {
      headers: t.Object({
        authorization: t.Optional(t.String()),
      }),
      detail: {
        summary: 'Verify authentication token',
        description: 'Check if token is valid and return user data',
        tags: ['Auth'],
      },
    }
  );

  // User routes
  app.get('/users/:id', async ({ params }) => {
    return await userController.getUser(params.id);
  });

  app.get('/users/email/:email', async ({ params }) => {
    return await userController.getUserByEmail(params.email);
  });

  app.get('/users', async ({ query }) => {
    const limit = query.limit ? parseInt(query.limit as string) : 100;
    const offset = query.offset ? parseInt(query.offset as string) : 0;
    return await userController.getAllUsers(limit, offset);
  });

  app.post('/users', async ({ body }) => {
    return await userController.createUser(body);
  });

  app.put('/users/:id', async ({ params, body }) => {
    return await userController.updateUser(params.id, body);
  });

  app.delete('/users/:id', async ({ params }) => {
    return await userController.deleteUser(params.id);
  });

  app.get('/users/:id/membership', async ({ params }) => {
    return await userController.checkMembership(params.id);
  });

  // Payment routes
  app.get('/payments/:id', async ({ params }) => {
    return await paymentController.getPayment(parseInt(params.id));
  });

  app.get('/payments/activate/:code', async ({ params }) => {
    return await paymentController.getPaymentByActivateCode(params.code);
  });

  app.get('/payments/user/:userId', async ({ params }) => {
    return await paymentController.getUserPayments(params.userId);
  });

  app.get('/payments/pending', async () => {
    return await paymentController.getPendingPayments();
  });

  app.post('/payments', async ({ body }) => {
    return await paymentController.createPayment(body);
  });

  app.put('/payments/:id/status', async ({ params, body }) => {
    const { status } = body as { status: boolean };
    return await paymentController.updatePaymentStatus(
      parseInt(params.id),
      status,
    );
  });

  app.post('/payments/activate', async ({ body }) => {
    const { code } = body as { code: string };
    return await paymentController.activatePayment(code);
  });

  return app;
}
