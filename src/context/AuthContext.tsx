import { createContext, ReactNode, useContext, useState } from "react";
import { userLogin } from "@/api/users";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { HttpStatus } from "@/constants/Http_status";
import { ToastContainer } from "react-toastify";
import { LoginInterface } from "@/interfaces/User";
import { ROLE_HOME_PATH } from "@/constants/Role";
import { isTokenValide } from "@/utils/Token";

const TOKEN_STORAGE_KEY = "token";

const lireTokenStocke = (): string | null => {
    const tokenStocke = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!tokenStocke) {
        return null;
    }
    if (!isTokenValide(tokenStocke)) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        return null;
    }
    return tokenStocke;
};

type AuthContextProps = {
    token?: string | null;
    isAuthenticated?: boolean;
    login: (data: LoginInterface) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(lireTokenStocke);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const isAuthenticated = !!token;

    const login = async (loginCredentials: LoginInterface) => {
        const response = await userLogin(loginCredentials);
        if(response?.status === HttpStatus.OK || response?.status === HttpStatus.CREATED) {
            const data = response?.data.token;

            setToken(data);
            localStorage.setItem(TOKEN_STORAGE_KEY, data);
            queryClient.clear();

            const decodedToken = JSON.parse(atob(data.split('.')[1]));
            const role: string = decodedToken.role;
            const homePath = ROLE_HOME_PATH[role];

            navigate(homePath ?? "/unauthorized");
        }
    } 

    async function logout() {
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        queryClient.clear();
        navigate("/");
    }

    return (
        <AuthContext.Provider 
            value={{
                token,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
            <ToastContainer />
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth must be inside of a AuthProvider");
    }
    return context;
}