import { create } from "zustand"
import { toast } from "sonner"
import authService from "@/services/authService";
import type { AuthState } from "@/types/store";

const useAuthStore = create<AuthState>((set, get) => ({
    acessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({
            acessToken: null,
            user: null,
            loading: false,
        });
    },

    setAcessToken: (accessToken: string) => {
        set({ acessToken: accessToken });
    },

    signUp: async (username: string, password: string, firstName: string, lastName: string, email: string) => {
        try {
            set({ loading: true });
            //Goi api o backend de dang ky
            await authService.signUp(username, password, firstName, lastName, email);

            toast.success("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
        }
        catch (error) {
            console.error(error);
            toast.error("Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            set({ loading: false });
        }
    },

    login: async (username: string, password: string) => {
        try {
            set({ loading: true });

            //Goi api o backend de dang nhap
            const { accessToken } = await authService.login(username, password);
            set({ acessToken: accessToken });

            await get().fetchMe();

            toast.success("Đăng nhập thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            get().clearState();
            await authService.logout();
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi đăng xuất! Vui lòng thử lại.");
        }
    },
    fetchMe: async () => {
        try {
            set({ loading: true });

            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error(error);
            set({ user: null, acessToken: null });
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Vui lòng đăng nhập lại.");
        } finally {
            set({ loading: false });
        }
    },
    refresh: async () => {
        try {
            set({ loading: true });

            const { user, fetchMe, setAcessToken } = get();
            const accessToken = await authService.refresh();

            setAcessToken(accessToken);

            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error(error);
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            get().clearState();
        } finally {
            set({ loading: false });
        }
    }
}));

export default useAuthStore;