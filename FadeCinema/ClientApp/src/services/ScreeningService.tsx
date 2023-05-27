import { NavigateFunction } from 'react-router-dom';
import { StringOption } from '../components/forms/CinemaForm';
import { User } from '../contexts/UserContext';
import { AuditoriumInfoResponse } from './AuditoriumService';
import { MovieResponse } from './MovieService';
import { TicketCategoryResponse } from './TicketCategoryService';

export type ScreeningSeat = {
    id: string,
    number?: number,
    position: number,
    isSelected: boolean,
    isReserved: boolean
    orientation?: string,
};
export type ScreeningSeatResponse = ScreeningSeat &  {
    screening: ScreeningResponse,
    ticketCategory: TicketCategoryResponse
};
export type ScreeningInfo = {
    cinema: StringOption | null;
    auditorium: StringOption | null;
    movie: StringOption | null,
    ticketCategory: StringOption | null,
    startTime: Date,
    endTime: Date,
    days: number | null | string,
}

export type ScreeningResponse = ScreeningInfo & {
    id: string,
    user: User,
    authorId: string,
    auditorium: AuditoriumInfoResponse,
    ticketCategory: TicketCategoryResponse
    movie: MovieResponse
    seats: (ScreeningSeat | null)[],
    errorMessages: [],
}


export const getScreening = async (screeningId: string) => {

    const response = await fetch(`/api/v1/screenings/${screeningId}`);
    const screening: ScreeningResponse = await response.json();

    screening.seats = screening.seats.map(seat => seat?.isSelected ? null : seat)

    const newSeats: any = []

    for (let i = 0; i < screening.auditorium.seatCount / screening.auditorium.columns; i++) {
        newSeats.push(screening.seats.splice(0, screening.auditorium.columns))
    }

    screening.seats = newSeats;

    return screening;
}

export const deleteScreening = async (screeningId: string | undefined, authHeader: string, navigate: NavigateFunction) => {
    const response = await fetch(`/api/v1/screenings/${screeningId}`, {
        method: "DELETE",
        headers: {
            "Authorization": authHeader,
        }
    });

    if (response.ok) {
        navigate("/");
    }
}