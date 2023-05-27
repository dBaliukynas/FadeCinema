import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Select from 'react-select/dist/declarations/src/Select';
import { Spinner } from 'reactstrap';
import { useUser } from '../../contexts/UserContext';



const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { authenticate } = useUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const sessionId = searchParams.get("session-id");
    const ticketCategoryId = searchParams.get("ticket-category-id");
    const seatIds = searchParams.get("seat-ids");
    const selectedSeats = seatIds?.split(',');

    useEffect(() => {
        fetch(`/api/v1/ticket-purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({
                sessionId,
                ticketCategoryId,
                seatIds: selectedSeats,
            }),
        }).then(() => navigate('/profile'))
    }, [])

    return (
        <React.Fragment>
            <Spinner className="large-spinner d-block ms-auto me-auto">
                Loading...
            </Spinner >
        </React.Fragment>
    )
}

export default PaymentSuccess;