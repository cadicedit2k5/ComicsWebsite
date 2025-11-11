import Logout from '@/components/auth/Logout'
import useAuthStore from '@/stores/useAuthStore';

const ComicsPage = () => {

    const user = useAuthStore((state) => state.user);

    return (
        <div>
            <h1>{user?.username}</h1>
            <Logout />
        </div>
    )
}

export default ComicsPage