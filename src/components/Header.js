import React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";

@inject("UiStore")
@observer
export class Header extends React.Component {
  render() {
    const explorerUrl =
      this.props.UiStore.web3Store.explorerUrl || "https://etherscan.io";
    return (
      <header className="header">
        <div className="container">
          <div />
          <form className="form form_header">
            <label htmlFor="network" className="label">
              {"合约地址: "}
              <a
                target="_blank"
                href={`${explorerUrl}/address/${
                  process.env.REACT_APP_PROXY_MULTISENDER
                }`}
              >
                {process.env.REACT_APP_PROXY_MULTISENDER}
              </a>
            </label>
          </form>
        </div>
      </header>
    );
  }
}
