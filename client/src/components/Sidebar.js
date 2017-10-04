/**
 * @author lusinabrian on 04/10/17.
 * @notes:
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Intro from './Intro';
import Vendor from './Vendor';

export default class Sidebar extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            results: [],
            query: "",
            firstLoad: true
        };

        this.fetchResults = this.fetchResults.bind(this);
        this.generateGeoJSON = this.generateGeoJSON.bind(this);
        this.plotOnMap = this.plotOnMap.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleHover = this.handleHover.bind(this);
    }

    fetchResults() {
        let results = [], query = this.state.query;
        request
            .get('/search?q=' +  query)
            .end(function(err, res) {
                if (err) {
                    alert("error in fetching response");
                }
                else {
                    this.setState({
                        results: res.body,
                        firstLoad: false
                    });
                    this.plotOnMap();
                }
            }.bind(this));
    }

    generateGeoJSON(markers) {
        return {
            "type": "FeatureCollection",
            "features": markers.map(function(p) {
                return {
                    "type": "Feature",
                    "properties": {
                        "name": p.name,
                        "hours": p.hours,
                        "address": p.address,
                        "point-color": "253,237,57,1"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [parseFloat(p.location.longitude),
                            parseFloat(p.location.latitude)]
                    }
                }
            })
        }
    }

    plotOnMap(vendor) {
        let map = this.props.map;
        let results = this.state.results;
        let markers = [].concat.apply([], results.trucks.map(t =>
            t.branches.map(function(b) {
                return {
                    location: b.location,
                    name: t.name,
                    schedule: b.schedule,
                    hours: b.hours,
                    address: b.address
                }
            })));
        let highlightMarkers, usualMarkers, usualgeoJSON, highlightgeoJSON;

        if (vendor) {
            highlightMarkers = markers.filter(m => m.name.toLowerCase() === vendor.toLowerCase());
            usualMarkers = markers.filter(m => m.name.toLowerCase() !== vendor.toLowerCase());
        } else {
            usualMarkers = markers;
        }

        usualgeoJSON = this.generateGeoJSON(usualMarkers);
        if (highlightMarkers) {
            highlightgeoJSON = this.generateGeoJSON(highlightMarkers);
        }

        // clearing layers
        if (map.getLayer("trucks")) {
            map.removeLayer("trucks");
        }
        if (map.getSource("trucks")) {
            map.removeSource("trucks");
        }
        if (map.getLayer("trucks-highlight")) {
            map.removeLayer("trucks-highlight");
        }
        if (map.getSource("trucks-highlight")) {
            map.removeSource("trucks-highlight");
        }

        map.addSource("trucks", {
            "type": "geojson",
            "data": usualgeoJSON
        }).addLayer({
            "id": "trucks",
            "type": "circle",
            "interactive": true,
            "source": "trucks",
            "paint": {
                'circle-radius': 8,
                'circle-color': 'rgba(253,237,57,1)'
            },
        });

        if (highlightMarkers) {
            map.addSource("trucks-highlight", {
                "type": "geojson",
                "data": highlightgeoJSON
            }).addLayer({
                "id": "trucks-highlight",
                "type": "circle",
                "interactive": true,
                "source": "trucks-highlight",
                "paint": {
                    'circle-radius': 8,
                    'circle-color': 'rgba(164,65,99,1)'
                },
            });
        }
    }

    handleSearch(e) {
        e.preventDefault();
        this.fetchResults();
    }

    onChange(e) {
        this.setState({query: e.target.value});
    }

    handleHover(vendorName) {
        console.log("here");
        this.plotOnMap(vendorName);
    }

    render() {
        if (this.state.firstLoad) {
            return (
                <div>
                    <div id="search-area">
                        <form onSubmit={this.handleSearch}>
                            <input type="text" value={query} onChange={this.onChange}
                                   placeholder="Burgers, Tacos or Wraps?"/>
                            <button>Search!</button>
                        </form>
                    </div>
                    <Intro/>
                </div>
            );
        }
        let query = this.state.query;
        let resultsCount = this.state.results.hits || 0;
        let locationsCount = this.state.results.locations || 0;
        let results = this.state.results.trucks || [];
        let renderedResults = results.map((r, i) =>
            <Vendor key={i} data={r} handleHover={this.handleHover} />
        );

        return (
            <div>
                <div id="search-area">
                    <form onSubmit={this.handleSearch}>
                        <input type="text" value={query} onChange={this.onChange}
                               placeholder="Burgers, Tacos or Wraps?"/>
                        <button>Search!</button>
                    </form>
                </div>
                { resultsCount > 0 ?
                    <div id="results-area">
                        <h5>Found <span className="highlight">{ resultsCount }</span> vendors
                            in <span className='highlight'>{ locationsCount}</span> different locations</h5>
                        <ul> { renderedResults } </ul>
                    </div>
                    : null}
            </div>
        );
    }
}

Sidebar.propTypes = {
    map: PropTypes.object.isRequired
};
