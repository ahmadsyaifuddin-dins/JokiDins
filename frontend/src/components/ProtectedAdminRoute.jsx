const ProtectedAdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    
    if (!user || user.role !== 'admin') {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  
  