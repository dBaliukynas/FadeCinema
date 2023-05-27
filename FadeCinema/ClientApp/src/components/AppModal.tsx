import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type Props = {
    component: React.ReactNode,
    modal: boolean,
    toggle: () => void,
    handleOnClick: () => void,
    modalTitle: JSX.Element | string,
    modalBody: JSX.Element | string,
    error?: string,
}

const AppModal = ({ component, modal, toggle, handleOnClick, modalTitle, modalBody, error }: Props) => {

    return (
        <div>
            {component}
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                <ModalBody className="d-flex flex-column">

                    {modalBody}
                    {error !== '' && <span className="error-message">{error}</span>}

                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleOnClick}>
                        Delete
                    </Button>{' '}
                    <Button className="btn-tertiary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default AppModal;