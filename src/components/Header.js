import React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("UiStore")
@observer
export class Header extends React.Component {
  render() {
    const explorerUrl =
      this.props.UiStore.web3Store.explorerUrl || "https://etherscan.io";
    const contractAddress = this.props.UiStore.web3Store.contractAddress || '';
    return (
      <header className="header">
        <div className="container">
          <div>
            <a href='/'>
             <img src='/icon.png' style={{ height: '42px' }} />
            </a>
          </div>
          <form className="form form_header">
            <label htmlFor="network" className="label">
              {"合约地址: "}
              <a
                target="_blank"
                href={`${explorerUrl}/address/${contractAddress}`}
              >
                {contractAddress}
              </a>
            </label>
          </form>
        </div>
      </header>
    );
  }
}
