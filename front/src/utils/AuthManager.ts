export const createSession = (email: string, id: string, role: string, user: string) => {
  sessionStorage.setItem('session', JSON.stringify({ email, id, role, user }));
};

export const getSessionData = () => {
  const session = sessionStorage.getItem('sessionInfo');
  return session ? JSON.parse(session) : null;
};

export const removeSession = () => {
  sessionStorage.removeItem('sessionInfo');
};

export const clearCache = () => {
  sessionStorage.clear();
};
