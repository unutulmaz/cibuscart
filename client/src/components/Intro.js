import React from "react";

/**
 * Intro2 stateless component
 */
const Intro = () => {
    return (
        <div>
            <h3>About</h3>
            <p>The app is built with Flask on the backend and Elasticsearch is the engine powering the search.</p>
            <p>The frontend is hand-crafted with React and the beautiful maps are courtesy of Mapbox.</p>
            <p>Lastly, the data for the food trucks is made available in public domain by <a
                href="https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat">CibusCart</a>
            </p>
        </div>
    );
};

export default Intro;