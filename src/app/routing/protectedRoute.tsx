import { Navigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ element }: any) => {
    const { user } = useAuthStore();

    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
