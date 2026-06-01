export const authService = {
  async getSession(token: string) {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  },
};