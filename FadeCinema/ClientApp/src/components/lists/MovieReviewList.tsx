import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller';
import { NavigateFunction } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { Card, Col, Row, Spinner } from 'reactstrap';
import { User } from '../../contexts/UserContext';
import { deleteMovieReview, MovieReviewResponse } from '../../services/MovieReviewService';
import { deleteMovie } from '../../services/MovieService';
import AppModal from '../AppModal';
import MovieReviewForm from '../forms/MovieReviewForm';
import { PurchasedTicketResponse } from '../pages/Profile';
import DeleteIcon from '../svgs/DeleteIcon';
import EditIcon from '../svgs/EditIcon';

type ComponentProps = {
    movieReviews: MovieReviewResponse[],

    purchasedTickets: PurchasedTicketResponse[]
    user: User | null | undefined,
    movieId: string | undefined,
    getMovieReviews: (page: number) => Promise<void>,
    movieToBeEdited: string,
    setMovieToBeEdited: (value: string) => void,
    authHeader: string,
    navigate: NavigateFunction,
    hasMoreMovieReviews: boolean
    setMovieReviews?: any
}

const MovieReviewList = ({
    movieReviews, purchasedTickets, user, movieId, getMovieReviews, movieToBeEdited,
    setMovieToBeEdited, hasMoreMovieReviews, authHeader, navigate, setMovieReviews }: ComponentProps) => {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [movieToBeDeleted, setMovieToBeDeleted] = useState<string>("");

    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={getMovieReviews}
            hasMore={hasMoreMovieReviews}
            loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
        >
            {movieReviews.length != 0 && movieReviews.map((movieReview, index) =>
                !(movieToBeEdited == movieReview.id) ? (<Card key={index} className={`border-colored-top ${user?.sub == movieReview.user.id ? 'colored-top-border-secondary' : 'colored-top-border-primary'} shadowed-component mb-20 no-text-decoration`}>
                    <Row>
                        <div className="review-card-top">
                            <span className="ml-10"><strong className="uppercase">User</strong>: {movieReview.user.username} </span>
                            <Rating
                                className="mr-10"
                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                initialValue={movieReview.rating}
                                readonly
                                size={30}
                            />
                        </div>
                        <div className="review-card-top">
                            <span className=" ml-10 mb-10"><strong className="uppercase">Published</strong>: {DateTime.fromISO(movieReview.createdAt.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")} </span>
                            {(movieReview.user.id == user?.sub || user?.role == "SuperAdmin") && (<div className="d-flex mr-10">
                                <AppModal
                                    component={
                                        <DeleteIcon size={30} className="svg-icon-interactable" onClick={() => { toggle(); setMovieToBeDeleted(movieReview.id) }} />
                                    }
                                    modal={modal}
                                    toggle={toggle}
                                    handleOnClick={() => deleteMovieReview(movieToBeDeleted, authHeader, navigate, movieId as string, setMovieReviews, toggle)}
                                    modalTitle="Are you sure you want to delete this movie review?"
                                    modalBody="This action is permanent."
                                />
                                <EditIcon size={30} className="svg-icon-interactable" onClick={() => setMovieToBeEdited(movieReview.id)} />

                            </div>)}
                        </div>
                    </Row>
                    {movieReview.description != "" && <hr className="review-card-separator"></hr>}
                    <Row className="review-card-description-wrapper">
                        <div dangerouslySetInnerHTML={{ __html: movieReview.description }}></div>
                    </Row>
                </Card>) : (
                    <Col className="d-flex flex-column" key={index}>
                        <MovieReviewForm
                            purchasedTickets={purchasedTickets}
                            movieId={movieId as string}
                            movieToBeEdited={movieToBeEdited}
                            setMovieToBeEdited={setMovieToBeEdited}
                            movieReview={movieReview}
                            setMovieReviews={setMovieReviews}
                        />
                    </Col>
                )
            )}
        </InfiniteScroll>
    )
}

export default MovieReviewList;