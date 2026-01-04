import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
    role: 'admin' | 'fisherman';
    redirectPath?: string;
    children?: ReactNode;
}

export default function AuthGuard({ role, redirectPath = '/login/admin', children }: AuthGuardProps) {
    if (role === 'admin') {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
        if (!isAuthenticated) {
            return <Navigate to={redirectPath} replace />;
        }
    } else if (role === 'fisherman') {
        const isAuthenticated = localStorage.getItem('isFishermanAuthenticated') === 'true';
        if (!isAuthenticated) {
            return <Navigate to={redirectPath || '/login/fisherman'} replace />;
        }
    }

    // Expand for fisherman logic later if needed

    return children ? <>{children}</> : <Outlet />;
}
