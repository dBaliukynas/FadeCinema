import React, { FC, ReactNode } from "react";
import { Route, Navigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useUser } from "../contexts/UserContext";

export type UserRoles = "SuperAdmin" | "Admin";

type ProtectedRouteProps = {
    requiredRoles?: UserRoles[];
    requiredGuest?: boolean;
    component: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ requiredRoles, requiredGuest, component }) => {
    const { user } = useUser();
    if (user === undefined) {
        return <Spinner className="large-spinner d-block ms-auto me-auto">
            Loading...
        </Spinner >
    }      
    if (requiredRoles?.find((requiredRole) => user?.role !== requiredRole)) {
        return <Navigate to="/" />;
    }
    if (!user && !requiredGuest) {
        return <Navigate to="/login" />;
    }
    if (user && requiredGuest) {
        return <Navigate to="/" />;
    }
    return <>{component}</>;
};

export default ProtectedRoute;