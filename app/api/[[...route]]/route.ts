import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import Category from "./core/category";
import { clerkMiddleware } from "@hono/clerk-auth";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.use(
  "*",
  clerkMiddleware({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
  logger(),
);

const routes = app.route("/categories", Category);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;