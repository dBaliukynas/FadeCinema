import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {

    return (
        <React.Fragment>
            <div className="d-flex align-items-center flex-column">
                <span className="dark-red-text display-6">Something went wrong with the payment.</span>
                <span className="dark-red-text display-6">Please try again.</span>
            </div>
        </React.Fragment>
    )
}

export default PaymentFailure;