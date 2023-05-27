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


type ComponentProps = {
    auditoriumId: string | undefined,
    auditoriumInfo: AuditoriumInfo,
    isLoading: boolean,
}
type Props = {
    id: number;
    row: string;
    number: number;
};

export type NumberOption = {
    value: number, label: number
}
type StringOption = {
    value: string, label: string
}
const AuditoriumForm = ({ auditoriumId, auditoriumInfo, isLoading }: ComponentProps) => {

    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue, watch, trigger } = useForm<AuditoriumInfo>({
        defaultValues: {
            name: '',
            seats: [],
            rows: null,
            columns: null,
            selectedCinema: null,
        },
        mode: 'all',
    });

    const navigate = useNavigate();
    const { authenticate } = useUser();
    const [isSeatPickerLoading, setIsSeatPickerLoading] = useState<boolean>(false);
    const [key, setKey] = useState<number>(0);
    const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
    const rows = getValues().rows?.value;
    const columns = getValues().columns?.value;

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
        reset(auditoriumInfo)
    }, [auditoriumInfo])

    useEffect(() => {
        if (rows && columns === undefined) {
            setValue('columns', { value: 1, label: 1 });
            trigger('columns');
        }
        if (columns && rows === undefined) {
            setValue('rows', { value: 1, label: 1 });
            trigger('rows');
        }
        if (rows || columns) {
            generateSeats(rows ?? 1, columns ?? 1);
        }
    }, [rows, columns])


    const updateSeat = ({ row, number, id }: Props, toRemove: boolean) => {
        if (rows && columns) {
            setIsSeatPickerLoading(true);

            let newSeats = [...getValues().seats];

            const position = id - Math.floor(id / columns) * columns || columns;

            newSeats[row.charCodeAt(0) - 64 - 1][position - 1].isSelected = toRemove;
            toRemove &&
                (newSeats[row.charCodeAt(0) - 64 - 1][position - 1].number = undefined);

            let numberCount = 1;

            for (let i = 0; i < newSeats[row.charCodeAt(0) - 64 - 1].length; i++) {
                if (!newSeats[row.charCodeAt(0) - 64 - 1][i].isSelected) {
                    newSeats[row.charCodeAt(0) - 64 - 1][i]!.number = numberCount;
                    numberCount++;
                }
            }

            setKey(Math.random());
            setValue('seats', newSeats);

            setIsSeatPickerLoading(false);
        }

    };

    const removeSeat = (
        { row, number, id }: Props) => {
        updateSeat({ row, number, id }, true);
    };

    const addSeat = (
        { row, number, id }: Props) => {
        updateSeat({ row, number, id }, false);
    };

    const generateSeats = (rows: number, columns: number) => {
        const seats: Seat[][] = [];
        let idCount = 1;

        for (let i = 1; i <= rows; i++) {
            const row: Seat[] = [];

            for (let j = 1; j <= columns; j++) {
                const seat: Seat = {
                    id: idCount,
                    number: j,
                    isSelected: false,
                };
                idCount++;

                row.push(seat);
            }

            seats.push(row);
        }
        setKey(Math.random());
        setValue('seats', seats)

    };

    const createAuditorium = handleSubmit(async (auditoriumInfo: AuditoriumInfo) => {
        const auditoriumInfoRequest: AuditoriumInfoRequest = {
            name: auditoriumInfo.name,
            seats: auditoriumInfo.seats.flat().map(seat => (
                {
                    position: seat.id,
                    number: seat.number,
                    isSelected: seat.isSelected
                })),
            columns: auditoriumInfo!.columns!.value,
            rows: auditoriumInfo!.rows!.value,

        };
        const response = await fetch(`/api/v1/cinemas/${auditoriumInfo.selectedCinema?.value}/auditorium/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify(auditoriumInfoRequest),
        })

        const auditoriumInfoResponse: AuditoriumInfoResponse = await response.json();
        navigate(`/auditorium/${auditoriumInfoResponse.id}`)
    })

    const updateAuditorium = handleSubmit(async (auditoriumInfo: AuditoriumInfo) => {

        const response = await fetch(`/api/v1/cinemas/${auditoriumInfo.selectedCinema?.value}/auditoriums/${auditoriumId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({ name: auditoriumInfo.name })

        })
        const auditoriumInfoResponse: AuditoriumInfoResponse = await response.json();
        navigate(`/auditorium/${auditoriumInfoResponse.id}`)
    })

    return (
        <Form onSubmit={auditoriumId === undefined ? createAuditorium : updateAuditorium}>
            <FormGroup>
                <Label for="cinemaName" className="form-label-medium-size">
                    Name
                </Label>
                <Controller
                    name="name"
                    control={control as any}
                    rules={{
                        required: "Auditorium's name cannot be empty.",
                        maxLength: { value: 100, message: "Auditorium's name cannot be longer than 100 characters." }
                    }}
                    render={({ field }) => <Input invalid={!!errors.name}
                        {...field}
                        id={field.name}
                        name={field.name}
                        placeholder="Auditorium's name"
                        type="text"

                    />}
                />
                <FormFeedback>
                    {errors?.name?.message}
                </FormFeedback>
            </FormGroup>
            <div className="auditorium">
                <div className="screen">
                    <span className="screen-text uppercase">Screen</span>
                </div>
                <div
                    style={{ marginTop: "100px" }}
                    className="admin-panel-seat-generator"
                >
                    {auditoriumId === undefined ?
                        <SeatPicker
                            addSeatCallback={removeSeat}
                            removeSeatCallback={addSeat}
                            rows={getValues().seats}
                            maxReservableSeats={getValues().seats.flat().length}
                            alpha
                            visible
                            selectedByDefault
                            key={key}
                            loading={isSeatPickerLoading}
                        /> :
                        <SeatPicker
                            rows={auditoriumInfo.seats}
                            alpha
                            visible
                            selectedByDefault
                            key={isLoading}
                        />}
                </div>
            </div>
            {auditoriumId === undefined && <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="columns" className="form-label-medium-size">
                            Columns
                        </Label>
                        <Controller
                            name="columns"
                            control={control as any}
                            rules={{ required: "Column or row has to be chosen." }}
                            render={({ field }) => <Select
                                {...field}
                                id={field.name}
                                name={field.name}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: !!errors?.columns?.message ? '#dc3545' : '#cccccc',
                                    }),
                                }}
                                classNames={{
                                    control: (state) =>
                                        !!errors?.columns?.message ? 'error-select' : '',
                                }}
                                options={
                                    Array.from({ length: 50 }, (v, index) => ({
                                        value: index + 1,
                                        label: index + 1,
                                    }))
                                }
                                value={watch('columns')}
                            />}
                        />
                        <div className="error-message">{errors?.columns?.message}</div>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="rows" className="form-label-medium-size">
                            Rows
                        </Label>
                        <Controller
                            name="rows"
                            control={control as any}
                            rules={{ required: "Column or row has to be chosen." }}
                            render={({ field }) => <Select
                                {...field}
                                id={field.name}
                                name={field.name}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderColor: !!errors?.rows?.message ? '#dc3545' : '#cccccc',
                                    }),
                                }}
                                classNames={{
                                    control: (state) =>
                                        !!errors?.rows?.message ? 'error-select' : '',
                                }}
                                options={
                                    Array.from({ length: 50 }, (v, index) => ({
                                        value: index + 1,
                                        label: index + 1,
                                    }))
                                }
                                value={watch('rows')}
                            />}
                        />
                        <div className="error-message">{errors?.rows?.message}</div>
                    </FormGroup>
                </Col>
            </Row>}

            <FormGroup className="mb-200">
                <Label for="selectedCinema" className="form-label-medium-size">
                    Cinema
                </Label>
                <Controller
                    name="selectedCinema"
                    control={control as any}
                    rules={{ required: "Cinema has to be chosen." }}
                    render={({ field }) => <Select
                        {...field}
                        id={field.name}
                        name={field.name}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: !!errors?.selectedCinema?.message ? '#dc3545' : '#cccccc',
                            }),
                        }}
                        classNames={{
                            control: () =>
                                !!errors?.selectedCinema?.message ? 'error-select' : '',
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
                <div className="error-message">{errors?.selectedCinema?.message}</div>
            </FormGroup>


            <Button className="w-100 mt-30 mb-30 height-50" type="submit">
                {auditoriumId === undefined ? "Create" : "Save changes"}
            </Button>
        </Form>
    );
};

export default AuditoriumForm;
