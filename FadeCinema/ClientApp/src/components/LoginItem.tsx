import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap';
import { useUser } from '../contexts/UserContext';

const LoginItem = () => {
    const { user, setAuth } = useUser();
    const navigate = useNavigate();

    const logout = () => {
        setAuth(null);
        navigate("/");
    }

    return (
        <React.Fragment>
            {user && <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="position-relative">
                    {user.name}
                </DropdownToggle>
                <DropdownMenu className="end-0">
                  <DropdownItem>
                        <NavLink tag={Link} to="/profile" className="uppercase">Profile</NavLink>
                    </DropdownItem>
                    {user.role == "SuperAdmin" && <DropdownItem>
                        <NavLink tag={Link} to="/admin-panel" className="admin-panel-nav-item uppercase">Admin Panel</NavLink>
                    </DropdownItem>}
                    <DropdownItem divider />
                    <DropdownItem><NavLink onClick={logout} className="uppercase">Log out</NavLink></DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>}
            {!user && (<React.Fragment><NavItem>
                <NavLink tag={Link} className="text-dark nav-link-border-bottom" to="/login">Login</NavLink>
            </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark nav-link-border-bottom" to="/register">Register</NavLink>
                </NavItem> </React.Fragment>)
            }
        </React.Fragment>
    )

};

export default LoginItem;
