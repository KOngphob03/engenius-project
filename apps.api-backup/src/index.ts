import { Elysia, t } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { db } from './db';
import { users, payment_stripe } from './db/schema';
import { eq, isNull } from 'drizzle-orm';

const app = new Elysia()
  .use(openapi())

  // ── Health check ──────────────────────────────────
  .get('/', () => ({ status: 'ok', message: 'Hello Elysia 🦊' }))

  // ── Users ─────────────────────────────────────────
  .get('/users', async () => {
    return await db.select().from(users).where(isNull(users.deleted_at));
  })

  .get('/users/:id', async ({ params: { id } }) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (!result[0]) return new Response('User not found', { status: 404 });
    return result[0];
  })

  .post('/users', async ({ body }) => {
    const result = await db.insert(users).values(body).returning();
    return result[0];
  }, {
    body: t.Object({
      firstname: t.String(),
      lastname: t.String(),
      email: t.String(),
      phone: t.String(),
      university: t.String(),
      department: t.String(),
    })
  })

  .patch('/users/:id', async ({ params: { id }, body }) => {
    const result = await db.update(users)
      .set({ ...body, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!result[0]) return new Response('User not found', { status: 404 });
    return result[0];
  }, {
    body: t.Partial(t.Object({
      firstname: t.String(),
      lastname: t.String(),
      email: t.String(),
      phone: t.String(),
      university: t.String(),
      department: t.String(),
      activated: t.Boolean(),
      profile: t.String(),
    }))
  })

  .delete('/users/:id', async ({ params: { id } }) => {
    const result = await db.update(users)
      .set({ deleted_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!result[0]) return new Response('User not found', { status: 404 });
    return { message: 'Deleted successfully' };
  })

  // ── Payment Stripe ─────────────────────────────────
  .get('/payments', async () => {
    return await db.select().from(payment_stripe).where(isNull(payment_stripe.deleted_at));
  })

  .get('/payments/:id', async ({ params: { id } }) => {
    const result = await db.select().from(payment_stripe).where(eq(payment_stripe.id, Number(id)));
    if (!result[0]) return new Response('Payment not found', { status: 404 });
    return result[0];
  })

  .post('/payments', async ({ body }) => {
    const result = await db.insert(payment_stripe).values(body).returning();
    return result[0];
  }, {
    body: t.Object({
      user_id: t.String(),
      username: t.String(),
      price: t.String(),
      day: t.Number(),
      status: t.Boolean(),
      activate: t.Boolean(),
      activate_code: t.String(),
    })
  })

  .patch('/payments/:id', async ({ params: { id }, body }) => {
    const result = await db.update(payment_stripe)
      .set({ ...body, updated_at: new Date() })
      .where(eq(payment_stripe.id, Number(id)))
      .returning();
    if (!result[0]) return new Response('Payment not found', { status: 404 });
    return result[0];
  }, {
    body: t.Partial(t.Object({
      user_id: t.String(),
      username: t.String(),
      price: t.String(),
      day: t.Number(),
      status: t.Boolean(),
      activate: t.Boolean(),
      activate_code: t.String(),
    }))
  })

  .delete('/payments/:id', async ({ params: { id } }) => {
    const result = await db.update(payment_stripe)
      .set({ deleted_at: new Date() })
      .where(eq(payment_stripe.id, Number(id)))
      .returning();
    if (!result[0]) return new Response('Payment not found', { status: 404 });
    return { message: 'Deleted successfully' };
  })

  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
