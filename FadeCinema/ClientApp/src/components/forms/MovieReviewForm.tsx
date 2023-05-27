import { Editor } from '@tinymce/tinymce-react';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { Button, FormGroup } from 'reactstrap';
import { useUser } from '../../contexts/UserContext';
import { MovieReviewInfo, MovieReviewResponse } from '../../services/MovieReviewService';
import { PurchasedTicketResponse } from '../pages/Profile';

export type ComponentProps = {
    purchasedTickets: PurchasedTicketResponse[],
    movieId: string,
    movieToBeEdited: string
    setMovieToBeEdited: (value: string) => void,
    movieReview?: MovieReviewResponse
    setMovieReviews?: any,
}

const MovieReviewForm = ({ purchasedTickets, movieId, movieToBeEdited, setMovieToBeEdited, movieReview, setMovieReviews }: ComponentProps) => {
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0)
    const [description, setDescription] = useState("");
    const [key, setKey] = useState(Math.random());
    const unfinishedScreenings = purchasedTickets?.filter(purchasedTicket => DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }) > DateTime.now());

    const createMovieReview = async () => {

        const response = await fetch(`/api/v1/movie-review/${movieId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({ rating, description } as MovieReviewInfo)

        })
        const movieReviewResponse: MovieReviewResponse = await response.json()

        setDescription("");
        setRating(0);
        setMovieReviews((prevState: MovieReviewResponse[]) => {
            const newState = [...prevState];
            newState.unshift({
                id: movieReviewResponse.id,
                movieId: movieReviewResponse.movieId,
                user: movieReviewResponse.user,
                authorId: movieReviewResponse.authorId,
                createdAt: movieReviewResponse.createdAt,
                description: movieReviewResponse.description,
                rating: movieReviewResponse.rating,
                movie: movieReviewResponse.movie,
            });
            return newState;
        });
    }

    const updateMovieReview = async () => {

        const response = await fetch(`/api/v1/movie-reviews/${movieReview?.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({ rating, description } as MovieReviewInfo)

        })
        const movieReviewResponse: MovieReviewResponse = await response.json()

        setMovieReviews((prevState: MovieReviewResponse[]) => {
            const newState = prevState.map(movieReview => {
                if (movieReview.id == movieToBeEdited) {
                    return { ...movieReview, rating, description };
                } else {
                    return movieReview;
                }
            });
            return newState;
        });

        setDescription("");
        setRating(0);
        setMovieToBeEdited("");
    }

    useEffect(() => {
        if (movieReview != undefined) {
            setRating(movieReview.rating);
            setDescription(movieReview.description);
        }
    }, [movieReview])


    return (
        <React.Fragment>
            <div className="position-relative">
                <FormGroup className={`${purchasedTickets.length == 0 || !purchasedTickets?.some(purchasedTicket => DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }) <= DateTime.now()) ? 'editor-wrapper-ticket-not-purchased' : ''}`}>
                    <Editor
                        apiKey={process.env.REACT_APP_TINYMCE_ACCESS_TOKEN}

                        init={{
                            min_height: 500,
                            autoresize_bottom_margin: 0,
                            menubar: false,
                            plugins: [
                                'advlist', 'autoresize', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | styles | fontsize ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | table | fullscreen | searchreplace | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={(value) => setDescription(value)}
                        value={description}

                    />
                </FormGroup>
                {purchasedTickets.length == 0 && <span className="fst-italic editor-ticket-not-purchased-text">Purchase a ticket to leave a review.</span>}
                {purchasedTickets.length != 0 && !purchasedTickets?.some(purchasedTicket => DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }) <= DateTime.now()) &&
                    <div>
                        <span className="fst-italic editor-ticket-not-purchased-text">You will be able to leave a review when your purchased ticket's screening finishes.
                            <span className="editor-ticket-review-time-text">
                                <strong>{DateTime.fromISO(unfinishedScreenings[0].screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm:ss")}</strong>
                            </span>
                        </span>
                    </div>
                }

            </div>
            <Rating className={`mb-20 ${purchasedTickets.length == 0 || !purchasedTickets?.some(purchasedTicket => DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }) <= DateTime.now()) ? 'ticket-not-purchased' : ''}`}
                onClick={(value) => {
                    if (value == rating) {
                        setRating(0);
                        setKey(Math.random())
                    } else {
                        setRating(value)
                    }
                }}
                initialValue={rating}
                transition
                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                key={key}
            />
            <Button
                className={`mb-30 ${purchasedTickets.length == 0 || !purchasedTickets?.some(purchasedTicket => DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }) <= DateTime.now()) ? 'ticket-not-purchased' : ''}`}
                color="primary"
                disabled={purchasedTickets.length == 0 || rating == 0}
                onClick={movieToBeEdited != "" ? updateMovieReview : createMovieReview}>
                {movieToBeEdited != "" ? 'Save changes' : 'Leave a review'}
            </Button>
        </React.Fragment>
    );
}

export default MovieReviewForm;