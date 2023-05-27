import React, { useEffect, useState } from 'react';
import Select from 'react-select';
// @ts-ignore 
import SeatPicker from 'react-seat-picker';
import { Breadcrumb, BreadcrumbItem, Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { CinemaInfo, CinemaResponse } from '../../../services/CinemaService';
import AuditoriumForm from '../../forms/AuditoriumForm';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuditoriumInfo, AuditoriumInfoResponse, deleteAuditorium, getAuditorium } from '../../../services/AuditoriumService';
import DeleteIcon from '../../svgs/DeleteIcon';
import { useUser } from '../../../contexts/UserContext';
import AppModal from '../../AppModal';


const AuditoriumManagement = () => {
    const { auditoriumId } = useParams();
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const [auditoriumInfo, setAuditoriumInfo] = useState<AuditoriumInfo>(
        {
            name: '',
            seats: [],
            columns: null,
            rows: null,
            selectedCinema: null,
        });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');


    useEffect(() => {
        if (auditoriumId !== undefined) {
            getAuditorium(auditoriumId).then((auditorium) => {
                setAuditoriumInfo({
                    name: auditorium.name,
                    seats: auditorium.seats as any,
                    columns: {
                        value: auditorium.columns, label: auditorium.columns
                    },
                    rows: {
                        value: auditorium.seatCount / auditorium.columns, label: auditorium.seatCount / auditorium.columns
                    },
                    selectedCinema: {value: auditorium.cinema.id, label: auditorium.cinema.name}
                });

                setIsLoading(false);
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
                    Auditorium Management
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                {auditoriumId !== undefined && <AppModal
                    component={
                        <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                    }
                    modal={modal}
                    toggle={toggle}
                    handleOnClick={() => deleteAuditorium(auditoriumId, authenticate(), navigate, setExistingScreeningError)}
                    modalTitle={`Are you sure you want to delete ${auditoriumInfo.name}?`}
                    modalBody="This action is permanent."
                    error={existingScreeningError}
                />}
                <h1 className="display-1 uppercase page-title">{auditoriumId === undefined ? "Creating an auditorium" : "Editing an auditorium"}</h1>
            </div>
            <AuditoriumForm
                auditoriumId={auditoriumId}
                auditoriumInfo={auditoriumInfo}
                isLoading={isLoading}
            />
        </div >
    )
}

export default AuditoriumManagement;