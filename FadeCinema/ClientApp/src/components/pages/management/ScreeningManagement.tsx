import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import ScreeningForm from '../../forms/ScreeningForm';
const ScreeningManagement = () => {
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
                    Screening Management
                </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="display-1 uppercase page-title">Creating screenings</h1>
            <ScreeningForm />
        </div>
    )
}

export default ScreeningManagement;