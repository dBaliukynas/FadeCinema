import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import SeatPicker from "react-seat-picker";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useUser } from '../../contexts/UserContext';
import { AuditoriumInfoResponse, deleteAuditorium, getAuditorium } from '../../services/AuditoriumService';
import AppModal from '../AppModal';
import DeleteIcon from '../svgs/DeleteIcon';
import EditIcon from '../svgs/EditIcon';

const Auditorium = () => {
    const { auditoriumId } = useParams();
    const { user, authenticate } = useUser();
    const navigate = useNavigate();

    const [auditorium, setAuditorium] = useState<AuditoriumInfoResponse>();
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');

    useEffect(() => {
        if (auditoriumId !== undefined) {
            getAuditorium(auditoriumId).then((auditorium) => setAuditorium(auditorium));

        }
    }, [])


    return (
        <React.Fragment>
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
                <BreadcrumbItem>
                    <Link to={`/cinema/${auditorium?.cinema.id}`}>
                        {auditorium?.cinema.name}
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    {auditorium?.name}
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                <div className="icon-page-title-wrapper">
                    {auditoriumId !== undefined && user?.role == "SuperAdmin" && (
                        <>
                            <AppModal
                                component={
                                    <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                                }
                                modal={modal}
                                toggle={toggle}
                                handleOnClick={() => deleteAuditorium(auditoriumId, authenticate(), navigate, setExistingScreeningError)}
                                modalTitle={`Are you sure you want to delete ${auditorium?.name}?`}
                                modalBody="This action is permanent."
                                error={existingScreeningError}
                            /> <EditIcon className="icon-page-title svg-icon-interactable mr-50" onClick={() => navigate(`/auditorium-management/${auditoriumId}`)} />
                        </>)
                    }
                </div>
                <h1 className="display-1 page-title uppercase">{auditorium?.name}</h1>
            </div>
            {
                auditorium && <div className="auditorium">
                    <div className="screen">
                        <span className="screen-text uppercase">Screen</span>
                    </div>
                    <div
                        style={{ marginTop: "100px" }}
                    >
                        <SeatPicker
                            rows={auditorium.seats}
                            alpha
                            visible
                            selectedByDefault
                        />
                    </div>
                </div>
            }

        </React.Fragment>

    )
}

export default Auditorium;