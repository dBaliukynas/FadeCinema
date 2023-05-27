import React from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Spinner } from 'reactstrap';
import { useUser } from '../../contexts/UserContext';

type RegisterInfo = {
    username: string;
    email: string;
    password: string;
}

type AuthResponse = {
    success: boolean;
    token: string;
    errorMessages: string[];
}

const RegisterForm = () => {
    const { control, handleSubmit, formState: { errors }, reset, getValues, setError } = useForm<RegisterInfo>({
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
        mode: 'all',
    });
    const [isLoading, setIsloading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setAuth } = useUser();

    const handleRegister = handleSubmit(async (registerInfo: RegisterInfo) => {

        const response = await fetch("/api/v1/identity/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerInfo),
        });

        const authResponse: AuthResponse = await response.json();

        if (!response.ok) {

            Object.entries(authResponse.errorMessages).forEach(([key, message]) => {
                if (!message.includes('Passwords')) {
                    setError('email', { message: message });
                }
            });

            return response.status;
        }

        setIsloading(true);

        setAuth(authResponse.token);

        navigate("/");
    })


    return (
        isLoading ? (<Spinner className="large-spinner">
            Loading...
        </Spinner >) : <Form className="w-35" onSubmit={handleRegister}>
            <FormGroup>
                <Label for="username">
                    Username
                </Label>
                <Controller
                    name="username"
                    control={control as any}
                    rules={{
                        required: "Username cannot be empty.",
                    }}
                    render={({ field }) => <Input invalid={!!errors?.username}
                        {...field}
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Your username"
                    />}
                />
                <FormFeedback>
                    {errors?.username?.message}
                </FormFeedback>
            </FormGroup>
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
                        },
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
                        minLength: { value: 6, message: "Password must be at least 6 characters long." },
                        validate: {
                            nonAlphaNumeric: (value) => /(?=.*[^a-zA-Z])/.test(value) || "Password must contain at least 1 non alphanumeric character.",
                            digit: (value) => /(?=.*[0-9])/.test(value) || "Password must have contain at least 1 digit character.",
                            uppercase: (value) => /(?=.*[A-Z])/.test(value) || "Password must contain at least 1 uppercase letter."
                        }
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
                <FormFeedback>
                    {errors?.root?.message}
                </FormFeedback>
            <Button className="w-100 mt-30 height-50" type="submit">
                Register
            </Button>
        </Form>

    )
}

export default RegisterForm;
