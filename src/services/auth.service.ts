export const authService = {
  async getSession(token: string) {
    const res = await fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  },
};