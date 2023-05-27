import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { NumberOption } from '../components/forms/AuditoriumForm';
import { User } from '../contexts/UserContext';
import { CinemaInfoResponse, CinemaResponse } from './CinemaService';


export type Seat = {
    id: number,
    number?: number,
    isSelected: boolean,
    orientation?: string,
};
export type SeatRequest = {
    position: number,
    number?: number,
    isSelected: boolean,
    orientation?: string,
};


export type AuditoriumInfo = {
    name: string,
    seats: Seat[][],
    rows: NumberOption | null,
    columns: NumberOption | null,
    selectedCinema: {value: string, label: string} | null
};

export type AuditoriumInfoRequest = {
    name: string,
    seats: (SeatRequest | null)[],
    rows: number,
    columns: number,
};

export type AuditoriumInfoResponse = AuditoriumInfoRequest & {
    id: string,
    cinemaId: string,
    cinema: CinemaInfoResponse,
    user: User,
    authorId: string,
    seatCount: number,
    columns: number,
};

export const getAuditorium = async (auditoriumId: string) => {

    const response = await fetch(`/api/v1/auditoriums/${auditoriumId}`);
    const auditorium: AuditoriumInfoResponse = await response.json();

    auditorium.seats = auditorium.seats.map(seat => seat?.isSelected ? null : seat)

    const newSeats: any = []

    for (let i = 0; i < auditorium.seatCount / auditorium.columns; i++) {
        newSeats.push(auditorium.seats.splice(0, auditorium.columns))
    }

    auditorium.seats = newSeats;

    return auditorium;
}

export const deleteAuditorium = async (auditoriumId: string | undefined, authHeader: string, navigate: NavigateFunction, setExistingScreeningError: (value: string) => void) => {
    const response = await fetch(`/api/v1/auditoriums/${auditoriumId}`, {
        method: "DELETE",
        headers: {
            "Authorization": authHeader,
        }
    });

    if (!response.ok) {
        setExistingScreeningError("There is a screening that currently uses this auditorium.");

        return response.status;
    }

    navigate("/cinemas");
}
