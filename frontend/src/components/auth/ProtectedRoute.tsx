import useAuthStore from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {

    const { acessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        if (!acessToken) {
            await refresh();
        }

        if (acessToken && !user) {
            await fetchMe();
        }
        setStarting(false);

    };

    useEffect(() => {
        init();
    }, []);

    if (loading || starting) {
        return <div className='flex h-screen items-center justify-center'>Đang tải...</div>;
    }

    if (!acessToken) {
        return <Navigate
            to="/login"
            replace
        />;
    }

    return (
        <Outlet></Outlet>
    );
}

export default ProtectedRoute