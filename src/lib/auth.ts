export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token;
  }
  return null;
};