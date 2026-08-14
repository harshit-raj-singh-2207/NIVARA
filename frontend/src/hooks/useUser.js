import useUserStore from '../store/userStore';

export const useUser = () => {
  const { profile, updateProfile, updatePreferences } = useUserStore();
  return { profile, updateProfile, updatePreferences };
};

export default useUser;
