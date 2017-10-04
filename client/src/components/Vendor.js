/**
 * @author lusinabrian on 04/10/17.
 * @notes:
 */

import React, {Component} from 'react';
import PropTypes from "prop-types";

export default class Vendor extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isExpanded: false
        };

        this.formatFoodItems = this.formatFoodItems.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    formatFoodItems(items) {
        if (this.state.isExpanded) {
            return items.join(", ");
        }

        let s = items.join(", ").substr(0, 80);
        if (s.length > 70) {
            let indexOfLastSpace = s.split('').reverse().join('').indexOf(",") + 1;
            return s.substr(0, 80 - indexOfLastSpace) + " & more...";
        } else {
            return s;
        }
    }

    toggleExpand() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    render() {
        let r = this.props.data;
        return (
            <li onMouseEnter={this.props.handleHover.bind(null, r.name)} onClick={this.toggleExpand}>
                <p className="truck-name">{r.name}</p>
                <div className="row">
                    <div className="icons">
                        <i className="ion-android-pin"></i>
                    </div>
                    <div className="content"> {r.branches.length} locations</div>
                </div>
                {r.drinks ?
                    <div className="row">
                        <div className="icons">
                            <i className="ion-wineglass"></i>
                        </div>
                        <div className="content">Serves Cold Drinks</div>
                    </div>
                    : null}
                <div className="row">
                    <div className="icons">
                        <i className="ion-fork"></i>
                        <i className="ion-spoon"></i>
                    </div>
                    <div className="content">Serves {this.formatFoodItems(r.fooditems)}</div>
                </div>
            </li>
        )
    }
}

Vendor.propTypes = {}