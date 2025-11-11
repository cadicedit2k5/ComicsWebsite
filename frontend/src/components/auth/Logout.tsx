import useAuthStore from "@/stores/useAuthStore";
import { Button } from "../ui/button"
import { useNavigate } from "react-router";


const Logout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button onClick={handleLogout}>Đăng xuất</Button>
    )
}

export default Logout