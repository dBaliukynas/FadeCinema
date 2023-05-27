import React from 'react';
import { useState, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { useUser } from '../../contexts/UserContext';

type LoginInfo = {
    email: string;
    password: string;
}

type AuthResponse = {
    success: boolean;
    token: string;
    errorMessages: [];
}


const LoginForm = () => {
    const { control, handleSubmit, formState: { errors }, reset, getValues, setError } = useForm<LoginInfo>({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'all',
    });

    const navigate = useNavigate();

    const { setAuth, user } = useUser();

    const handleLogin = handleSubmit(async (loginInfo: LoginInfo) => {

        const response = await fetch("/api/v1/identity/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginInfo),
        });

        const authResponse: AuthResponse = await response.json();

        if (!response.ok) {

            Object.entries(authResponse.errorMessages).forEach(([key, message]) => {
                    setError('email', { message: '' });
                    setError('password', { message: "Username or password is incorrect." });
            });

            return response.status;
        }

        setAuth(authResponse.token);

        navigate("/");
    })

    return (
        <Form className="w-35" onSubmit={handleLogin}>
            <FormGroup>
                <Label for="email">
                    Email
                </Label>
                <Controller
                    name="email"
                    control={control as any}
                    rules={{
                        required: "Email cannot be empty.",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email has to match a valid format."
                        }
                    }}
                    render={({ field }) => <Input invalid={!!errors?.email}
                        {...field}
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="Your email"
                    />}
                />
                <FormFeedback>
                    {errors?.email?.message}
                </FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label for="password">
                    Password
                </Label>
                <Controller
                    name="password"
                    control={control as any}
                    rules={{
                        required: "Password cannot be empty.",
                    }}
                    render={({ field }) => <Input invalid={!!errors?.password}
                        {...field}
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="Your password"
                    />}
                />
                <FormFeedback>
                    {errors?.password?.message}
                </FormFeedback>
            </FormGroup>
            <Button className="w-100 mt-30 height-50" type="submit">
                Login
            </Button>
        </Form>
    )
}

export default LoginForm;
