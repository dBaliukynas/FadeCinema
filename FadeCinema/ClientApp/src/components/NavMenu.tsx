import * as React from 'react';
import { Button, Collapse, Container, Input, InputGroup, InputGroupText, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './NavMenu.css';
import Logo from './Logo';
import LoginItem from './LoginItem';
import Select, { GroupBase, OnChangeValue } from "react-select";
import { useState } from 'react';
import { StringOption } from './forms/CinemaForm';
import { useEffect } from 'react';
import SearchIcon from './svgs/SearchIcon';

export const NavMenu = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<string | null>("movies");
    const [value, setValue] = useState<string | null>("");

    useEffect(() => {
        if (location.pathname === '/search') {
            setType(searchParams.get("type"));
            setValue(searchParams.get("value"));
        }
    }, []);


    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm navmenu-margin-bottom p-0" light>
                <NavbarBrand tag={Link} to="/" className="p-0 m-0"><Logo className="navmenu-logo"></Logo></NavbarBrand>
                <NavbarToggler onClick={() => setIsOpen(!isOpen)} className="mr-2" />
                <div className={`navmenu-search ${isOpen ? 'navmenu-search-mobile' : ''}`}>
                    <InputGroup className="navmenu-search-input-group">
                        <Input
                            className="navmenu-search-input"
                            type="search"
                            placeholder="Search"
                            value={value ?? ""}
                            onChange={(event) => setValue(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    if (value == "") {
                                        return;
                                    }
                                    return navigate(`/search?type=${type}&value=${value}`);
                                }
                            }}
                        />
                        <Button
                            className="input-group-text"
                            onClick={() => {
                                if (value == "") {
                                    return;
                                }
                                return navigate(`/search?type=${type}&value=${value}`);
                            }}>
                            <SearchIcon />
                        </Button>
                    </InputGroup>
                    <div>
                    </div>
                    <Select
                        id="search-category"
                        name="search-category"
                        value={location.pathname === '/search' && { value: type, label: type != null && type[0].toUpperCase() + type.slice(1, -1) } || undefined}
                        onChange={(option) => setType(option?.value as string)}
                        options={[
                            {
                                value: "movies",
                                label: "Movie",
                            },
                            {
                                value: "auditoriums",
                                label: "Auditorium",
                            },
                            {
                                value: "cinemas",
                                label: "Cinema",
                            },
                        ]}
                        defaultValue={{
                            value: "Movie",
                            label: "Movie",
                        }}
                        isSearchable={false}
                        classNames={{
                            control: () => 'navmenu-search-category',
                        }}
                    />
                </div>
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={isOpen} navbar>
                    <ul className="navbar-nav flex-grow uppercase">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark nav-link-border-bottom" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark nav-link-border-bottom" to="/movies">Movies</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark nav-link-border-bottom" to="/cinemas">Cinemas</NavLink>
                        </NavItem>
                        <LoginItem />
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
}

export default NavMenu;
