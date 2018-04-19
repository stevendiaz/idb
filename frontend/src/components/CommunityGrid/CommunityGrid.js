import React, { Component } from "react";
import { Container, Row } from "reactstrap";
import ReactPaginate from 'react-paginate';

import RSVideoCard from '../RSVideoCard/RSVideoCard';
import RSRedditCard from "../RSRedditCard/RSRedditCard";
import RSSearchHeader from "../RSSearchHeader/RSSearchHeader";
import RSSearchUtils from "../../utilities/RSSearchUtils";

export default class CommunityGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
            currentPage: 0,
            totalPages: 0,
            sorter: null,
        };

        this.ITEMS_PER_PAGE = 9;

        this.availableSorts = [
            {
                label: `Name (Ascending)`,
                value: RSSearchUtils.directionalSort(RSSearchUtils.sortTitle, true)
            },
            {
                label: `Name (Descending)`,
                value: RSSearchUtils.directionalSort(RSSearchUtils.sortTitle, false)
            },
            {
                label: `Type (Ascending)`,
                value: RSSearchUtils.directionalSort(RSSearchUtils.sortType, true)
            },
            {
                label: `Type (Descending)`,
                value: RSSearchUtils.directionalSort(RSSearchUtils.sortType, false)
            }
        ]
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_API_HOST}/videos`)
        .then(response => response.json())
        .then(response => {
              this.setState({
                    items: response.objects
              });
              return fetch(`${process.env.REACT_APP_API_HOST}/reddits`)
        })
        .then(response => response.json())
        .then(response => {

            let results = this.state.items.concat(response.objects);
            if (this.state.sorter) {
                results.sort(this.state.sorter.value);
            }

            this.setState({
                items: results,
                loaded: true,
                totalPages: Math.ceil(results.length / this.ITEMS_PER_PAGE)
            })
        });
    }

    itemsForCurrentPage() {

        let data = this.state.items.map((item) => {
            if (item.video_url) {
                return <RSVideoCard icon={item.icon}
                              id={item.id}
                              title={item.name}/>
            }
            return <RSRedditCard title={item.title}
                              url={item.url}/>
        });

        let page = this.state.currentPage;

        let numItems = this.ITEMS_PER_PAGE;
        let itemsLeft = Math.min(this.ITEMS_PER_PAGE, data.length - (page * this.ITEMS_PER_PAGE));

        let rows = [];
        let index = (page) * this.ITEMS_PER_PAGE;

        let numRows = Math.ceil(numItems / 4);

        for (let i = 0; i < numRows; i++) {
            let row = [];

            for(let j = 0; j < 4 && itemsLeft > 0; j++) {
                row.push(data[index++]);
                --itemsLeft;
            }

            rows.push(row);
        }

        return rows;
    }

    handlePageChanged(page) {
        this.setState({
            currentPage: page
        });
    }

    handleSort(sorter) {
        this.setState({sorter: sorter}, () => {
            if (sorter) {
                let temp = this.state.items;
                temp.sort(sorter.value);
                this.setState({items: temp});
            }
        });
    }

    getFilters() {
        return RSSearchUtils.getCommunityFilters();
    }

    searchWithFilters(filters) {
        let anded = {filters: filters.map((item) => item.value)};
        let stringified = JSON.stringify(anded);

        fetch(`${process.env.REACT_APP_API_HOST}/videos?q=${stringified}`)
            .then(response => response.json())
            .then(response => {
              this.setState({
                items: response.objects
              });
              return fetch(`${process.env.REACT_APP_API_HOST}/reddits?q=${stringified}`)
            })
            .then(response => response.json())
            .then(response => {

                let results = this.state.items.concat(response.objects);
                if (this.state.sorter) {
                    results.sort(this.state.sorter.value);
                }

                this.setState({
                    items: results,
                    loaded: true,
                    totalPages: Math.ceil(results.length / this.ITEMS_PER_PAGE),
                    currentPage: 0
                })
            });
    }

    render() {
        if (!this.state.loaded) {return <p>Loading</p>}

        return (
            <Container className="nav-padding">
                <Row><h1 className="mx-auto">Runescape Community Resources</h1></Row>
                <div className="nav-padding">
                <RSSearchHeader sort availableSorts={this.availableSorts} onSortChange={(sorter) => this.handleSort(sorter)}
                                filter availableFilters={this.getFilters()} onFilterChange={(filters) => this.searchWithFilters(filters)}/><hr/></div>
                <Row>
                    {  this.state.items.length > 0
                        ? (
                            <Row>
                                { this.itemsForCurrentPage() }
                            </Row>
                        ) : (
                        <Row>
                            <h4 className='mx-auto'>No results for selected filters</h4>
                        </Row>
                    ) }
                </Row>

                <Row>
                    <ReactPaginate
                       initialPage={0}
                       previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<button>...</button>}
                       breakClassName={"break-me"}
                       pageCount={this.state.totalPages}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={(data) => this.handlePageChanged(data.selected)}
                       containerClassName={"pagination mx-auto nav-padding"}
                       pageClassName={"page-item"}
                       pageLinkClassName={"page-link"}
                       activeClassName={"active"}
                       previousClassName={"page-item"}
                       nextClassName={"page-item"}
                       previousLinkClassName={"page-link"}
                       nextLinkClassName={"page-link"}
                        />
                </Row>
            </Container>
        );
    }
};
