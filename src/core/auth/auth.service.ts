import { MOCK_CREDENTIALS } from "./auth.constants";

export type LoginDTO = { email: string; password: string };

export type LoginResult = {
  accessToken: string;
  user: { id: string; email: string; name: string; role: "ADMIN" | "CLINIC" | "OWNER" };
};

export async function login(dto: LoginDTO): Promise<LoginResult> {
  const ok =
    dto.email === MOCK_CREDENTIALS.email && dto.password === MOCK_CREDENTIALS.password;

  if (!ok) throw new Error("INVALID_CREDENTIALS");

  // Por ahora: este usuario mock es ADMIN.
  return {
    accessToken: "fake_token_123",
    user: { id: "1", email: dto.email, name: "Test Admin", role: "ADMIN" },
  };
}
