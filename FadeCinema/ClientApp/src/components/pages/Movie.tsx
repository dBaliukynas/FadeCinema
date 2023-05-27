import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, FormGroup, ListGroup, Row, Spinner } from 'reactstrap';
import { User, useUser } from '../../contexts/UserContext';
import { deleteMovie, getMovie, MovieInfo, MovieResponse } from '../../services/MovieService';
import { ScreeningResponse } from '../../services/ScreeningService';
import AppModal from '../AppModal';
import DeleteIcon from '../svgs/DeleteIcon';
import EditIcon from '../svgs/EditIcon';
import { DateTime } from 'luxon'
import { Editor } from '@tinymce/tinymce-react';
import { PurchasedTicketResponse } from './Profile';
import { Rating } from 'react-simple-star-rating'
import MovieReviewForm from '../forms/MovieReviewForm';
import { MovieReviewResponse } from '../../services/MovieReviewService';
import MovieReviewList from '../lists/MovieReviewList';

export type FileResponse = {
    id: string,
    authorId: string,
    entityId: string,
    url: string,
    user: User
}

const Movie = () => {
    const { movieId } = useParams();
    const { user, authenticate } = useUser();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<MovieResponse>();
    const [images, setImages] = useState<FileResponse["url"][]>([]);
    const [screenings, setScreenings] = useState<ScreeningResponse[]>([]);
    const [hasMoreScreenings, setHasMoreScreenings] = useState<boolean>(false);
    const [hasMoreMovieReviews, setHasMoreMovieReviews] = useState<boolean>(false);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');
    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicketResponse[]>([]);
    const [movieReviews, setMovieReviews] = useState<MovieReviewResponse[]>([]);
    const [movieToBeEdited, setMovieToBeEdited] = useState<string>('');

    useEffect(() => {
        if (movieId !== undefined) {
            getMovie(movieId).then((movie) => setMovie(movie));

        }
    }, [])

    useEffect(() => {
        const getFiles = async () => {

            const response = await fetch(`/api/v1/blobs/${movieId}`);
            const fileResponseArray: FileResponse[] = await response.json();
            setImages(fileResponseArray.map(fileResponse => fileResponse.url))
        }
        getFiles();

    }, [])

    const getScreenings = async (page: number) => {

        const response = user != null ? await fetch(`/api/v1/screenings/movies/${movieId}?page=${page}`,
            {
                headers: {
                    "Authorization": authenticate()
                }
            }) : await fetch(`/api/v1/screenings/movies/${movieId}?page=${page}`);

        const screeningResponse: ScreeningResponse[] = await response.json();

        setHasMoreScreenings(response.headers.get('hasMore') === 'True' ? true : false);

        if (page == 0) {
            setScreenings(screeningResponse);
        } else {
            setScreenings((prevState) => [...prevState, ...screeningResponse]);
        }

    }


    const getPurchasedTickets = async (page: number) => {
        const response = await fetch(`/api/v1/purchased-tickets`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            }
        });

        let purchasedTickets: PurchasedTicketResponse[] = await response.json();
        purchasedTickets = purchasedTickets.filter(purchasedTicket => purchasedTicket.screeningSeatResponse.screening.movie.id == movieId)

        if (page == 0) {
            setPurchasedTickets(purchasedTickets);
        } else {
            setPurchasedTickets((prevState) => [...prevState, ...purchasedTickets]);
        }

        setPurchasedTickets(purchasedTickets);
    }

    const getMovieReviews = async (page: number) => {

        const response = user != null ? await fetch(`/api/v1/movie-reviews/${movieId}?page=${page}`,
            {
                headers: {
                    "Authorization": authenticate()
                }
            }) : await fetch(`/api/v1/movie-reviews/${movieId}?page=${page}`);

        const movieReviewResponse: MovieReviewResponse[] = await response.json();

        setHasMoreMovieReviews(response.headers.get('hasMore') === 'True' ? true : false);

        if (page == 0) {
            setMovieReviews(movieReviewResponse);
        } else {
            setMovieReviews((prevState) => [...prevState, ...movieReviewResponse]);
        }

    }

    useEffect(() => {
        getScreenings(0);
        getMovieReviews(0);

    }, [user])

    useEffect(() => {
        if (user != null) {
            getPurchasedTickets(0);
        }
    }, [user]);

    return (
        <div>
            <Breadcrumb className="ml-5">
                <BreadcrumbItem>
                    <Link to="/">
                        Home
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem >
                    <Link to="/movies">
                        Movies
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    {movie?.name }
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                <div className="icon-page-title-wrapper">
                    {movieId !== undefined && user?.role == "SuperAdmin" &&
                        (<>
                            <AppModal
                                component={
                                    <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                                }
                                modal={modal}
                                toggle={toggle}
                                handleOnClick={() => deleteMovie(movieId, authenticate(), navigate, setExistingScreeningError)}
                                modalTitle={`Are you sure you want to delete ${movie?.name}?`}
                                modalBody="This action is permanent."
                                error={existingScreeningError}
                            />
                            <EditIcon className="icon-page-title svg-icon-interactable mr-50" onClick={() => navigate(`/movie-management/${movieId}`)} />
                        </>)}
                </div>
                <h1 className="display-1 page-title uppercase">{movie?.name}</h1>
            </div>
            <Row>
                {images[0] && <img src={`${images[0]}`} className="w-100 mb-200"></img>}
            </Row>
            <span className="display-6 uppercase">Description</span>
            <Card body className="colored-top-border-primary shadowed-component mb-200">
                {movie?.description ? <div dangerouslySetInnerHTML={{ __html: movie.description }}></div> : <span className="fst-italic">No information.</span>}
            </Card>
            <Row>
                <Col md={8}>
                    <span className="display-6 uppercase">Screenings</span>
                    <ListGroup>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={getScreenings}
                            hasMore={hasMoreScreenings}
                            loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
                        >
                            {screenings.length != 0 && screenings.map((screening, index) =>
                                <Card key={index} body tag={Link} to={`/screening/${screening.id}`} className={`border-colored-top ${purchasedTickets.some(purchasedTicket => purchasedTicket.screeningSeatResponse.screening.id == screening.id) ? "colored-top-border-secondary" : "colored-top-border-primary"} shadowed-component zoom mb-20 no-text-decoration`}>
                                    <Row>
                                        <span className="screening-date-text mb-20">
                                            <strong>{DateTime.fromISO(screening.startTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong> - <strong>{DateTime.fromISO(screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong>
                                        </span>
                                        <Col md={6}>
                                            <div className="d-flex flex-column">
                                                <span><strong className="uppercase">Cinema</strong>: {screening.auditorium.cinema.name} </span>
                                                <span><strong className="uppercase">Country</strong>: {screening.auditorium.cinema.location.country} </span>
                                                <span><strong className="uppercase">City</strong>: {screening.auditorium.cinema.location.city} </span>
                                                <span><strong className="uppercase">Auditorium</strong>: {screening.auditorium.name} </span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex flex-column">
                                                {/*<span><strong>Available seats</strong>:</span>*/}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>)}
                        </InfiniteScroll>

                    </ListGroup>
                    {screenings.length == 0 && <span className="fst-italic">Movie does not have any screenings at this time.</span>}
                </Col>
                <Col md={4} className="d-flex flex-column">
                    <span className="display-6 uppercase">Reviews</span>
                    {!movieReviews.some(movieReview => movieReview.user.id == user?.sub) && <MovieReviewForm
                        purchasedTickets={purchasedTickets}
                        movieId={movieId as string}
                        movieToBeEdited={movieToBeEdited}
                        setMovieToBeEdited={setMovieToBeEdited}
                        setMovieReviews={setMovieReviews}
                    />}
                    {movieReviews.length == 0 && <span className="fst-italic">Movie does not have any reviews at this time.</span>}
                    <MovieReviewList
                        movieReviews={movieReviews}
                        purchasedTickets={purchasedTickets}
                        user={user}
                        movieId={movieId}
                        getMovieReviews={getMovieReviews}
                        hasMoreMovieReviews={hasMoreMovieReviews}
                        movieToBeEdited={movieToBeEdited}
                        setMovieToBeEdited={setMovieToBeEdited}
                        authHeader={user != null ? authenticate() : ""}
                        navigate={navigate}
                        setMovieReviews={setMovieReviews}

                    />
                </Col>
            </Row >
        </div>


    )
}

export default Movie;