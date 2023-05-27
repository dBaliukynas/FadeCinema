import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardText, CardTitle, Col, Row, Spinner } from 'reactstrap';
import { CinemaInfo, CinemaResponse } from '../../services/CinemaService';
import InfiniteScroll from 'react-infinite-scroller';
import { TicketCategoryResponse } from '../../services/TicketCategoryService';



const TicketCategories = () => {

    const [ticketCategories, setTicketCategories] = useState<TicketCategoryResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const getTicketCategories = async (page: number) => {
        const response = await fetch(`/api/v1/ticket-categories?page=${page}`);
        if (response.ok) {
            const ticketCategoryResponse: TicketCategoryResponse[] = await response.json();

            setHasMore(response.headers.get('hasMore') === 'True' ? true : false);
            if (page == 0) {
                setTicketCategories(ticketCategoryResponse);
            } else {
                setTicketCategories((prevState) => [...prevState, ...ticketCategoryResponse]);
            }

        }
    }

    useEffect(() => {
        getTicketCategories(0);

    }, [])

    const pairs = ticketCategories.reduce<TicketCategoryResponse[][]>((row, ticketCategory, index) => {
        if (index % 2 === 0) {
            row.push([ticketCategory]);
        } else {
            row[row.length - 1].push(ticketCategory);
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
                <BreadcrumbItem>
                    <Link to="/admin-panel">
                        Admin Panel
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Ticket Categories
                </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="display-1 page-title uppercase">Ticket categories</h1>
            {ticketCategories.length == 0 && <span className="fst-italic">There are no ticket categories created at this time.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getTicketCategories}
                hasMore={hasMore}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {pairs.map((pair, index) => (
                    <Row key={index} className="mb-50">
                        {pair.map((ticketCategory) => (
                            <Col sm="6" key={ticketCategory.id}>

                                <Card body tag={Link} to={`/ticket-category-management/${ticketCategory.id}`} className="border-colored-top colored-top-border-primary shadowed-component zoom card-title">
                                    {ticketCategory.name}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
        </React.Fragment>
    )
}

export default TicketCategories;