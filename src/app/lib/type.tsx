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

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}