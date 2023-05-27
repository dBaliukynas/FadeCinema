import React, { FormEventHandler, useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { MovieInfo, MovieResponse } from '../../services/MovieService';
import AsyncSelect from 'react-select/async';
import { Feature, StringOption } from './CinemaForm';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';
import { FileResponse } from '../pages/Movie';

type Props = {
    movieId: string | undefined,
    movieInfo: MovieInfo,
}

registerPlugin(FilePondPluginImagePreview)
const MovieForm = ({ movieId, movieInfo }: Props) => {
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue, watch, trigger, setError } = useForm<MovieInfo>({
        defaultValues: {
            name: '',
            description: '',
            country: null,
            director: '',
            duration: '',
        },
        mode: 'all',
    });
    const [files, setFiles] = useState<any>([])
    const [fileToDeleteName, setFileToDeleteName] = useState<string>('');
    const [fileError, setFileError] = useState<string>('');

    useEffect(() => {
        reset(movieInfo)
    }, [movieInfo])


    useEffect(() => {
        const getFiles = async () => {

            var response = await fetch(`/api/v1/blobs/${movieId}`);
            var fileResponseArray: FileResponse[] = await response.json();
            setFiles(fileResponseArray.map(fileResponse => fileResponse.url))
        }
        getFiles();

    }, [])




    const loadFeatures = async (value: string) => {
        let response = null;

        response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&types=country`);

        const data: { features: Feature[] } = await response.json();
        const options: StringOption[] = data.features.map((feature: Feature) => {
            return {
                label: feature.place_name,
                value: feature.place_name,
            }

        })
        return options;
    }

    const createMovie = handleSubmit(async (movieInfo: MovieInfo) => {

        if (movieInfo.duration === '') {
            movieInfo.duration = null;
        }

        const response = await fetch('/api/v1/movie', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({ ...movieInfo, country: getValues().country?.value as string })

        })
        const movieResponse: MovieResponse = await response.json();
        uploadBlobs(movieResponse.id).then(async (response) => {
            if (!response.ok) {
                setFileError((await response.json())[0])
                return;
            }
            navigate(`/movie/${movieResponse.id}`)
        });
    })

    const updateMovie = handleSubmit(async (movieInfo: MovieInfo) => {
        if (movieInfo.duration === '') {
            movieInfo.duration = null;
        }

        const response = await fetch(`/api/v1/movies/${movieId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authenticate(),
            },
            body: JSON.stringify({ ...movieInfo, country: getValues().country?.value as string })

        })
        const movieResponse: MovieResponse = await response.json();
        if (files.length == 0) {
            deleteBlobs(movieResponse.id).then(() => navigate(`/movie/${movieResponse.id}`));
        } else {
            uploadBlobs(movieResponse.id).then(async (response) => {
                if (!response.ok) {
                    setFileError((await response.json())[0])
                    return;
                }
                navigate(`/movie/${movieResponse.id}`)
            });
        }
    });

    const uploadBlobs = async (entityId: string) => {
        const formData = new FormData();
        files.forEach((item: { file: string | Blob; }) => formData.append('files', item.file))
        var response = await fetch(`/api/v1/blobs/${entityId}`, {
            method: 'POST',
            body: formData,
            headers: {
                "Path": "/images/movies",
                "Entity-Name": "movies",
                "Authorization": authenticate(),
            }
        })

        return response;
    }

    const deleteBlobs = async (entityId: string) => {
        await fetch(`/api/v1/blobs/${entityId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": authenticate(),
                "Path": "/images/movies",
            }
        })
    }


    return (
        <div>
            <Form>
                <FormGroup>
                    <Label for="name" className="form-label-medium-size">
                        Name
                    </Label>
                    <Controller
                        name="name"
                        control={control as any}
                        rules={{ required: "Movie's name cannot be empty.", maxLength: { value: 100, message: "Movie's name cannot be longer than 100 characters." } }}
                        render={({ field }) => <Input invalid={!!errors.name}
                            {...field}
                            id={field.name}
                            name={field.name}
                            placeholder="Movie's name"
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
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="location.country" className="form-label-medium-size">
                                Country
                            </Label>
                            <Controller
                                name="country"
                                control={control as any}
                                rules={{ required: "Movie's country cannot be empty." }}
                                render={({ field }) => <AsyncSelect
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    loadOptions={loadFeatures}
                                    noOptionsMessage={() => 'Search for countries'}
                                    isClearable={true}
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderColor: !!errors?.country?.message ? '#dc3545' : '#cccccc',
                                        }),
                                        menu: (baseStyles) => ({
                                            ...baseStyles,
                                            zIndex: 2
                                        }),
                                    }}
                                    classNames={{
                                        control: (state) =>
                                            !!errors?.country?.message ? 'error-select' : '',
                                    }}


                                />}
                            />
                            <div className="error-message">{errors?.country?.message as any}</div>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="duration" className="form-label-medium-size">
                                Duration in minutes
                            </Label>
                            <Controller
                                name="duration"
                                control={control as any}
                                rules={{
                                    required: "Movie's duration cannot be empty.",
                                    min: {
                                        value: 1.0, message: "The minimum duration of a movie is 1 minute."
                                    },
                                    max: {
                                        value: 600.0, message: "The maximum duration of a movie is 600 minutes."
                                    }
                                }}
                                render={({ field }) => <Input invalid={!!errors?.duration}
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                />}
                            />
                            <FormFeedback>
                                {errors?.duration?.message}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="director" className="form-label-medium-size">
                                Director
                            </Label>
                            <Controller
                                name="director"
                                control={control as any}
                                render={({ field }) => <Input
                                    {...field}
                                    id={field.name}
                                    name={field.name}
                                    placeholder="Movie's director"
                                    type="text"

                                />}
                            />
                            <FormFeedback>
                                {errors?.name?.message}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    allowReorder={true}
                    maxFiles={1}
                    name="files"
                    allowImagePreview={true}
                />
                {fileError != '' && <span className="error-message">{fileError}</span>}

                <Button className="w-100 mt-30 mb-30 height-50" onClick={movieId === undefined ? createMovie : updateMovie}>
                    {movieId === undefined ? "Create" : "Save changes"}
                </Button>

            </Form>

        </div>
    )

}
export default MovieForm;