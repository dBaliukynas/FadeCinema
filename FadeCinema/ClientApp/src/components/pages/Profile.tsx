import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardText, CardTitle, Col, Row, Spinner, Table } from 'reactstrap';
import { CinemaInfo, CinemaResponse } from '../../services/CinemaService';
import InfiniteScroll from 'react-infinite-scroller';
import { TicketCategoryResponse } from '../../services/TicketCategoryService';
import { User, useUser } from '../../contexts/UserContext';
import { ScreeningSeat, ScreeningSeatResponse } from '../../services/ScreeningService';
import { DateTime } from 'luxon';
import { deleteMovieReview, MovieReviewResponse } from '../../services/MovieReviewService';
import { Rating } from 'react-simple-star-rating';
import { getMovie } from '../../services/MovieService';


export type PurchasedTicketResponse = {
    id: string,
    authorId: string,
    user: User,
    screeningSeatId: string,
    ticketCategoryId: string,
    screeningSeatResponse: ScreeningSeatResponse,
    ticketCategoryResponse: TicketCategoryResponse,
}
export type PurchasedTicketHistoryItemResponse = {
    id: string,
    authorId: string,
    user: User,
    seatRow: string,
    seatNumber: string,
    auditoriumName: string,
    movieName: string,
    ticketCategoryName: string,
    ticketCategoryPrice: string,
    screeningStartTime: Date,
    screeningEndTime: Date,
}
export type MovieReviewHistoryItemResponse = {
    id: string,
    authorId: string,
    user: User,
    movieName: string,
    description: string,
    rating: number,
    publishedAt: Date,
}

