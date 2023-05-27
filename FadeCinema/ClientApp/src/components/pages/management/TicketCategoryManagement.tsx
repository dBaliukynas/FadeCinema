import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useUser } from '../../../contexts/UserContext';
import { deleteTicketCategory, getTicketCategory, TicketCategoryInfo } from '../../../services/TicketCategoryService';
import AppModal from '../../AppModal';
import TicketCategoryForm from '../../forms/TicketCateogryForm';
import DeleteIcon from '../../svgs/DeleteIcon';
const TicketCategoryManagement = () => {
    const { ticketCategoryId } = useParams();
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const [ticketCategoryInfo, setTicketCategoryInfo] = useState<TicketCategoryInfo>({
        name: '',
        price: '',
    });

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [existingScreeningError, setExistingScreeningError] = useState<string>('');


    useEffect(() => {
        if (ticketCategoryId !== undefined) {
            getTicketCategory(ticketCategoryId).then((ticketCategory) => {

                if (ticketCategory.price === null) {
                    ticketCategory.price = '';
                }
                setTicketCategoryInfo(ticketCategory);
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
                    Ticket Category Management
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                {ticketCategoryId !== undefined && <AppModal
                    component={
                        <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                    }
                    modal={modal}
                    toggle={toggle}
                    handleOnClick={() => deleteTicketCategory(ticketCategoryId, authenticate(), navigate, setExistingScreeningError)}
                    modalTitle={`Are you sure you want to delete ${ticketCategoryInfo.name}?`}
                    modalBody="This action is permanent."
                    error={existingScreeningError}
                />}
                <h1 className="display-1 uppercase page-title">{ticketCategoryId === undefined ? "Creating a ticket category" : "Editing a ticket category"}</h1>
            </div>
            <TicketCategoryForm ticketCategoryId={ticketCategoryId} ticketCategoryInfo={ticketCategoryInfo} />
        </div>
    )
}

export default TicketCategoryManagement;