import React, { createContext, useState, useEffect, FC, useContext, ReactNode } from "react";
import jwt from 'jwt-decode'
import { Outlet, useNavigate } from "react-router-dom";

const storageKey = "jwt_token";

export type UserResponse = {
    id: string,
    username: string,
    email: string,
};

export type User = {
    id: string,
    name: string,
    email: string,
    role: string | string[],
    sub: string,
};

type Token = {
    exp: number;
}

type Props = {
    children?: ReactNode
}

const UserContext = createContext({
    authenticate: () => "" as any,
    setAuth: (token: string | null) => { },
    user: undefined as User | undefined | null,
});

export const useUser = () => useContext(UserContext);

const UserContextProvider: FC<Props> = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | undefined | null>(undefined);
    const [token, setToken] = useState<string | null>(localStorage.getItem(storageKey));

    const setAuth = (token: string | null) => {

        if (token == null) {
            localStorage.removeItem(storageKey);
            setToken(null);
            setUser(null);
        } else {
            localStorage.setItem(storageKey, `${token}`);
            setToken(token);
            setUser(jwt<User>(token));
        }
    }

    const authenticate = () => {
        if (token == null) {
            return navigate("/login");
        }
        const decodedToken = jwt<Token>(token as string);
        var currentDate = new Date();
        if (decodedToken.exp < currentDate.getTime() / 1000) {
            setAuth(null);

            return navigate("/login", {
                state: {
                    isSessionExpired: true
                }
            });
        }

        return `Bearer ${token}`
    };

    useEffect(() => {
        if (token) {
            setUser(jwt<User>(token));
        } else {
            setUser(null);
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ authenticate, setAuth, user }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;