const Profile = () => {
    const { authenticate } = useUser();

    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicketResponse[]>([]);
    const [hasMorePurchasedTickets, setHasMorePurchasedTickets] = useState<boolean>(false);
    const [purchasedTicketHistory, setPurchasedTicketHistory] = useState<PurchasedTicketHistoryItemResponse[]>([]);
    const [hasMorePurchasedTicketHistory, setHasMorePurchasedTicketHistory] = useState<boolean>(false);

    const [movieReviews, setMovieReviews] = useState<MovieReviewResponse[]>([]);
    const [hasMoreMovieReviews, setHasMoreMovieReviews] = useState<boolean>(false);
    const [movieReviewHistory, setMovieReviewHistory] = useState<MovieReviewHistoryItemResponse[]>([]);
    const [hasMoreMovieReviewHistory, setHasMoreMovieReviewHistory] = useState<boolean>(false);


    const getPurchasedTickets = async (page: number) => {
        const response = await fetch(`/api/v1/purchased-tickets`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            }
        });
        const purchasedTickets: PurchasedTicketResponse[] = await response.json();

        if (page == 0) {
            setPurchasedTickets(purchasedTickets);
        } else {
            setPurchasedTickets((prevState) => [...prevState, ...purchasedTickets]);
        }

        setPurchasedTickets(purchasedTickets);
    }
    const getPurchasedTicketHistory = async (page: number) => {
        const response = await fetch(`/api/v1/purchased-tickets-history`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            }
        });
        const purchasedTicketHistory: PurchasedTicketHistoryItemResponse[] = await response.json();

        if (page == 0) {
            setPurchasedTicketHistory(purchasedTicketHistory);
        } else {
            setPurchasedTicketHistory((prevState) => [...prevState, ...purchasedTicketHistory]);
        }

        setPurchasedTicketHistory(purchasedTicketHistory);
    }

    const getMovieReviews = async (page: number) => {
        const response = await fetch(`/api/v1/user/movie-reviews`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            }
        });
        const movieReviews: MovieReviewResponse[] = await response.json();

        if (page == 0) {
            setMovieReviews(movieReviews);
        } else {
            setMovieReviews((prevState) => [...prevState, ...movieReviews]);
        }

        setMovieReviews(movieReviews);
    }

    const getMovieReviewHistory = async (page: number) => {
        const response = await fetch(`/api/v1/movie-reviews-history`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            }
        });
        const movieReviewHistory: MovieReviewHistoryItemResponse[] = await response.json();

        if (page == 0) {
            setMovieReviewHistory(movieReviewHistory);
        } else {
            setMovieReviewHistory((prevState) => [...prevState, ...movieReviewHistory]);
        }

        setMovieReviewHistory(movieReviewHistory);
    }

    useEffect(() => {
        getPurchasedTickets(0);
        getPurchasedTicketHistory(0);

        getMovieReviews(0);
        getMovieReviewHistory(0);

    }, [])

    const purchasedTicketPairs = purchasedTickets.reduce<PurchasedTicketResponse[][]>((row, purchasedTicket, index) => {
        if (index % 2 === 0) {
            row.push([purchasedTicket]);
        } else {
            row[row.length - 1].push(purchasedTicket);
        }
        return row;
    }, []);
    const purchasedTicketHistoryPairs = purchasedTicketHistory.reduce<PurchasedTicketHistoryItemResponse[][]>((row, purchasedTicketHistoryItem, index) => {
        if (index % 2 === 0) {
            row.push([purchasedTicketHistoryItem]);
        } else {
            row[row.length - 1].push(purchasedTicketHistoryItem);
        }
        return row;
    }, []);

    const movieReviewPairs = movieReviews.reduce<MovieReviewResponse[][]>((row, movieReview, index) => {
        if (index % 2 === 0) {
            row.push([movieReview]);
        } else {
            row[row.length - 1].push(movieReview);
        }
        return row;
    }, []);
    const movieReviewHistoryPairs = movieReviewHistory.reduce<MovieReviewHistoryItemResponse[][]>((row, movieReviewHistoryItem, index) => {
        if (index % 2 === 0) {
            row.push([movieReviewHistoryItem]);
        } else {
            row[row.length - 1].push(movieReviewHistoryItem);
        }
        return row;
    }, []);

    return (
        <React.Fragment>
            <Breadcrumb className="ml-5">
                <BreadcrumbItem>
                    <Link to="/">
                        Home
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Profile
                </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="display-1 page-title uppercase">Profile</h1>
            <h1 className="display-4 uppercase">Recently purchased tickets</h1>
            {purchasedTickets.length == 0 && <span className="fst-italic">You have not purchased any tickets recently.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getPurchasedTickets}
                hasMore={hasMorePurchasedTickets}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {purchasedTicketPairs.map((pair, index) => (
                    <Row key={index} className="mb-50">
                        {pair.map((purchasedTicket) => (
                            <Col sm="6" key={purchasedTicket.id}>

                                <Card body tag={Link} to={`/screening/${purchasedTicket.screeningSeatResponse.screening.id}`} className="border-colored-top colored-top-border-secondary shadowed-component zoom d-flex no-text-decoration">
                                    <span><strong className="uppercase">Movie</strong>: {purchasedTicket.screeningSeatResponse.screening.movie.name}</span>
                                    <span><strong className="uppercase">Auditorium</strong>: {purchasedTicket.screeningSeatResponse.screening.auditorium.name}</span>
                                    <div>
                                        <strong>{DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.startTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong> - <strong>{DateTime.fromISO(purchasedTicket.screeningSeatResponse.screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong>
                                    </div>
                                    <span>SEAT ROW: {String.fromCharCode((Math.ceil(purchasedTicket.screeningSeatResponse.number != purchasedTicket.screeningSeatResponse.screening.auditorium.columns ? Math.ceil(purchasedTicket.screeningSeatResponse.position / purchasedTicket.screeningSeatResponse.screening.auditorium.columns) : (purchasedTicket.screeningSeatResponse.position / purchasedTicket.screeningSeatResponse.screening.auditorium.columns) - 1)) + 64)}, SEAT NUMBER: {purchasedTicket.screeningSeatResponse.number}</span>

                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
            <h1 className="display-4 uppercase mt-30">Recent reviews</h1>
            {movieReviews.length == 0 && <span className="fst-italic">You have not left any reviews recently.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getMovieReviews}
                hasMore={hasMoreMovieReviews}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {movieReviewPairs.map((pair, index) => (
                    <Row key={index} className="mb-50">
                        {pair.map((movieReview) => (
                            <Col sm="6" key={movieReview.id}>
                                <Card tag={Link} to={`/movie/${movieReview.movieId}`} key={index} className="border-colored-top colored-top-border-secondary shadowed-component mb-20 no-text-decoration zoom">
                                    <Row>
                                        <div className="review-card-top">
                                            <span className="ml-10"><strong className="uppercase">Movie</strong>: {movieReview.movie.name }</span>
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
                                        </div>
                                    </Row>
                                    <hr className="review-card-separator"></hr>
                                    <Row className="review-card-description-wrapper">
                                        <div dangerouslySetInnerHTML={{ __html: movieReview.description }}></div>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
            <h1 className="display-4 uppercase mt-100">History</h1>
            <h1 className="display-6 uppercase">Purchased tickets</h1>
            {purchasedTicketHistory.length == 0 && <span className="fst-italic">You have no purchased tickets history yet.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getPurchasedTicketHistory}
                hasMore={hasMorePurchasedTicketHistory}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {purchasedTicketHistoryPairs.map((pair, index) => (
                    <Row key={index} className="mb-50">
                        {pair.map((purchasedTicket) => (
                            <Col sm="6" key={purchasedTicket.id}>

                                <Card body className="border-colored-top colored-top-border-secondary shadowed-component zoom d-flex">
                                    <span><strong className="uppercase">Movie</strong>: {purchasedTicket.movieName}</span>
                                    <span><strong className="uppercase">Auditorium</strong>: {purchasedTicket.auditoriumName}</span>
                                    <div>
                                        <strong>{DateTime.fromISO(purchasedTicket.screeningStartTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong> - <strong>{DateTime.fromISO(purchasedTicket.screeningEndTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong>
                                    </div>
                                    <span>SEAT ROW: {purchasedTicket.seatRow}, SEAT NUMBER: {purchasedTicket.seatNumber}</span>

                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
            <h1 className="display-6 uppercase mt-30">Reviews</h1>
            {movieReviewHistory.length == 0 && <span className="fst-italic">You have no reviews history yet.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getMovieReviewHistory}
                hasMore={hasMoreMovieReviewHistory}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {movieReviewHistoryPairs.map((pair, index) => (
                    <Row key={index} className="mb-50">
                        {pair.map((movieReview) => (
                            <Col sm="6" key={movieReview.id}>
                                <Card key={index} className="border-colored-top colored-top-border-secondary shadowed-component mb-20 no-text-decoration zoom">
                                    <Row>
                                        <div className="review-card-top">
                                            <span className="ml-10"><strong className="uppercase">Movie</strong>: {movieReview.movieName} </span>
                                            <Rating
                                                className="mr-10"
                                                fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
                                                initialValue={movieReview.rating}
                                                readonly
                                                size={30}
                                            />
                                        </div>
                                        <div className="review-card-top">
                                            <span className=" ml-10 mb-10"><strong className="uppercase">Published</strong>: {DateTime.fromISO(movieReview.publishedAt.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")} </span>
                                        </div>
                                    </Row>
                                    <hr className="review-card-separator"></hr>
                                    <Row className="review-card-description-wrapper">
                                        <div dangerouslySetInnerHTML={{ __html: movieReview.description }}></div>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
        </React.Fragment>
    )
}

export default Profile;