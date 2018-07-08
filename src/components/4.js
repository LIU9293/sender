import React from "react";
import { inject, observer } from "mobx-react";

const Transaction = tx => {
  const { name, hash, status } = tx.tx;
  let classname;
  switch (status) {
    case "mined":
      classname = "table-td_check-hash_done";
      break;
    case "error":
      classname = "table-td_check-hash_error";
      break;
    case "pending":
      classname = "table-td_check-hash_wait";
      break;
    default:
      classname = "table-td_check-hash_wait";
  }
  // const classname = status === 'mined' ? 'table-td_check-hash_done' : 'table-td_check-hash_wait'
  return (
    <div className="table-tr">
      <div className={`table-td table-td_check-hash ${classname}`}>
        TxHash:{" "}
        <a target="_blank" href={`${tx.explorerUrl}/tx/${hash}`}>
          {hash}
        </a>{" "}
        <br /> {name} <br /> Status: {status}
      </div>
    </div>
  );
};
@inject("UiStore")
@observer
export class FourthStep extends React.Component {
  constructor(props) {
    super(props);
    this.txStore = props.UiStore.txStore;
    this.tokenStore = props.UiStore.tokenStore;
    this.totalNumberTx = props.UiStore.tokenStore.totalNumberTx;
    console.log(this.totalNumberTx, "from store");
    this.explorerUrl = props.UiStore.web3Store.explorerUrl;
    this.state = {
      txCount: Number(this.totalNumberTx)
    };
  }
  componentDidMount() {
    this.txStore.doSend();
  }
  render() {
    let totalNumberOftx;

    if (
      Number(this.tokenStore.totalBalance) > Number(this.tokenStore.allowance)
    ) {
      totalNumberOftx = Number(this.totalNumberTx) + 1;
    } else {
      totalNumberOftx = Number(this.totalNumberTx);
    }

    const txHashes = this.txStore.txs.map((tx, index) => {
      return (
        <Transaction
          key={index}
          tx={{ ...tx }}
          explorerUrl={this.explorerUrl}
        />
      );
    });
    let status;
    if (this.txStore.txs.length === totalNumberOftx) {
      status = "全部交易已经被发送，请等待...";
    } else {
      const txCount = totalNumberOftx - this.txStore.txs.length;
      status = `请等待...  你需要用MetaMask签名 ${txCount} 笔交易`;
    }
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
            <p>{status}</p>
            <div className="table">{txHashes}</div>
            {/* <Link className="button button_next" to='/5'>Back to Home</Link> */}
          </form>
        </div>
      </div>
    );
  }
}
