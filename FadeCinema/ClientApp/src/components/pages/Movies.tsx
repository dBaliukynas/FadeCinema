import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardText, CardTitle, Col, Row, Spinner } from 'reactstrap';
import { CinemaInfo, CinemaResponse } from '../../services/CinemaService';
import InfiniteScroll from 'react-infinite-scroller';
import { MovieResponse } from '../../services/MovieService';
import { FileResponse } from './Movie';



const Movies = () => {

    const [movies, setMovies] = useState<MovieResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [images, setImages] = useState<FileResponse[]>([]);

    const getMovies = async (page: number) => {
        const response = await fetch(`/api/v1/movies?page=${page}`);
        if (response.ok) {
            const movies: MovieResponse[] = await response.json();

            setHasMore(response.headers.get('hasMore') === 'True' ? true : false);
            if (page == 0) {
                setMovies(movies);
            } else {
                setMovies((prevState) => [...prevState, ...movies]);
            }

        }
    }

    useEffect(() => {
        const getFiles = async () => {

            var response = await fetch('/api/v1/blobs/entities/movies');
            var fileResponseArray: FileResponse[] = await response.json();
            setImages(fileResponseArray)
        }
        getFiles();

    }, [])

    useEffect(() => {
        getMovies(0);
    }, [])


    const pairs = movies.reduce<MovieResponse[][]>((row, movie, index) => {
        if (index % 2 === 0) {
            row.push([movie]);
        } else {
            row[row.length - 1].push(movie);
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
                    Movies
                </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="display-1 page-title uppercase">Movies</h1>
            {movies.length == 0 && <span className="fst-italic">There are no movies created at this time.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getMovies}
                hasMore={hasMore}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {pairs.map((pair, pairIndex) => (
                    <Row key={pairIndex} className="mb-50">
                        {pair.map(movie =>
                        (
                            <Col sm="6" key={movie.id}>

                                <Card body tag={Link} to={`/movie/${movie.id}`} className="shadowed-component zoom card-title align-items-center justify-content-center"
                                    style={
                                        {
                                            "height": "5em",
                                            "backgroundImage": `linear-gradient(169deg, rgba(0,0,0,0.7679446778711485) 0%, rgba(0,0,0,0) 100%), url(${images.find(image => image.entityId == movie.id)?.url})`,
                                            "backgroundSize": "cover",
                                            "color": "#ffffff",
                                        }
                                    }>
                                    <span className="text-shadowed">{movie.name}</span>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
        </React.Fragment>
    )
}

export default Movies;