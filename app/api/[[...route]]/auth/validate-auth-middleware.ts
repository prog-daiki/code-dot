import { Context, Next } from "hono";
import { getAuth } from "@hono/clerk-auth";

import { Messages } from "../common/message";

/**
 * 認証済みのユーザーのみアクセス可能なミドルウェア関数
 * @param {Context} c - Honoのコンテキストオブジェクト
 * @param {Next} next - 次のミドルウェア関数
 * @returns {Promise<Response | void>} 認証エラー時はJSONレスポンス、成功時は次のミドルウェアを実行
 */
export const validateAuthMiddleware = async (
  c: Context,
  next: Next,
): Promise<Response | void> => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: Messages.MSG_ERR_001 }, 401);
  }

  c.set("userId", auth.userId);
  return next();
};
