import { createContext, useContext } from 'react';

// Create the context and export the hook from a separate file
const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
