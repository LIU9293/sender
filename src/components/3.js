import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view'
import { inject, observer } from "mobx-react";
import BN from 'bignumber.js'
import swal from 'sweetalert';
import Select from 'react-select';

@inject("UiStore")
@observer
export class ThirdStep extends React.Component {
  constructor(props){
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
    this.gasPriceStore = props.UiStore.gasPriceStore;
    console.log(this.gasPriceStore.gasPricesArray)
    this.onNext = this.onNext.bind(this)
    this.state = {
      gasPrice: ''
    }
  }
  componentDidMount() {
    if(this.tokenStore.dublicates.length > 0){

      swal({
        title: `There were duplicated eth addresses in your list.`,
        text: `${JSON.stringify(this.tokenStore.dublicates.slice(), null, '\n')}.\n Multisender already combined the balances for those addreses. Please make sure it did the calculation correctly.`,
        icon: "warning",
      })
    }
  }
  onNext(e) {
    e.preventDefault();
    if (new BN(this.tokenStore.totalBalance).gt(new BN(this.tokenStore.defAccTokenBalance))){
      console.error('Your balance is more than total to send')
      swal({
        title: "Insufficient token balance",
        text: `You don't have enough tokens to send to all addresses.\nAmount needed: ${this.tokenStore.totalBalance} ${this.tokenStore.tokenSymbol}`,
        icon: "error",
      })
      return
    }
    if( new BN(this.tokenStore.totalCostInEth).gt(new BN(this.tokenStore.ethBalance))){
      console.error('please fund you account in ')
      swal({
        title: "Insufficient ETH balance",
        text: `You don't have enough ETH to send to all addresses. Amount needed: ${this.tokenStore.totalCostInEth} ETH`,
        icon: "error",
      })
      return
    }
    this.props.history.push('/4')
  }

  onGasPriceChange = (selected) => {
    if(selected){
      this.gasPriceStore.setSelectedGasPrice(selected.value)
    }
  }
  render() {
    return (
      <div className="container container_bg">
        <div className="content">
        <h1 className="title">
            <strong>欢迎使用智能合约批量发送工具</strong>
          </h1>         
          <p className="description">
            请输入你需要转的Token的合约地址，和你想转入的地址列表，可以是JSON或者CVS{" "}
            <br />
            此Dapp支持以太坊主网和Ropsten Testnet <br />
          </p>
          <form className="form">
            <ReactJson displayDataTypes={false}
              style={{backgroundColor: 'none'}}
              indentWidth="2"
              iconStyle="square"
              name={false}
              theme="solarized"
              src={this.tokenStore.jsonAddresses.slice()} />
              <div style={{padding: "25px 0px"}}>
                <p>Gas Price</p>
                <Select.Creatable
                  isLoading={this.gasPriceStore.loading}
                  value={this.gasPriceStore.selectedGasPrice}
                  onChange={this.onGasPriceChange}
                  loadingPlaceholder="Fetching gas Price data ..."
                  placeholder="Please select desired network speed"
                  options={this.gasPriceStore.gasPricesArray.slice()}
                />
              </div>
            <div className="send-info">
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>一共要发出的Token数量</p>
                  <p className="send-info-amount">{this.tokenStore.totalBalance} {this.tokenStore.tokenSymbol}</p>
                </div>
                <div className="send-info-i">
                  <p>你当前的Token余额</p>
                  <p className="send-info-amount">{this.tokenStore.defAccTokenBalance} {this.tokenStore.tokenSymbol}</p>
                </div>
                <div className="send-info-i">
                  <p>当前ETH余额</p>
                  <p className="send-info-amount">{this.tokenStore.ethBalance}</p>
                </div>
                <div className="send-info-i">
                  <p>智能合约执行费</p>
                  <p className="send-info-amount">{this.tokenStore.currentFee} ETH</p>
                </div>
              </div>
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>总共要发出的地址数</p>
                  <p className="send-info-amount">{this.tokenStore.jsonAddresses.length}</p>
                </div>
                {/* <div className="send-info-i">
                  <p>Current Allowance</p>
                  <p className="send-info-amount">{this.tokenStore.allowance} {this.tokenStore.tokenSymbol}</p>
                </div> */}
                <div className="send-info-i">
                  <p>一共需要多少笔智能合约交易</p>
                  <p className="send-info-amount">{this.tokenStore.totalNumberTx}</p>
                </div>
                <div className="send-info-i">
                  <p>大约需要的ETH总额</p>
                  <p className="send-info-amount">
                  {this.tokenStore.totalCostInEth} ETH        
                  </p>
                </div>
                <div className="send-info-i">
                  <p>Selected Network speed (Gas Price)</p>
                  <p className="send-info-amount">
                  {this.gasPriceStore.selectedGasPrice} gwei
                  </p>
                </div>
              </div>
            </div>
            
            <Link onClick={this.onNext} className="button button_next" to='/4'>Next</Link>
          </form>
        </div>
      </div>
    );
  }
}