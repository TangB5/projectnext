export type LoginState = {
  success?: boolean;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

// app/types.ts
export type SessionPayload = {
  userId: string;
  role: string;
  email: string;
};