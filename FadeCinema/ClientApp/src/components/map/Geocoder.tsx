import React, { useState } from 'react';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useControl } from 'react-map-gl';

type Props = {
    mapboxAccessToken: string
    setMapSearchResult: (result: any) => void;
}

const Geocoder = ({ mapboxAccessToken, setMapSearchResult }: Props) => {


    const geocoder = new MapboxGeocoder({
        accessToken: mapboxAccessToken,
        marker: false,
        collapsed: true,

    });

    useControl(() => geocoder);
    geocoder.on('result', (result: any) => {
        setMapSearchResult(result.result);
    })

    return <></>;
}

export default Geocoder;