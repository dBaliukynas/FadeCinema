import React, { FormEventHandler, useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button, Col, Form, FormFeedback, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import ReactMapGL, { GeolocateControl, NavigationControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css'
import { Editor } from '@tinymce/tinymce-react';
import Geocoder from '../map/Geocoder';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { CinemaInfo, CinemaInfoRequest, CinemaResponse } from '../../services/CinemaService';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async';
import { createFilter } from 'react-select';


type Props = {
    cinemaId: string | undefined,
    cinemaInfo: CinemaInfo,
    isLoading: boolean
}

export type Feature = {
    place_name: string,
    short_code: string,
    context: {
        short_code: string,
    }
};

export type StringOption = {
    label: string,
    value: string,
};


const CinemaForm = ({ cinemaId, cinemaInfo, isLoading }: Props) => {

    const { authenticate } = useUser();
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue, watch, trigger, setError } = useForm<CinemaInfo>({
        defaultValues: {
            name: '',
            description: '',
            location: {
                address: '',
                longitude: '',
                latitude: '',
                country: null,
                state: '',
                city: null,
                district: '',
                zipCode: ''
            }
        },
        mode: 'all',
    });


    const [viewState, setViewState] = useState({
        longitude: 25.2797,
        latitude: 54.6872,
        zoom: 8,
    });
    const [countryShortCode, setCountryShortCode] = useState<string>('');

    const [mapSearchResult, setMapSearchResult] = useState<MapboxGeocoder.Result | null>(null);

    const country = getValues().location?.country?.value;
    const city = getValues().location?.city?.value;

    const handleLocationFromMapChange = () => {
        const address = mapSearchResult?.properties?.address;
        const country = mapSearchResult?.context?.find(item => item.id.toString().startsWith("country"))?.text;
        const state = mapSearchResult?.context?.find(item => item.id.toString().startsWith("region") || item.id.toString().startsWith("state"))?.text;
        const city = mapSearchResult?.context?.find(item => item?.id?.toString().startsWith("place"))?.text;
        const district = mapSearchResult?.context?.find(item => item.id.toString().startsWith("district"))?.text;
        const zipCode = mapSearchResult?.context?.find(item => item.id.toString().startsWith("postcode"))?.text;
        const longitude = mapSearchResult?.geometry.coordinates[0];
        const latitude = mapSearchResult?.geometry.coordinates[1];


        setValue("location.address", address ?? '');
        trigger('location.address');
        setValue("location.country", country ? { value: country, label: country } : null);
        trigger('location.country');
        setValue("location.state", state ?? '');
        setValue("location.city", city ? { value: city, label: city } : null);
        trigger('location.city');
        setValue("location.district", district ?? '');
        setValue("location.zipCode", zipCode ?? '');
        setValue("location.longitude", longitude ?? '');
        setValue("location.latitude", latitude ?? '');
    }

    const loadFeatures = async (type: 'country' | 'place', value: string) => {
        let response = null;
        if (country === undefined) {
            response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&types=${type}`);
        } else {
            response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&types=place&country=${countryShortCode}`);
        }
        const data: { features: Feature[] } = await response.json();
        const options: StringOption[] = data.features.map((feature: Feature) => {
            return {
                label: type === 'place' ? feature.place_name.split(',')[0] : feature.place_name,
                value: type === 'place' ? feature.place_name.split(',')[0] : feature.place_name,
            }

        })
        return options;
    }


    const createCinema = handleSubmit(async (cinemaInfo: CinemaInfo) => {
        if (cinemaInfo.location.latitude === '') {
            cinemaInfo.location.latitude = null;
        }

        if (cinemaInfo.location.longitude === '') {
            cinemaInfo.location.longitude = null;
        }
        const cinemaInfoRequest: CinemaInfoRequest = {
            ...cinemaInfo, location: { ...cinemaInfo.location, country: getValues().location?.country?.value as string, city: getValues().location?.city?.value as string }
        }

        const response = await fetch('/api/v1/cinema', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify(cinemaInfoRequest)

        })
        const cinemaResponse: CinemaResponse = await response.json();
        navigate(`/cinema/${cinemaResponse.id}`)
    })

    const updateCinema = handleSubmit(async (cinemaInfo: CinemaInfo) => {
        if (cinemaInfo.location.latitude === '') {
            cinemaInfo.location.latitude = null;
        }

        if (cinemaInfo.location.longitude === '') {
            cinemaInfo.location.longitude = null;
        }

        const cinemaInfoRequest: CinemaInfoRequest = {
            ...cinemaInfo, location: { ...cinemaInfo.location, country: getValues().location?.country?.value as string, city: getValues().location?.city?.value as string }
        }

        const response = await fetch(`/api/v1/cinemas/${cinemaId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify(cinemaInfoRequest)

        })

        const cinemaResponse: CinemaResponse = await response.json();
        navigate(`/cinema/${cinemaResponse.id}`)
    })

    useEffect(() => {
        reset(cinemaInfo)
    }, [cinemaInfo])

    useEffect(() => {
        const getShortCode = async () => {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${country}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&types=country`);
            const data: any = await response.json();
            setCountryShortCode(data.features[0]?.properties?.short_code);
        }
        (getShortCode())
    }, [country])


    return (
        <Form onSubmit={cinemaId === undefined ? createCinema : updateCinema}>
            <FormGroup>
                <Label for="name" className="form-label-medium-size">
                    Name
                </Label>
                <Controller
                    name="name"
                    control={control as any}
                    rules={{ required: "Cinema's name cannot be empty.", maxLength: { value: 100, message: "Cinema's name cannot be longer than 100 characters." } }}
                    render={({ field }) => <Input invalid={!!errors.name}
                        {...field}
                        id={field.name}
                        name={field.name}
                        placeholder="Cinema's name"
                        type="text"

                    />}
                />
                <FormFeedback>
                    {errors?.name?.message}
                </FormFeedback>
            </FormGroup>
            <Label for="description" className="form-label-medium-size">
                Description
            </Label>
            <FormGroup>
                <Controller
                    name="description"
                    control={control as any}
                    render={({ field: { onChange, name } }) => <Editor
                        id={name}
                        apiKey={process.env.REACT_APP_TINYMCE_ACCESS_TOKEN}

                        init={{
                            min_height: 500,
                            autoresize_bottom_margin: 0,
                            menubar: false,
                            plugins: [
                                'advlist', 'autoresize', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | styles | fontsize ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | table | fullscreen | searchreplace | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={onChange}
                        value={getValues().description}

                    />}
                />
            </FormGroup>
            <Label for="cinemaLocation" className="form-label-medium-size">
                Location
            </Label>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="location.address">
                            Address
                        </Label>
                        <Controller
                            name="location.address"
                            control={control as any}
                            rules={{ required: "Cinema's address cannot be empty." }}
                            render={({ field }) => <Input invalid={!!errors?.location?.address}
                                {...field}
                                id={field.name}
                                name={field.name}
                                placeholder="1234 Main St"
                            />}
                        />
                        <FormFeedback>
                            {errors?.location?.address?.message}
                        </FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <Label for="location.longitude">
                            Longitude
                        </Label>
                        <Controller
                            name="location.longitude"
                            control={control as any}
                            rules={{
                                min: {
                                    value: -180.0, message: "The minimum length of longitude is -180."
                                },
                                max: {
                                    value: 180.0, message: "The maximum length of longitude is 180."
                                }
                            }}
                            render={({ field }) => <Input invalid={!!errors?.location?.longitude}
                                {...field}
                                id={field.name}
                                name={field.name}
                                type="number"
                            />}
                        />
                        <FormFeedback>
                            {errors?.location?.longitude?.message}
                        </FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <Label for="location.latitude">
                            Latitude
                        </Label>
                        <Controller
                            name="location.latitude"
                            control={control as any}
                            rules={{
                                min: {
                                    value: -90.0, message: "The minimum length of latitude is -90."
                                },
                                max: {
                                    value: 90.0, message: "The maximum length of longitude is 90."
                                }
                            }}
                            render={({ field }) => <Input invalid={!!errors?.location?.latitude}
                                {...field}
                                id={field.name}
                                name={field.name}
                                type="number"
                            />}
                        />
                        <FormFeedback>
                            {errors?.location?.latitude?.message}
                        </FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="location.country">
                            Country
                        </Label>
                        <Controller
                            name="location.country"
                            control={control as any}
                            rules={{ required: "Cinema's country cannot be empty." }}
                            render={({ field }) => <AsyncSelect
                                {...field}
                                id={field.name}
                                name={field.name}
                                loadOptions={(value) => loadFeatures('country', value)}
                                noOptionsMessage={() => 'Search for countries'}
                                isClearable={true}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderColor: !!errors?.location?.country?.message ? '#dc3545' : '#cccccc',
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        zIndex: 2
                                    }),
                                }}
                                classNames={{
                                    control: (state) =>
                                        !!errors?.location?.country?.message ? 'error-select' : '',
                                }}
                                value={watch('location.country')}


                            />}
                        />
                        <div className="error-message">{errors?.location?.country?.message as any}</div>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="location.state">
                            State / Region
                        </Label>
                        <Controller
                            name="location.state"
                            control={control as any}
                            render={({ field }) => <Input
                                {...field}
                                id={field.name}
                                name={field.name}
                                type="text"

                            />}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="location.city">
                            City
                        </Label>
                        <Controller
                            name="location.city"
                            control={control as any}
                            rules={{ required: "Cinema's city cannot be empty." }}
                            render={({ field }) => <AsyncSelect
                                {...field}
                                id={field.name}
                                name={field.name}
                                loadOptions={(value) => loadFeatures('place', value)}
                                noOptionsMessage={() => 'Search for cities'}
                                isClearable={true}
                                isDisabled={country === undefined}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderColor: !!errors?.location?.city?.message ? '#dc3545' : '#cccccc',
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        zIndex: 2
                                    }),
                                }}
                                classNames={{
                                    control: (state) =>
                                        !!errors?.location?.city?.message ? 'error-select' : '',
                                }}
                                value={watch('location.city')}
                            />}
                        />
                        <div className="error-message">{errors?.location?.city?.message as any}</div>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <Label for="location.district">
                            District
                        </Label>
                        <Controller
                            name="location.district"
                            control={control as any}
                            render={({ field }) => <Input
                                {...field}
                                id={field.name}
                                name={field.name}
                                type="text"

                            />}
                        />
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup>
                        <Label for="location.zipCode">
                            Zip
                        </Label>
                        <Controller
                            name="location.zipCode"
                            control={control as any}
                            render={({ field }) => <Input
                                {...field}
                                id={field.name}
                                name={field.name}
                                type="text"

                            />}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
            </Row>
            <FormGroup className="position-relative">
                <Button onClick={handleLocationFromMapChange} className=" mb-1 set-location-map-button">
                    Set location from a map
                </Button>
                <ReactMapGL
                    initialViewState={
                        viewState
                    }
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onMove={(event) =>
                        setViewState(event.viewState)
                    }
                    style={{ width: "auto", height: 500, "border": "2px solid #d3d1d1", "borderRadius": "0.25rem" }}
                >
                    <NavigationControl position="bottom-right" />
                    <Geocoder mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string} setMapSearchResult={setMapSearchResult} />
                </ReactMapGL>
            </FormGroup>

            <Button className="w-100 mt-30 mb-30 height-50" type="submit">
                {cinemaId === undefined ? "Create" : "Save changes"}
            </Button>

        </Form>
    )
}
export default CinemaForm;