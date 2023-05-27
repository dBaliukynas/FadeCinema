import React, { useEffect, useState } from "react";
import Select, { GroupBase, OnChangeValue } from "react-select";
// @ts-ignore
import SeatPicker from "react-seat-picker";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { AuditoriumInfo, AuditoriumInfoRequest, AuditoriumInfoResponse, Seat, SeatRequest } from "../../services/AuditoriumService";
import { CinemaInfo, CinemaResponse } from "../../services/CinemaService";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
// @ts-ignore
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { ScreeningInfo, ScreeningResponse } from "../../services/ScreeningService";
import { TicketCategoryResponse } from "../../services/TicketCategoryService";
import { MovieResponse } from "../../services/MovieService";

export type NumberOption = {
    value: number, label: number
}
const ScreeningForm = () => {

    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue, watch, trigger, setError } = useForm<ScreeningInfo>({
        defaultValues: {
            cinema: null,
            auditorium: null,
            movie: null,
            ticketCategory: null,
            startTime: new Date(),
            endTime: new Date(),
            days: '',

        },
        mode: 'all',
    });

    const navigate = useNavigate();
    const { authenticate } = useUser();
    const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
    const [auditoriums, setAuditoriums] = useState<AuditoriumInfoResponse[]>([]);
    const [movies, setMovies] = useState<MovieResponse[]>([]);
    const [ticketCategories, setTicketCategories] = useState<TicketCategoryResponse[]>([]);

    const [time, setTime] = useState<any>(['08:00', '20:00']);
    const [screeningTimeOverlapError, setScreeningTimeOverlapError] = useState<string>('');

    useEffect(() => {
        const getCinemas = async () => {
            const response = await fetch("/api/v1/cinemas", { method: "GET" });
            if (response.ok) {
                const cinemas: CinemaResponse[] = await response.json();
                setCinemas(cinemas);
            }
        };

        getCinemas();
    }, []);

    useEffect(() => {
        const getAuditoriums = async () => {
            const response = await fetch(`/api/v1/cinemas/${getValues().cinema?.value}/auditoriums`);
            const auditoriums: AuditoriumInfoResponse[] = await response.json();

            setAuditoriums(auditoriums);
        }
        getAuditoriums();
    }, [getValues().cinema])

    useEffect(() => {
        const getMovies = async () => {
            const response = await fetch(`/api/v1/movies`);
            const movies: MovieResponse[] = await response.json();

            setMovies(movies);
        }
        getMovies();
    }, [])
    useEffect(() => {
        const getTicketCategories = async () => {
            const response = await fetch(`/api/v1/ticket-categories`);
            const ticketCategories: TicketCategoryResponse[] = await response.json();

            setTicketCategories(ticketCategories);
        }
        getTicketCategories();
    }, [])



    const createScreening = handleSubmit(async (screeningInfo: ScreeningInfo) => {
        const selectedMovie = movies.find(movie => movie.id == getValues().movie?.value)
        const [startHours, startMinutes] = time[0].split(":");
        const [endHours, endMinutes] = time[1].split(":");

        let currentStartTime = new Date();
        currentStartTime.setHours(startHours);
        currentStartTime.setMinutes(startMinutes);
        let endTime = new Date();

        let minuteDifference = endMinutes - startMinutes + (endHours - startHours) * 60;
        if (startHours > endHours || (startHours == endHours && startMinutes > endMinutes)) {
            minuteDifference = 1440 + minuteDifference;
        }

        for (let i = 0; i < Number(getValues().days as number); i++) {
            currentStartTime = new Date();
            currentStartTime.setDate(currentStartTime.getDate() + 1 * i);
            currentStartTime.setHours(startHours);
            currentStartTime.setMinutes(startMinutes);
            for (let j = 0; j <= Math.floor(minuteDifference / (selectedMovie?.duration as number) - 1); j++) {
                if (currentStartTime.getHours() > endHours || (currentStartTime.getHours() == endHours &&  currentStartTime.getMinutes() > endMinutes)) {
                    return navigate(`/movie/${getValues().movie?.value}`)
                }
                endTime = new Date(currentStartTime.getTime() + (selectedMovie?.duration as number * 60000));

                const response = await fetch(`/api/v1/screening/${getValues().movie?.value}/${getValues().auditorium?.value}/${getValues().ticketCategory?.value}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authenticate(),
                    },
                    body: JSON.stringify({
                        movieId: getValues().movie?.value,
                        auditoriumId: getValues().auditorium?.value,
                        ticketCategoryId: getValues().ticketCategory?.value,
                        startTime: currentStartTime,
                        endTime: endTime,
                    })

                })
                const screeningResponse: ScreeningResponse = await response.json();
                if (!response.ok) {
                    setScreeningTimeOverlapError("Screening time overlaps with another screening in the same auditorium.");

                    return response.status;
                }
                currentStartTime = new Date(endTime);
                currentStartTime.setMinutes(currentStartTime.getMinutes() + 20)
            }
        }

        navigate(`/movie/${getValues().movie?.value}`)

    })



    return (
        <Form >
            <FormGroup className="mb-200">
                <Label for="movie" className="form-label-medium-size">
                    Movie
                </Label>
                <Controller
                    name="movie"
                    control={control as any}
                    rules={{ required: "Movie has to be chosen." }}
                    render={({ field }) => <Select
                        {...field}
                        id={field.name}
                        name={field.name}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: !!errors?.movie?.message ? '#dc3545' : '#cccccc',
                            }),
                        }}
                        value={watch('movie')}
                        classNames={{
                            control: () =>
                                !!errors?.movie?.message ? 'error-select' : '',
                        }}
                        options={movies.map(
                            (movie) =>
                            ({
                                value: movie.id,
                                label:
                                    movie.name,
                            })
                        )}
                    />}
                />
                <div className="error-message">{errors?.movie?.message}</div>
            </FormGroup>
            <FormGroup className="mb-200">
                <Label for="cinema" className="form-label-medium-size">
                    Cinema
                </Label>
                <Controller
                    name="cinema"
                    control={control as any}
                    rules={{ required: "Cinema has to be chosen." }}
                    render={({ field }) => <Select
                        {...field}
                        id={field.name}
                        name={field.name}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: !!errors?.cinema?.message ? '#dc3545' : '#cccccc',
                            }),
                        }}
                        value={watch('cinema')}
                        classNames={{
                            control: () =>
                                !!errors?.cinema?.message ? 'error-select' : '',
                        }}
                        options={cinemas.map(
                            (cinema) =>
                            ({
                                value: cinema.id,
                                label:
                                    cinema.name,
                            })
                        )}
                    />}
                />
                <div className="error-message">{errors?.cinema?.message}</div>
            </FormGroup>

            <FormGroup className="mb-200">
                <Label for="auditorium" className="form-label-medium-size">
                    Auditorium
                </Label>
                <Controller
                    name="auditorium"
                    control={control as any}
                    rules={{ required: "Auditorium has to be chosen." }}
                    render={({ field }) => <Select
                        {...field}
                        id={field.name}
                        name={field.name}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: !!errors?.auditorium?.message ? '#dc3545' : '#cccccc',
                            }),
                        }}
                        isDisabled={getValues().cinema === null}
                        classNames={{
                            control: () =>
                                !!errors?.auditorium?.message ? 'error-select' : '',
                        }}
                        options={auditoriums.map(
                            (auditorium) =>
                            ({
                                value: auditorium.id,
                                label:
                                    auditorium.name,
                            })
                        )}
                    />}
                />
                <div className="error-message">{errors?.auditorium?.message}</div>
            </FormGroup>
            <FormGroup className="mb-200">
                <Label for="ticketCategory" className="form-label-medium-size">
                    Ticket Category
                </Label>
                <Controller
                    name="ticketCategory"
                    control={control as any}
                    rules={{ required: "Ticket category has to be chosen." }}
                    render={({ field }) => <Select
                        {...field}
                        id={field.name}
                        name={field.name}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: !!errors?.ticketCategory?.message ? '#dc3545' : '#cccccc',
                            }),
                        }}
                        classNames={{
                            control: () =>
                                !!errors?.ticketCategory?.message ? 'error-select' : '',
                        }}
                        options={ticketCategories.map(
                            (ticketCategory) =>
                            ({
                                value: ticketCategory.id,
                                label:
                                    ticketCategory.name,
                            })
                        )}
                    />}
                />
                <div className="error-message">{errors?.ticketCategory?.message}</div>
            </FormGroup>
            <FormGroup>
                <Row>
                    <Col md={6} className="d-flex flex-column">
                        <Label for="time" className="form-label-medium-size">
                            Time Range
                        </Label>
                        <TimeRangePicker
                            value={time}
                            onChange={setTime}
                            disableClock={true}
                            locale="LT-lt"
                            clearIcon={null}
                        />
                    </Col>
                    <Col md={6} className="d-flex flex-column">
                        <Label for="days" className="form-label-medium-size">
                            Day Count
                        </Label>
                        <Controller
                            name="days"
                            control={control as any}
                            rules={{
                                required: "Day count has to be chosen.",
                                min: {
                                    value: 1, message: "The minimum amount of days is 1."
                                },

                            }}
                            render={({ field }) =>
                                <Input invalid={!!errors?.days}
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                    value={watch('days') as number}
                                />
                            }
                        />
                        <FormFeedback>
                            {errors?.days?.message}
                        </FormFeedback>

                    </Col>
                </Row>

            </FormGroup>
            {screeningTimeOverlapError !== '' && <span className="error-message">{screeningTimeOverlapError}</span>}

            <Button className="w-100 mt-30 mb-30 height-50" onClick={createScreening}>
                Create
            </Button>
        </Form>
    );
};

export default ScreeningForm;
