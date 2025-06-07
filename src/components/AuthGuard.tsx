import React, { useEffect, useState } from 'react';
import { getCurrentAuthState } from '../utils/auth';
import { Router } from '../utils/router';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = 'login' 
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = Router.getInstance();

  useEffect(() => {
    const authState = getCurrentAuthState();
    const authenticated = authState.isAuthenticated && authState.user;
    
    setIsAuthenticated(authenticated);
    setIsChecking(false);

    if (requireAuth && !authenticated) {
      // Store the current route to redirect back after login
      const currentRoute = router.getCurrentRoute();
      if (currentRoute !== 'home' && currentRoute !== 'login' && currentRoute !== 'register') {
        const params = new URLSearchParams();
        params.set('returnTo', currentRoute);
        window.location.hash = `${redirectTo}?${params.toString()}`;
      } else {
        router.navigate(redirectTo as any);
      }
    }
  }, [requireAuth, redirectTo, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Vérification...
          </h2>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};

export default AuthGuard;