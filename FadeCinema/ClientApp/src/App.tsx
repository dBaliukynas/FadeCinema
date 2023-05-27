import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/pages/AdminPanel';
import CinemaManagement from './components/pages/management/CinemaManagement';
import AuditoriumManagement from './components/pages/management/AuditoriumManagement';
import MovieManagement from './components/pages/management/MovieManagement';
import ScreeningManagement from './components/pages/management/ScreeningManagement';
import TicketCategoryManagement from './components/pages/management/TicketCategoryManagement';
import Cinemas from './components/pages/Cinemas';
import Cinema from './components/pages/Cinema';
import Auditorium from './components/pages/Auditorium';

import './custom.css'
import Movies from './components/pages/Movies';
import Movie from './components/pages/Movie';
import Screening from './components/pages/Screening';
import TicketCategories from './components/pages/TicketCategories';
import Profile from './components/pages/Profile';
import PaymentSuccess from './components/pages/PaymentSuccess';
import SearchResults from './components/pages/SearchResults';
import PaymentFailure from './components/pages/PaymentFailure';

export default () => (
    <Layout>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route
                path='/login'
                element={
                    <ProtectedRoute
                        requiredGuest
                        component={<Login />}
                    />
                }
            />
            <Route
                path='/register'
                element={
                    <ProtectedRoute
                        requiredGuest
                        component={<Register />}
                    />
                }
            />
            <Route
                path='/admin-panel'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<AdminPanel />}
                    />}
            />
            <Route
                path='/cinema-management/:cinemaId?'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<CinemaManagement />}
                    />}
            />
            <Route
                path='/auditorium-management'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<AuditoriumManagement />}
                    />}
            />
            <Route
                path='/auditorium-management/:auditoriumId?'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<AuditoriumManagement />}
                    />}
            />
            <Route
                path='/movie-management'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<MovieManagement />}
                    />}
            />
            <Route
                path='/movie-management/:movieId?'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<MovieManagement />}
                    />}
            />
            <Route
                path='/screening-management'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<ScreeningManagement />}
                    />}
            />
            <Route
                path='/ticket-category-management'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<TicketCategoryManagement />}
                    />}
            />
            <Route
                path='/ticket-category-management/:ticketCategoryId?'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<TicketCategoryManagement />}
                    />}
            />
            <Route
                path='/cinemas'
                element={<Cinemas />}

            />
            <Route
                path='/movies'
                element={<Movies />}

            />
            <Route
                path='/ticket-categories'
                element={
                    <ProtectedRoute
                        requiredRoles={["SuperAdmin"]}
                        component={<TicketCategories />}
                    />}
            />
            <Route
                path='/cinema/:cinemaId'
                element={<Cinema />}
            />
            <Route
                path='/auditorium/:auditoriumId'
                element={<Auditorium />}
            />
            <Route
                path='/movie/:movieId'
                element={<Movie />}
            />
            <Route
                path='/screening/:screeningId'
                element={<Screening />}
            />
            <Route
                path='/profile'
                element={
                    <ProtectedRoute
                        component={<Profile />}
                    />}
            />
            <Route
                path='/payment-success'
                element={
                    <ProtectedRoute
                        component={<PaymentSuccess />}
                    />}
            />
            <Route
                path='/payment-failure'
                element={
                    <ProtectedRoute
                        component={<PaymentFailure />}
                    />}
            />
            <Route
                path='/search'
                element={<SearchResults />}
            />
        </Routes>
    </Layout>
);  
