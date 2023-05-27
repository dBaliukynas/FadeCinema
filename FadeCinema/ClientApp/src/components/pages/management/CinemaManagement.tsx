import React, { useEffect, useState } from 'react';
import Stepper from '../../Stepper';
import { Link, useNavigate, useParams } from "react-router-dom";
import CinemaForm from '../../forms/CinemaForm';
import DeleteIcon from '../../svgs/DeleteIcon';
import { useUser } from '../../../contexts/UserContext';
import { CinemaInfo, CinemaInfoResponse, deleteCinema } from '../../../services/CinemaService';
import AppModal from '../../AppModal';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

const CinemaManagement = () => {
    const { cinemaId } = useParams();
    const navigate = useNavigate();
    const { authenticate } = useUser();

    const [cinemaInfo, setCinemaInfo] = useState<CinemaInfo>({
        name: '',
        description: '',
        location: {
            address: '',
            country: null,
            state: '',
            city: null,
            district: '',
            zipCode: '',
            longitude: '',
            latitude: '',
        },
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');

    useEffect(() => {
        if (cinemaId !== undefined) {
            const getCinema = async () => {

                const response = await fetch(`/api/v1/cinemas/${cinemaId}`);
                const cinemaInfoResponse: CinemaInfoResponse = await response.json();

                if (cinemaInfoResponse.location.longitude === null) {
                    cinemaInfoResponse.location.longitude = '';
                }
                if (cinemaInfoResponse.location.latitude === null) {
                    cinemaInfoResponse.location.latitude = '';
                }

                setCinemaInfo({
                    ...cinemaInfoResponse, location: {
                        ...cinemaInfoResponse.location, country: {
                            value: cinemaInfoResponse.location.country, label: cinemaInfoResponse.location.country
                        },
                        city: {
                            value: cinemaInfoResponse.location.city, label: cinemaInfoResponse.location.city
                        }
                    }
                })
            }

            getCinema();
            setIsLoading(false);
        }
    }, [])

    return <div>
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
                Cinema Management
            </BreadcrumbItem>
        </Breadcrumb>
        <div className="position-relative">
            {cinemaId !== undefined && <AppModal
                component={
                    <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                }
                modal={modal}
                toggle={toggle}
                handleOnClick={() => deleteCinema(cinemaId, authenticate(), navigate, setExistingScreeningError)}
                modalTitle={`Are you sure you want to delete ${cinemaInfo.name}?`}
                modalBody="This action is permanent."
                error={existingScreeningError}
            />}
            <h1 className="display-1 uppercase page-title">{cinemaId === undefined ? "Creating a cinema" : "Editing a cinema"}</h1>
        </div>

        <CinemaForm cinemaId={cinemaId} cinemaInfo={cinemaInfo} isLoading={isLoading} />
    </div>
}

export default CinemaManagement;