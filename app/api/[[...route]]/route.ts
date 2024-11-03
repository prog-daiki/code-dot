import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import { clerkMiddleware } from "@hono/clerk-auth";

import Course from "./core/course";
import Chapter from "./core/chapter";
import CategoryController from "./core/category";

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

const routes = app
  .route("/categories", CategoryController)
  .route("/courses", Course)
  .route("/courses/:course_id/chapters", Chapter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
