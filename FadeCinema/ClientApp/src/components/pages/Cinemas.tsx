import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardText, CardTitle, Col, Row, Spinner } from 'reactstrap';
import { CinemaInfo, CinemaResponse } from '../../services/CinemaService';
import InfiniteScroll from 'react-infinite-scroller';



const Cinemas = () => {

    const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const getCinemas = async (page: number) => {
        const response = await fetch(`/api/v1/cinemas?page=${page}`);
        if (response.ok) {
            const cinemas: CinemaResponse[] = await response.json();

            setHasMore(response.headers.get('hasMore') === 'True' ? true : false);
            if (page == 0) {
                setCinemas(cinemas);
            } else {
                setCinemas((prevState) => [...prevState, ...cinemas]);
            }

        }
    }

    useEffect(() => {
        getCinemas(0);

    }, [])

    const pairs = cinemas.reduce<CinemaResponse[][]>((row, cinema, index) => {
        if (index % 2 === 0) {
            row.push([cinema]);
        } else {
            row[row.length - 1].push(cinema);
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
                    Cinemas
                </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="display-1 page-title uppercase">Cinemas</h1>
            {cinemas.length == 0 && <span className="fst-italic">There are no cinemas created at this time.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getCinemas}
                hasMore={hasMore}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {pairs.map((pair, index) => (
                    <Row key={index} className="mb-50">
                        {pair.map((cinema) => (
                            <Col sm="6" key={cinema.id}>

                                <Card body tag={Link} to={`/cinema/${cinema.id}`} className="border-colored-top colored-top-border-primary shadowed-component zoom card-title">
                                    {cinema.name}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
        </React.Fragment>
    )
}

export default Cinemas;