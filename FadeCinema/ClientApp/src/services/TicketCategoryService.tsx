import { NavigateFunction } from 'react-router-dom';
import { User } from '../contexts/UserContext';

export type TicketCategoryInfo = {
    name: string;
    price: number | null | string,
}

export type TicketCategoryResponse = TicketCategoryInfo & {
    id: string,
    user: User,
    authorId: string,
}

export const getTicketCategory = async (ticketCategoryId: string) => {

    const response = await fetch(`/api/v1/ticket-categories/${ticketCategoryId}`);
    const ticketCategory: TicketCategoryResponse = await response.json();

    return ticketCategory;
}

export const deleteTicketCategory = async (ticketCategoryId: string | undefined, authHeader: string, navigate: NavigateFunction, setExistingScreeningError: (value: string) => void) => {
    const response = await fetch(`/api/v1/ticket-categories/${ticketCategoryId}`, {
        method: "DELETE",
        headers: {
            "Authorization": authHeader,
        }
    });

    if (!response.ok) {
        setExistingScreeningError("There is a screening that currently uses this ticket category.");

        return response.status;
    }

    navigate("/ticket-categories");
}