import type { User } from "./user";

export interface AuthState {
    acessToken: string | null;
    user: User | null;
    loading: boolean;

    clearState: () => void;

    setAcessToken: (accessToken: string) => void;

    signUp: (username: string, password: string, firstName: string, lastName: string, email: string)
        => Promise<void>;

    login: (username: string, password: string) => Promise<void>;

    logout: () => Promise<void>;

    fetchMe: () => Promise<void>;

    refresh: () => Promise<void>;
}