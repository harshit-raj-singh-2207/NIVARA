import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, register, logout, switchRole } = useAuthStore();
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    switchRole,
    isCaregiver: user?.role === 'CAREGIVER',
  };
};

export default useAuth;
