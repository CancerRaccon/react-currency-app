import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Block from "./Block";

import CurrencyLayerClient from '../../node_modules/currencylayer-client';


class App extends Component {
  
  constructor() {
    super();
    this.apiConf = { apiKey: 'f97a26d510e99f6b4bde901830c7fc8a', free: false };
    this.client = new CurrencyLayerClient(this.apiConf);
    this.state = {
      source: '',
      currencies: {
        "EUR": "Euro",
        "CHF": "Swiss Franc",
        "USD": "United States Dollar"
      },
      quotes: {},
      from: 'EUR',
      to: '',
      format: 1,
      amount: 1,
      isCollapsed: false
    };
    this.history = {};
    this.history = {};
    this.history.dates = this.getLastMonth();
    this.history.values = {};

    this.onInputValueChanged = this.onInputValueChanged.bind(this);
    this.onRadioInputChange = this.onRadioInputChange.bind(this);
    this.onCheckedChange = this.onCheckedChange.bind(this);

    this.fetchLiveRates(this.state.currencies);
    this.fetchHistoryRates(this.state.currencies);
  }

  /**
  * 
  */
  fetchLiveRates(newCurrencies) {

    if (newCurrencies === undefined) {
      newCurrencies = this.state.currencies;
    }

    let currencies = Object.keys(newCurrencies).join(',');
    this.client.live({ currencies: currencies, source: this.state.from }).then((response) => {

      this.setState({
        quotes: response.quotes,
        currencies: newCurrencies
      });

    }).catch(err => {
      console.log(err.code)
      console.log(err.message)
    });

  }

  fetchHistoryRates(newCurrencies) {

    let currencies = Object.keys(newCurrencies).join(',');
    let month = this.history.dates;
    let values = this.history.values;

    month.map((date) => {
      this.client.historical({ date: date, currencies: currencies, source: this.state.from }).then((response) => {
        values[response.date] = response.quotes;

        if(Object.keys(values).length === 30) {
          console.log(values)
        }
      });
    });

  }

  componentDidMount() {
    this.fetchLiveRates(this.state.currencies);
  }

  componentDidUpdate(prevProps, prevState) {

    var shouldFetchRates = false;

    Object.keys(prevState).map((key) => {

      if (key === 'from') {
        let prevField = JSON.stringify(prevState[key]);
        let currentStateField = JSON.stringify(this.state[key]);
        if (prevField !== currentStateField) {
          shouldFetchRates = true;
          return false;
        }
      }
      return;
    });

    if (shouldFetchRates === true) {
      this.fetchLiveRates(this.state.currencies);
    }
  }

  convertCurrency(currencyRates, desiredCurrency, amount) {
    let currentCurrency = "USD";
    let currentRate = currencyRates[currentCurrency];
    let desiredRate = currencyRates[desiredCurrency];

    let USDAmount = amount * currentRate;
    let convertedAmount = USDAmount / desiredRate;

    return convertedAmount;
  }

  onInputValueChanged(event) {
    this.setState({
      amount: event.currentTarget.value
    });
  }

  onRadioInputChange(event) {
    this.setState({
      from: event.currentTarget.value
    });
  }

  onCheckedChange(event) {
    this.setState({
      isCollapsed: event.currentTarget.checked
    });
  }

  formatDate(date){
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(dd<10) {dd='0'+dd}
    if(mm<10) {mm='0'+mm}
    date = yyyy + '-' + mm + '-' + dd;
    return date
 }

  getLastMonth() {
    var result = [];
    for (var i=0; i<30; i = i+5) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push(this.formatDate(d));
    }
    return result;
  }

  render() {

    const quotes = this.state.quotes;
    const currencies = this.state.currencies;
    const amount = this.state.amount;
    const from = this.state.from;
    const isCollapsed = this.state.isCollapsed;
    const onInputValueChanged = this.onInputValueChanged;
    const onRadioInputChange = this.onRadioInputChange;
    const onCheckedChange = this.onCheckedChange;

    return (
      <div>
        <Header />
        <div className="main-content-wrapper">
        <Block quotes={quotes} currencies={currencies} amount={amount} from={from} onRadioInputChange={onRadioInputChange} onInputValueChanged={onInputValueChanged} />
        <Block values={this.history.values} dates={this.history.dates} from={from} onInputValueChanged={onInputValueChanged} onCheckedChange={onCheckedChange} isCollapsed={isCollapsed} isHistory={true} />
        </div>
        <Footer />
      </div>
    );
  }
}


export default App;