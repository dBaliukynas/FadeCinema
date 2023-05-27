import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { StringOption } from '../components/forms/CinemaForm';
import { User, UserResponse } from '../contexts/UserContext';
import { MovieResponse } from './MovieService';

export type MovieReviewInfo = {
    rating: number;
    description: string;
}

export type MovieReviewResponse = MovieReviewInfo & {
    id: string,
    movieId: string,
    user: UserResponse,
    authorId: string,
    createdAt: Date,
    movie: MovieResponse,
};


export const deleteMovieReview = async (movieReviewId: string | undefined, authHeader: string,
    navigate: NavigateFunction, movieId: string, setMovieReviews: any, toggle: () => void) => {
    const response = await fetch(`/api/v1/movie-reviews/${movieReviewId}`, {
        method: "DELETE",
        headers: {
            "Authorization": authHeader,
        }
    });

    if (!response.ok) {
     
        return response.status;
    }

    setMovieReviews((prevState: MovieReviewResponse[]) => {
        const newState = prevState.filter(movieReview => movieReview.id !== movieReviewId);
        return newState;
    });
    toggle();

}