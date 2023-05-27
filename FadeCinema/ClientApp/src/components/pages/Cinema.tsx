import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Card, Col, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import ReactMapGL, { GeolocateControl, NavigationControl } from "react-map-gl";
import { CinemaInfo, CinemaInfoRequest, CinemaInfoResponse, deleteCinema } from '../../services/CinemaService';
import DeleteIcon from '../svgs/DeleteIcon';
import EditIcon from '../svgs/EditIcon';
import { AuditoriumInfoResponse } from '../../services/AuditoriumService';
import { useUser } from '../../contexts/UserContext';
import AppModal from '../AppModal';

const Cinema = () => {
    const { cinemaId } = useParams();
    const { user, authenticate } = useUser();
    const navigate = useNavigate();

    const [cinema, setCinema] = useState<CinemaInfoRequest>({
        name: '',
        description: '',
        location: {
            address: '',
            country: '',
            state: '',
            city: '',
            district: '',
            zipCode: '',
            longitude: null,
            latitude: null,
        },
    });

    const [auditoriums, setAuditoriums] = useState<AuditoriumInfoResponse[]>([]);
    const [viewState, setViewState] = useState({
        longitude: 0,
        latitude: 3,
        zoom: 12,
    });
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');


    useEffect(() => {
        if (cinemaId !== undefined) {
            const getCinema = async () => {

                const response = await fetch(`/api/v1/cinemas/${cinemaId}`);
                const cinemaInfo: CinemaInfoResponse = await response.json();

                setCinema(cinemaInfo);
                setViewState((prevState) => ({ ...prevState, longitude: cinemaInfo.location.longitude as number, latitude: cinemaInfo.location.latitude as number }));
            }
            getCinema();
        }
    }, [])

    useEffect(() => {
        const getAuditoriums = async () => {
            const response = await fetch(`/api/v1/cinemas/${cinemaId}/auditoriums`);
            const auditoriums: AuditoriumInfoResponse[] = await response.json();

            setAuditoriums(auditoriums);
        }
        getAuditoriums();
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
                    <Link to="/cinemas">
                        Cinemas
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    {cinema.name}
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                <div className="icon-page-title-wrapper">
                    {cinemaId !== undefined && user?.role == "SuperAdmin" &&
                        (
                            <>
                                <AppModal
                                    component={
                                        <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                                    }
                                    modal={modal}
                                    toggle={toggle}
                                    handleOnClick={() => deleteCinema(cinemaId, authenticate(), navigate, setExistingScreeningError)}
                                    modalTitle={`Are you sure you want to delete ${cinema.name}?`}
                                    modalBody="This action is permanent."
                                    error={existingScreeningError}
                                />

                                <EditIcon className="icon-page-title svg-icon-interactable mr-50" onClick={() => navigate(`/cinema-management/${cinemaId}`)} />
                            </>
                        )}
                </div>
                <h1 className="display-1 page-title uppercase">{cinema.name}</h1>
            </div>
            <span className="display-6 uppercase">Description</span>
            <Card body className="colored-top-border-primary shadowed-component mb-200">
                {cinema.description ? <div dangerouslySetInnerHTML={{ __html: cinema.description }}></div> : <span className="fst-italic">No information.</span>}
            </Card>

            <Row>
                <Col md={7}>
                    <div>
                        <span className="display-6 uppercase">Location</span>
                    </div>

                    {cinema.location.longitude !== null && cinema.location.latitude !== null && <ReactMapGL
                        initialViewState={
                            viewState
                        }
                        mapboxAccessToken="pk.eyJ1IjoiZGJhbGl1a3luYXMiLCJhIjoiY2xlZ3p4ejFkMGJ6NDQwcWxlc2k0ZWg2NCJ9.drY-6kgs6M9lzxyR2GrYbQ"
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        style={{ width: "auto", height: 500, "border": "2px solid #d3d1d1", "borderRadius": "0.25rem", "marginBottom": "20px" }}
                    >
                        <NavigationControl position="bottom-right" />
                    </ReactMapGL>}
                    <div className="d-flex mb-50 flex-column">
                        <div className="d-flex align-items-center">

                        </div>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>Address</strong>: </span>
                            {cinema.location.address ? <span>{cinema.location.address}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20" >
                            <span className="uppercase"><strong>City</strong>: </span>
                            {cinema.location.city ? <span>{cinema.location.city}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>Country</strong>: </span>
                            {cinema.location.country ? <span>{cinema.location.country}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>District</strong>: </span>
                            {cinema.location.district ? <span>{cinema.location.district}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>Longitude</strong>: </span>
                            {cinema.location.longitude ? <span>{cinema.location.longitude}</span> : <span className="fst-italic">No information.</span>}
                        </Card>

                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>Latitude</strong>: </span>
                            {cinema.location.latitude ? <span>{cinema.location.latitude}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>State</strong>: </span>
                            {cinema.location.state ? <span>{cinema.location.state}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                        <Card body className="colored-left-border-secondary shadowed-component mb-20">
                            <span className="uppercase"><strong>Zip Code</strong>: </span>
                            {cinema.location.zipCode ? <span>{cinema.location.zipCode}</span> : <span className="fst-italic">No information.</span>}
                        </Card>
                    </div>


                </Col >
                <Col md={5}>
                    <span className="display-6 uppercase">Auditoriums</span>
                    <ListGroup>
                        {auditoriums.map((auditorium, index) => (
                            <ListGroupItem
                                key={index}
                                action
                                tag={Link}
                                to={`/auditorium/${auditorium.id}`}
                                className={`colored-top-border-list-item ${index == 0 ? "colored-top-border-primary colored-top-border-list-first-item " : ""}${index == auditoriums.length - 1 ? "colored-top-border-list-last-item" : ""}`}
                            >
                                {auditorium.name}, <strong>Seats</strong>: {auditorium.seatCount}
                            </ListGroupItem>))}
                    </ListGroup>
                    {auditoriums.length == 0 && <span className="fst-italic">Cinema does not have any auditoriums at this time.</span>}
                </Col>
            </Row >
        </div >
    )


}

export default Cinema;