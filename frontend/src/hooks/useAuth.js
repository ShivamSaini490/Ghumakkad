import { useAuthContext } from '../context/AuthContext';

// Custom hook to use auth context
const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
