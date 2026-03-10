import { z } from "zod";
import { insertUserSchema, insertFinancialDataSchema, insertChatMessageSchema, users, financialData, chatMessages } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({
        username: z.string(),
        password: z.string()
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    signup: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: z.object({
        username: z.string(),
        password: z.string()
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  financialData: {
    get: {
      method: 'GET' as const,
      path: '/api/financial-data' as const,
      responses: {
        200: z.custom<typeof financialData.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/financial-data' as const,
      input: insertFinancialDataSchema,
      responses: {
        200: z.custom<typeof financialData.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  chat: {
    list: {
      method: 'GET' as const,
      path: '/api/chat' as const,
      responses: {
        200: z.array(z.custom<typeof chatMessages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    },
    send: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: z.object({
        message: z.string()
      }),
      responses: {
        200: z.custom<typeof chatMessages.$inferSelect>(), // returns the assistant's reply
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LoginInput = z.infer<typeof api.auth.login.input>;
export type SignupInput = z.infer<typeof api.auth.signup.input>;
export type UserResponse = z.infer<typeof api.auth.login.responses[200]>;
export type FinancialDataInput = z.infer<typeof api.financialData.update.input>;
export type FinancialDataResponse = z.infer<typeof api.financialData.get.responses[200]>;
export type ChatListResponse = z.infer<typeof api.chat.list.responses[200]>;
export type ChatSendInput = z.infer<typeof api.chat.send.input>;
export type ChatResponse = z.infer<typeof api.chat.send.responses[200]>;
