import React, { Component } from 'react';

class Table extends Component {

    constructor(props) {
        super(props);
    }

    isNumber(n) {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0)
    }

    roundNumber(num, scale) {
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale) + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }

    render() {

        var quotes = this.props.quotes;
        var amount = this.props.amount;
        if (!this.isNumber(amount)) {
            amount = 1;
        }
        var from = this.props.from;
        var currencies = this.props.currencies;
        var tableItems = !currencies ? null : Object.keys(currencies).map((key) => {
            let tmp = from + key;
            if (!this.isNumber(quotes[tmp])) {
                return;
            }
            return (
                <tr key={key}>
                    <td>{key + ' - ' + currencies[key]}</td>
                    <td>{this.roundNumber(amount * quotes[tmp], 3)}</td>
                </tr>
            )
        });

        return (
            <div>
                <div className="divTableWrapper">
                    <table>
                        <tbody>
                            <tr>
                                <th>Currency</th>
                                <th>Value</th>
                            </tr>
                            {tableItems}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Table;