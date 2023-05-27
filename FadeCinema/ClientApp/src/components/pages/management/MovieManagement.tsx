import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useUser } from '../../../contexts/UserContext';
import { deleteMovie, getMovie, MovieInfo } from '../../../services/MovieService';
import AppModal from '../../AppModal';
import MovieForm from '../../forms/MovieForm';
import DeleteIcon from '../../svgs/DeleteIcon';
const MovieManagement = () => {
    const { movieId } = useParams();
    const { authenticate } = useUser();
    const navigate = useNavigate();
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({
        name: '',
        description: '',
        country: null,
        director: '',
        duration: '',
    });

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');

    useEffect(() => {
        if (movieId !== undefined) {
            getMovie(movieId).then((movie) => {

                if (movie.duration === null) {
                    movie.duration = '';
                }
                setMovieInfo({
                    ...movie, country: {
                        value: movie.country, label: movie.country
                    }
                });
            })
        }
    }, [])
    return (
        <div>
            <Breadcrumb className="ml-5">
                <BreadcrumbItem>
                    <Link to="/">
                        Home
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to="/admin-panel">
                        Admin Panel
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Movie Management
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                {movieId !== undefined && <AppModal
                    component={
                        <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                    }
                    modal={modal}
                    toggle={toggle}
                    handleOnClick={() => deleteMovie(movieId, authenticate(), navigate, setExistingScreeningError)}
                    modalTitle={`Are you sure you want to delete ${movieInfo.name}?`}
                    modalBody="This action is permanent."
                    error={existingScreeningError}
                />}
                <h1 className="display-1 uppercase page-title">{movieId === undefined ? "Creating a movie" : "Editing a movie"}</h1>
            </div>
            <MovieForm movieId={movieId} movieInfo={movieInfo} />
        </div>
    )
}

export default MovieManagement;