import React, { FormEventHandler, useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { Button, Col, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, Label, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { MovieInfo, MovieResponse } from '../../services/MovieService';
import AsyncSelect from 'react-select/async';
import { Feature, StringOption } from './CinemaForm';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { TicketCategoryInfo, TicketCategoryResponse } from '../../services/TicketCategoryService';

type Props = {
    ticketCategoryId: string | undefined,
    ticketCategoryInfo: TicketCategoryInfo,
}

registerPlugin(FilePondPluginImagePreview)
const TicketCategoryForm = ({ticketCategoryId, ticketCategoryInfo }:Props) => {
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue, watch, trigger, setError } = useForm<TicketCategoryInfo>({
        defaultValues: {
            name: '',
            price: '',
        },
        mode: 'all',
    });

    const createTicketCategory = handleSubmit(async (ticketCategoryInfo: TicketCategoryInfo) => {

        const response = await fetch('/api/v1/ticket-category', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify(ticketCategoryInfo)

        })
        const ticketCategoryResponse: TicketCategoryResponse = await response.json()
        navigate("/ticket-categories");
    })

    const updateTicketCategory = handleSubmit(async (ticketCategoryInfo: TicketCategoryInfo) => {
        if (ticketCategoryInfo.price === '') {
            ticketCategoryInfo.price = null;
        }

        const response = await fetch(`/api/v1/ticket-categories/${ticketCategoryId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify(ticketCategoryInfo)

        })
        const ticketCategoryRespnse: TicketCategoryResponse = await response.json();
        navigate('/ticket-categories')
    });

    useEffect(() => {
        reset(ticketCategoryInfo)
    }, [ticketCategoryInfo])

    return (
        <div>
            <Form onSubmit={ticketCategoryId === undefined ? createTicketCategory : updateTicketCategory}>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="name" className="form-label-medium-size">
                                Name
                            </Label>
                            <Controller
                                name="name"
                                control={control as any}
                                rules={{ required: "Ticket's category name cannot be empty.", maxLength: { value: 100, message: "Ticket's category name cannot be longer than 100 characters." } }}
                                render={({ field }) => <Input invalid={!!errors.name}
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    placeholder="Ticket's category name"
                                    type="text"

                                />}
                            />
                            <FormFeedback>
                                {errors?.name?.message}
                            </FormFeedback>
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="price" className="form-label-medium-size">
                                Price
                            </Label>
                            <Controller
                                name="price"
                                control={control as any}
                                rules={{
                                    min: {
                                        value: 1.0, message: "The minimum price of a ticket is 1 euro."
                                    },
                                    max: {
                                        value: 100.0, message: "The maximum price of a ticket is 100 euros."
                                    }
                                }}
                                render={({ field }) => <InputGroup>
                                    <Input invalid={!!errors?.price}
                                        {...field}
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                    />
                                    <InputGroupText>
                                        €
                                    </InputGroupText>
                                    <FormFeedback>
                                        {errors?.price?.message}
                                    </FormFeedback>
                                </InputGroup>}
                            />

                        </FormGroup>
                    </Col>
                </Row>

                <Button className="w-100 mt-30 mb-30 height-50" type="submit">
                    Create
                </Button>

            </Form>

        </div >
    )

}
export default TicketCategoryForm;