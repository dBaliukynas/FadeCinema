import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardText, CardTitle, Col, Row } from 'reactstrap';
import CircularAddIcon from '../svgs/CircularAddIcon';

const AdminPanel = () => (
    <React.Fragment>
        <Breadcrumb className="ml-5">
            <BreadcrumbItem>
                <Link to="/">
                    Home
                </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
                    Admin Panel
            </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="display-1 page-title uppercase">Admin Panel</h1>
        <Row className="mb-50">
            <Col sm="6">
                <h2 className="display-4 uppercase">Cinemas</h2>
                <Card body className="border-colored-top colored-top-border-secondary shadowed-component">
                    <NavLink
                        to="/cinema-management"
                        className="circular-add-link"
                    >
                        <CircularAddIcon size={100} className="circular-icon" />
                    </NavLink>
                </Card>
            </Col>
            <Col sm="6">
                <h2 className="display-4 uppercase">Auditoriums</h2>
                <Card body className="border-colored-top colored-top-border-secondary shadowed-component">
                    <NavLink
                        to="/auditorium-management"
                        className="circular-add-link"
                    >
                        <CircularAddIcon size={100} className="circular-icon" />
                    </NavLink>
                </Card>
            </Col>
        </Row>
        <Row className="mb-50">
            <Col sm="6">
                <h2 className="display-4 uppercase">Movies</h2>
                <Card body className="border-colored-top colored-top-border-secondary shadowed-component">
                    <NavLink
                        to="/movie-management"
                        className="circular-add-link"
                    >
                        <CircularAddIcon size={100} className="circular-icon" />
                    </NavLink>
                </Card>
            </Col>
            <Col sm="6">
                <h2 className="display-4 uppercase">Screenings</h2>
                <Card body className="border-colored-top colored-top-border-secondary shadowed-component">
                    <NavLink
                        to="/screening-management"
                        className="circular-add-link"
                    >
                        <CircularAddIcon size={100} className="circular-icon" />
                    </NavLink>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col sm="6">
                <h2 className="display-4 uppercase">Ticket Categories</h2>
                <Card body className="border-colored-top colored-top-border-secondary shadowed-component">
                    <NavLink
                        to="/ticket-category-management"
                        className="circular-add-link"
                    >
                        <CircularAddIcon size={100} className="circular-icon" />
                    </NavLink>
                    <NavLink
                        to="/ticket-categories"
                        className="circular-add-link"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={100}
                            height={100}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#54b0b0"
                            strokeWidth={1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="circular-icon"

                        >
                            <line x1={8} y1={6} x2={21} y2={6} />
                            <line x1={8} y1={12} x2={21} y2={12} />
                            <line x1={8} y1={18} x2={21} y2={18} />
                            <line x1={3} y1={6} x2={3.01} y2={6} />
                            <line x1={3} y1={12} x2={3.01} y2={12} />
                            <line x1={3} y1={18} x2={3.01} y2={18} />
                        </svg>
                    </NavLink>
                   
                </Card>
            </Col>
        </Row>
    </React.Fragment>
)

export default AdminPanel