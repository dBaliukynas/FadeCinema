import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { StringOption } from '../components/forms/CinemaForm';
import { User } from '../contexts/UserContext';

export type CinemaInfo = {
    name: string;
    description: string;
    location: {
        address: string | null,
        country: StringOption | null,
        state: string | null,
        city: StringOption | null,
        district: string | null,
        zipCode: string | null,
        longitude: number | null | string,
        latitude: number | null | string,
    }
}
export type CinemaInfoRequest = {
    name: string;
    description: string;
    location: {
        address: string | null,
        country: string,
        state: string | null,
        city: string,
        district: string | null,
        zipCode: string | null,
        longitude: number | null | string,
        latitude: number | null | string,
    }
}
export type CinemaInfoResponse = CinemaInfoRequest & {
    id: string,
    user: User,
    authorId: string,
};
export type CinemaResponse = CinemaInfo & {
    id: string,
    user: User,
    authorId: string,
}

export const deleteCinema = async (cinemaId: string | undefined, authHeader: string, navigate: NavigateFunction, setExistingScreeningError: (value: string) => void) => {
    const response = await fetch(`/api/v1/cinemas/${cinemaId}`, {
        method: "DELETE",
        headers: {
            "Authorization": authHeader,
        }
    });

    if (!response.ok) {
        setExistingScreeningError("There is a screening that currently uses this cinema.");

        return response.status;
    }

    navigate("/cinemas");
}