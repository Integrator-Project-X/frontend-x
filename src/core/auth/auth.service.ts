import { MOCK_CREDENTIALS } from "./auth.constants";

export type LoginDTO = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
  };
};

export async function login(dto: LoginDTO): Promise<LoginResult> {
  const { email, password } = dto;

  // MOCK (sin BD)
  const ok =
    email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password;

  if (!ok) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    accessToken: "fake_token_123",
    user: { id: "1", email, name: "Test User", role: "ADMIN" },
  };
}
