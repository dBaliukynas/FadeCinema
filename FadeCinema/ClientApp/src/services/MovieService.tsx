import { NavigateFunction } from 'react-router-dom';
import { StringOption } from '../components/forms/CinemaForm';
import { User } from '../contexts/UserContext';

export type MovieInfo = {
    name: string;
    description: string;
    country: StringOption | null,
    director: string | null,
    duration: number | null | string,
}

export type MovieResponse = MovieInfo & {
    id: string,
    country: string,
    user: User,
    authorId: string,
}


export const getMovie = async (movieId: string) => {

    const response = await fetch(`/api/v1/movies/${movieId}`);
    const movie: MovieResponse = await response.json();

    return movie;
}

export const deleteMovie = async (movieId: string | undefined, authHeader: string, navigate: NavigateFunction, setExistingScreeningError: (value: string) => void) => {
    const response = await fetch(`/api/v1/movies/${movieId}`, {
        method: "DELETE",
        headers: {
            "Authorization": authHeader,
        }
    });

    if (!response.ok) {
        setExistingScreeningError("There is a screening that currently uses this movie.");

        return response.status;
    }

    const deleteBlobs = async (entityId: string) => {
        await fetch(`/api/v1/blobs/${entityId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": authHeader,
                "Path": "/images/movies",
            }
        })
    }
    deleteBlobs(movieId as string);

    navigate("/movies");

}