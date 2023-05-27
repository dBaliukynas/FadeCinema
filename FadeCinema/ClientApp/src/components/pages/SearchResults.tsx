import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Card, Col, Row, Spinner } from 'reactstrap';
import { FileResponse } from './Movie';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get("type");
    const value = searchParams.get("value");
    const [searchResults, setSearchResults] = useState([]);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const [images, setImages] = useState<FileResponse[]>([]);

    const getSearchResults = async (page: number) => {
        var response = await fetch(`/api/v1/search-${type}?page=${0}&value=${value}`);
        if (response.ok) {
            const searchResults: [] = await response.json();

            setHasMore(response.headers.get('hasMore') === 'True' ? true : false);
            if (page == 0) {
                setSearchResults(searchResults);
            } else {
                setSearchResults((prevState) => [...prevState, ...searchResults]);
            }

        }
    }

    useEffect(() => {
        getSearchResults(0);
        if (type == "movies") {
            const getFiles = async () => {

                var response = await fetch('/api/v1/blobs/entities/movies');
                var fileResponseArray: FileResponse[] = await response.json();
                setImages(fileResponseArray)
            }
            getFiles();
        }

    }, [type, value])

    const pairs = searchResults.reduce<any[][]>((row, searchResultItem, index) => {
        if (index % 2 === 0) {
            row.push([searchResultItem]);
        } else {
            row[row.length - 1].push(searchResultItem);
        }
        return row;
    }, []);



    return (
        <div className="d-flex flex-column">
            <Breadcrumb className="ml-5">
                <BreadcrumbItem>
                    <Link to="/">
                        Home
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Search
                </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="display-1 uppercase">Search results for <strong>{type}</strong> </h1>
            <span className="display-6 uppercase">Searched for: <strong>{value}</strong></span>
            <span className="display-6 uppercase mb-100">Found: <strong>{searchResults.length}</strong> results</span>
            {searchResults.length == 0 && <span className="fst-italic">No results were found.</span>}
            <InfiniteScroll
                pageStart={0}
                loadMore={getSearchResults}
                hasMore={hasMore}
                loader={<Spinner className="large-spinner d-block ms-auto me-auto" key={0}></Spinner>}
            >
                {pairs.map((pair, pairIndex) => (
                    <Row key={pairIndex} className="mb-50">
                        {pair.map((searchResultItem, index) => (
                            <Col sm="6" key={searchResultItem.id}>

                                {type == "movies" ? <Card body tag={Link} to={`/${type?.slice(0, -1)}/${searchResultItem.id}`} className="shadowed-component zoom card-title align-items-center justify-content-center"
                                    style={
                                        {
                                            "height": "5em",
                                            "backgroundImage": `linear-gradient(169deg, rgba(0,0,0,0.7679446778711485) 0%, rgba(0,0,0,0) 100%), url(${images.find(image => image.entityId == searchResultItem.id)?.url})`,
                                            "backgroundSize": "cover",
                                            "color": "#ffffff",
                                        }
                                    }>
                                    <span className="text-shadowed">{searchResultItem.name}</span>
                                </Card> : <Card body tag={Link} to={`/${type?.slice(0, -1)}/${searchResultItem.id}`} className="border-colored-top colored-top-border-primary shadowed-component zoom card-title">
                                    {searchResultItem.name}
                                </Card>
                                }
                            </Col>
                        ))}
                    </Row>
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default SearchResults;