import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from "./Table";

class Block extends Component {

    constructor(props) {
        super(props);
    }

    generateRadioButtons() {

        return !this.props.currencies ? null : Object.keys(this.props.currencies).map((key) => {
            return (
                <div className="divButtonWrapper">
                    <input type="radio" name={key} value={key} checked={this.props.from === key} onChange={this.props.onRadioInputChange} />
                    <label htmlFor={key}>&nbsp;{key}&nbsp;</label>
                </div>
            )
        });

    }

    fixData(values) {
        var data = [];

        Object.keys(values).map((key) => {
            let obj = {};
            obj['name'] = key;
            obj[this.props.from + "USD"] = values[key][this.props.from + "USD"];
            obj[this.props.from + "EUR"] = values[key][this.props.from + "EUR"];
            obj[this.props.from + "CHF"] = values[key][this.props.from + "CHF"];

            data.push(obj);
        });

        return data;
    }

    getChart() {
        const data = this.fixData(this.props.values);
        return (
            <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Line type="monotone" dataKey={this.props.from + "EUR"} stroke="#8884d8" />
                <Line type="monotone" dataKey={this.props.from + "USD"} stroke="#82ca9d" />
                <Line type="monotone" dataKey={this.props.from + "CHF"} stroke="#f00e0e" />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
            </LineChart>
        );
    }

    renderHistoryBlock() {

        return (

            <div className="block historyBlock">
                <h1>History</h1>
                <FormControlLabel
                    control={<Switch checked={this.props.isCollapsed} onChange={this.props.onCheckedChange} />}
                    label="Show"
                />
                <Collapse in={this.props.isCollapsed}>

                {this.getChart()}

                </Collapse>
            </div>

        );
    }

    renderCurrencyTableBlock() {

        return (
            <div className="block currency-table-block">
                <h1>Currency</h1>
                {this.generateRadioButtons()}
                <input value={this.props.amount} onChange={this.props.onInputValueChanged} className="amount" placeholder="Enter an amount."></input>
                <Table
                    quotes={this.props.quotes}
                    amount={this.props.amount}
                    from={this.props.from}
                    currencies={this.props.currencies}
                />
            </div>

        );
    }

    render() {

        if (this.props.isHistory) {
            return this.renderHistoryBlock();
        }
        else {
            return this.renderCurrencyTableBlock();
        }

    }
}

export default Block;