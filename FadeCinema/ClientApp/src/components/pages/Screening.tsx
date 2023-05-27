import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import SeatPicker from "react-seat-picker";
import { Breadcrumb, BreadcrumbItem, Button, Card, Form } from 'reactstrap';
import { useUser } from '../../contexts/UserContext';
import { AuditoriumInfoResponse, deleteAuditorium, getAuditorium } from '../../services/AuditoriumService';
import { deleteScreening, getScreening, ScreeningResponse, ScreeningSeat } from '../../services/ScreeningService';
import AppModal from '../AppModal';
import DeleteIcon from '../svgs/DeleteIcon';
import EditIcon from '../svgs/EditIcon';
import { DateTime } from 'luxon';
import { PurchasedTicketResponse } from './Profile';

type Props = {
    id: string;
    row: string;
    number: number;
};


const Screening = () => {
    const { screeningId } = useParams();
    const { user, authenticate } = useUser();
    const navigate = useNavigate();

    const [screening, setScreening] = useState<ScreeningResponse>();
    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicketResponse[]>();

    useEffect(() => {
        if (screeningId !== undefined) {
            getScreening(screeningId).then((screening) => setScreening(screening));

        }
    }, [])

    const [screeningSeats, setScreeningSeats] = useState<any>([]);

    const getPurchasedTickets = async () => {
        const response = await fetch(`/api/v1/purchased-tickets/${screeningId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            }
        });
        const purchasedTickets: PurchasedTicketResponse[] = await response.json();
        setPurchasedTickets(purchasedTickets);
    }

    useEffect(() => {
        if (user != null) {
            getPurchasedTickets();
        }
    }, [user])


    useEffect(() => {
        if (screening?.seats != undefined) {
            if (user != null) {
                const matchingSeats = screening.seats.flatMap(screeningSeat =>
                    (screeningSeat as any).filter((screeningSeat: any) => purchasedTickets?.some(purchasedTicket => purchasedTicket.screeningSeatId == screeningSeat?.id))
                );

                const matchingIds = matchingSeats.map(matchingSeat => matchingSeat.id);
                screening.seats.flatMap(screeningSeat =>
                    (screeningSeat as any).map((screeningSeat: any) => matchingIds.includes(screeningSeat?.id) ? screeningSeat.orientation = "south" : screeningSeat));

            }
            setScreeningSeats([...screening.seats])
            setKey(Math.random());
        }
    }, [screening, purchasedTickets])


    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [isSeatPickerLoading, setIsSeatPickerLoading] = useState<boolean>(false);
    const [key, setKey] = useState<number>(0);
    const [selectedSeats, setSelectedSeats] = useState<ScreeningSeat[]>([]);

    const addSeat = ({ row, number, id }: Props, addCb: (row: string, number: number, id: string) => void) => {
        if (user == null) {
            return navigate("/login");
        }
        setIsSeatPickerLoading(true);

        let newSeats = [...screeningSeats];

        let selectedSeat = (newSeats[row.charCodeAt(0) - 64 - 1] as any).find((seat: any) => seat?.id == id);

        const index = (newSeats[row.charCodeAt(0) - 64 - 1] as any).findIndex((screeningSeat: { id: string; }) => screeningSeat?.id == selectedSeat?.id);

        (newSeats[row.charCodeAt(0) - 64 - 1] as any)[index].isSelected = true;

        setKey(Math.random());
        setScreeningSeats(newSeats);
        setSelectedSeats((prevState) => [...prevState, selectedSeat]);
        setIsSeatPickerLoading(false);
    };

    const removeSeat = ({ row, number, id }: Props, removeCb: (row: string, number: number, id: string) => void) => {
        setIsSeatPickerLoading(true);

        let newSeats = [...screeningSeats];

        let selectedSeat = (newSeats[row.charCodeAt(0) - 64 - 1] as any).find((seat: any) => seat?.id == id);

        const index = (newSeats[row.charCodeAt(0) - 64 - 1] as any).findIndex((screeningSeat: { id: string; }) => screeningSeat?.id == selectedSeat?.id);

        (newSeats[row.charCodeAt(0) - 64 - 1] as any)[index].isSelected = false;

        setKey(Math.random());
        setScreeningSeats(newSeats);
        let newSelectedSeats = [...selectedSeats];
        setSelectedSeats(newSelectedSeats.filter(selectedSeat => selectedSeat.id != id));
        setIsSeatPickerLoading(false);


    };


    const handlePurchase = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user == null) {
            return navigate("/login");
        }
        const response = await fetch("/api/v1/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({
                screeningId: screening?.id,
                selectedSeats: selectedSeats.sort((item, nextItem) => (item.position / (Math.ceil(screening?.auditorium.columns as number)) - (nextItem.position / Math.ceil(screening?.auditorium.columns as number)) || (item.number as number) - (nextItem.number as number))),
            }),
        })
        window.location.href = await response.text();
    }

    return (
        <div>
            <Breadcrumb className="ml-5">
                <BreadcrumbItem>
                    <Link to="/">
                        Home
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to="/movies">
                        Movies
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to={`/movie/${screening?.movie.id}`}>
                        {screening?.movie.name}
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Screening
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="position-relative">
                {screeningId !== undefined && user?.role == "SuperAdmin" &&
                    <AppModal
                        component={
                            <DeleteIcon className="icon-page-title svg-icon-interactable" onClick={toggle} />
                        }
                        modal={modal}
                        toggle={toggle}
                        handleOnClick={() => deleteScreening(screeningId, authenticate(), navigate)}
                        modalTitle="Are you sure you want to delete this screening?"
                        modalBody="This action is permanent."
                    />

                }
                <h1 className="display-1 page-title uppercase">Screening</h1>
            </div>
            {screening !== undefined && <span className="screening-date-text mb-20">
                <strong>{DateTime.fromISO(screening.startTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong> - <strong>{DateTime.fromISO(screening.endTime.toString(), { zone: "Europe/Vilnius" }).plus({ hours: 3 }).toFormat("yyyy-MM-dd HH:mm")}</strong>
            </span>}
            <div className="d-flex flex-column">
                <span><strong className="uppercase">Movie</strong>: {screening?.movie.name} </span>
                <span><strong className="uppercase">Cinema</strong>: {screening?.auditorium.cinema.name} </span>
                <span><strong className="uppercase">Country</strong>: {screening?.auditorium.cinema.location.country} </span>
                <span><strong className="uppercase">City</strong>: {screening?.auditorium.cinema.location.city} </span>
                <span><strong className="uppercase">Auditorium</strong>: {screening?.auditorium.name} </span>
            </div>
            {
                screening && <div className="auditorium">
                    <div className="screen">
                        <span className="screen-text uppercase">Screen</span>
                    </div>
                    <div
                        style={{ marginTop: "100px" }}
                    >
                        <SeatPicker
                            rows={screeningSeats}
                            alpha
                            visible
                            maxReservableSeats={9}
                            addSeatCallback={addSeat}
                            removeSeatCallback={removeSeat}
                            selectedByDefault
                            key={key}
                            loading={isSeatPickerLoading}
                        />
                    </div>
                </div>
            }
            <Form onSubmit={handlePurchase}>
                <Card body className="colored-left-border-secondary shadowed-component mb-20">
                    <div className="d-flex flex-column">
                        <span className="display-5 uppercase">{screening?.ticketCategory?.name}</span>
                        <span className="uppercase"><strong>One seat price: </strong>{screening?.ticketCategory.price}€</span>
                        <span className="uppercase"><strong>Total price: </strong>{(screening?.ticketCategory.price as number) * selectedSeats.length}€</span>
                        <span className="uppercase"><strong>Selected seats: </strong>{selectedSeats.length}</span>
                        <Button type="submit" disabled={selectedSeats.length == 0 || purchasedTickets!.length >= 9}>Purchase</Button>
                    </div>

                </Card>
            </Form>

        </div>
    )
}

export default Screening;