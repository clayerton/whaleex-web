import { Toast } from "antd-mobile";

class WalScatter {
  constructor() {}
  async initialize(walScatter) {
    this.network = {
      blockchain: "eos",
      protocol: "https",
      host: "eosnode.whaleex.com", //["eosnode.whaleex.com", "nodes.get-scatter.com"],
      port: 443,
      chainId:
        "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
    };
    // this.network = {
    //   blockchain: "eos",
    //   protocol: "https",
    //   host: "eosnode.whaleex.com",
    //   port: 443,
    //   chainId:
    //     "c0e5d4573873b00e93c12b76f98168b8e72db3177b27892a2c17921f29a0da66",
    // };
    this.walScatter = walScatter;
  }
  getValue = () => {
    const { eos, account = {}, publicKey } = this;
    return {
      eos,
      account,
      publicKey,
    };
  };
  setValue = obj => {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key];
    });
  };
  scatterConnect = () => {
    const connectionOptions = { initTimeout: 1000 };
    U.logIt([
      "submitDelegate-error-scatterGetValue",
      JSON.stringify({ connectionOptions }),
      "---end---",
    ]);
    return new Promise(async reslove => {
      const connected = await this.walScatter.connect(
        "WhaleEx",
        connectionOptions
      );
      U.logIt([
        "submitDelegate-error-scatterGetValue-0",
        JSON.stringify({ connected }),
        "---end---",
      ]);
      reslove(connected);
    });
  };

  oldUserBind = (params, callBack) => {
    const { walAccount } = params;
    console.log(walAccount);
    //(isSuccess)=>{}
    const { eos, account, publicKey } = this;
    const authorization = [`${account.name}@${account.authority}`];
    const transaction = { user: account.name, pub_key: publicKey };
    console.log(transaction, authorization);
    eos
      .transaction([walAccount || "whaleextrust"], contracts => {
        contracts[walAccount || "whaleextrust"].bind(transaction, {
          authorization,
        });
      })
      .then(e => {
        callBack && callBack(true, e);
        console.log("res", e);
      })
      .catch(e => {
        callBack && callBack(false, e);
        console.log("er", e);
      });
  };
  scatterGetIdentity = async callBack => {
    let connected = await this.scatterConnect();
    U.logIt([
      "submitDelegate-error-scatterGetValue-1",
      JSON.stringify({ connected }),
      "---end---",
    ]);
    if (!connected) {
      // User does not have Scatter installed/unlocked.
      return new Promise(reslove => {
        setTimeout(async () => {
          U.logIt([
            "submitDelegate-error-scatterGetValue-retry",
            JSON.stringify({ connected }),
            "---end---",
          ]);
          let r = await this.scatterGetIdentity(callBack);
          reslove(r);
        }, 1000);
      });
    }
    const requiredFields = { accounts: [this.network] };
    return new Promise((reslove, reject) => {
      ScatterJS.scatter
        .getIdentity(requiredFields)
        .then(async accountInfo => {
          console.log(accountInfo);
          U.logIt([
            "submitDelegate-error-scatterGetValue-2",
            JSON.stringify({ accountInfo }),
            "---end---",
          ]);
          // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
          // the user for their account name beforehand. They could still give you a different account.
          //scatter.identity
          const account = accountInfo.accounts.find(
            x => x.blockchain === "eos"
          );
          // scatter.getPublicKey("eos").then(pk => {
          //   console.log("getPublicKey", pk);
          // });
          // You can pass in any additional options you want into the eosjs reference.
          const eosOptions = { expireInSeconds: 60 };
          // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
          const eos = ScatterJS.scatter.eos(this.network, Eos, eosOptions);
          const publicKey =
            _.get(accountInfo, "accounts[0].publicKey") ||
            accountInfo.publicKey;
          console.log("publicKey", publicKey);
          // ----------------------------
          // Now that we have an identity,
          // an EOSIO account, and a reference
          // to an eosjs object we can send a transaction.
          // ----------------------------
          // Never assume the account's permission/authority. Always take it from the returned account.
          this.setValue({
            eos,
            account,
            publicKey,
          });
          reslove();
        })
        .catch(error => {
          // alert(JSON.stringify(error));
          // The user rejected this request, or doesn't have the appropriate requirements.
          console.log(error);
          reject(error);
        });
    });
  };
  scatterAuthenticate = async authenticateData => {
    const connected = await this.scatterConnect();
    if (!connected) {
      // User does not have Scatter installed/unlocked.
      return false;
    }
    return ScatterJS.scatter.authenticate(authenticateData);
    // ScatterJS.scatter
    //   .authenticate(authenticateData)
    //   .then(signedOrigin => {
    //     alert("signedOrigin" + signedOrigin);
    //     //...
    //   })
    //   .catch(failedAuthentication => {
    //     alert("failedAuthentication" + failedAuthentication);
    //     // ...
    //   });
  };
  scatterSignData = async (_data, whatfor, isHash) => {
    const publicKey = this.publicKey; // The key you want a signature for
    const data = _data; // Anything, or a hash ( sha256 )
    // const whatfor = "whaleex login"; // The reason you are requesting a signature from a user.
    // const isHash = false; // Only set to true if the `data` is a hash, as it requires a different signing method.
    U.logIt([
      "submitDelegate-error-signOrder-00",
      JSON.stringify({ data, publicKey, whatfor, isHash }),
      "---end---",
    ]);
    return ScatterJS.scatter.getArbitrarySignature(
      publicKey,
      data,
      whatfor,
      !!isHash
    );
    // ScatterJS.scatter
    //   .getArbitrarySignature(publicKey, data, whatfor, isHash)
    //   .then(signature => {
    //     console.log("----signature", signature);
    //   })
    //   .catch(error => {
    //     console.log("----error", error);
    //   });
  };
  scatterGetPk = async () => {
    const { publicKey } = this;
    // alert(publicKey);
  };
  catchError = (error, formatMessage) => {
    console.log("error", error);
    // {
    // "code":500,
    // "message":"Internal Service Error",
    // "error":{
    //        "code":3010010,
    //        "name":"packed_transaction_type_exception",
    //        "what":"Invalid packed transaction",
    //        "details":[],
    // }
    //EOSToken 错误返回兼容 用户取消返回的错误不做提示
    U.logIt([
      "submitDelegate-error-deposit-catchERROR",
      JSON.stringify(error),
      "---end---",
    ]);
    if (
      _.get(error, "error.what", _.get(error, "what")) ===
      "Invalid packed transaction"
    ) {
      Toast.hide();
      return;
    }
    if (error.type === "signature_rejected") {
      Toast.hide();
      return;
    }
    let errors = ["tx_cpu_usage_exceeded"];
    console.log(JSON.stringify(error));
    let _error = {};
    try {
      _error = JSON.parse(_.get(error, "message", error));
    } catch (e) {
      _error = {};
    }
    let errorStr = _.get(_error, "error.name", "");
    const scatterrrorMsg = _.get(_error, "error.details[0].message", "");
    if (errors.includes(errorStr)) {
      let msg = formatMessage({
        id: `error.${_.get(_error, "error.name")}`,
      });
      Toast.fail(msg, 3);
    } else {
      if (scatterrrorMsg.includes("overdrawn balance")) {
        Toast.fail(formatMessage({ id: "error.overdrawn_balance" }), 3);
      } else if (scatterrrorMsg.includes("unable to find key")) {
        Toast.fail(formatMessage({ id: "error.unable_to_find_key" }), 3);
      } else if (
        scatterrrorMsg.toLowerCase().includes("no balance object found")
      ) {
        Toast.fail(formatMessage({ id: "error.no_balance_object_found" }), 3);
      } else if (scatterrrorMsg.toLowerCase().includes("unable to find key")) {
        Toast.fail(formatMessage({ id: "error.unable_to_find_key" }), 3);
      } else if (
        scatterrrorMsg.toLowerCase().includes("name not properly normalized")
      ) {
        Toast.fail(formatMessage({ id: "error.unable_to_find_key" }), 3);
      } else if (
        scatterrrorMsg.includes(
          "the transaction was unable to complete by deadline"
        )
      ) {
        Toast.fail(formatMessage({ id: "error.unable_complete_deadline" }), 3);
      } else {
        Toast.fail(scatterrrorMsg, 3);
      }
    }
  };
  multiply = (m, n, decimal, isPay) => {
    let result = math.eval(`${m} * ${n} * ${Math.pow(10, decimal)}`);
    let r;
    if (isPay) {
      r = String(Math.ceil(result));
    }
    r = String(result).split(".")[0];
    let tmp = +math.eval(`${r} / ${Math.pow(10, decimal)}`);
    return tmp.toFixed(decimal);
  };
  doTransaction = async (contract, transaction, formatMessage) => {
    Toast.loading(formatMessage({ id: "common.ordering" }), 10);
    const { eos, account, network } = this;
    const authorization = [`${account.name}@${account.authority}`];

    U.logIt([
      "submitDelegate-error-depositr-10",
      JSON.stringify({ waitTransaction: true, contract, transaction }),
      "---end---",
    ]);
    return new Promise((reslove, reject) => {
      eos
        .transaction([contract], contracts => {
          console.log(contracts, contract, transaction);
          U.logIt([
            "submitDelegate-error-depositr-100",
            JSON.stringify({ contracts, contract, transaction }),
            "---end---",
          ]);
          let _contract =
            contracts[contract] ||
            _.get(contracts, contract) ||
            _.get(contracts, contract.replace(/\./g, "_"));
          let EtWalletCode = _contract.transfer(transaction, {
            authorization,
          });
          if (!!EtWalletCode) {
            //用于EosToken的兼容
            EtWalletCode.then(e => {
              U.logIt([
                "submitDelegate-error-depositr-444",
                JSON.stringify(e),
                "---end---",
              ]);
              reslove();
              Toast.hide();
            }).catch(error => {
              this.catchError(error, formatMessage);
            });
          }
        })
        .then(e => {
          U.logIt([
            "submitDelegate-error-depositr-999",
            JSON.stringify(e),
            "---end---",
          ]);
          reslove();
        })
        .catch(error => {
          this.catchError(error, formatMessage);
        });
    });
  };
  scatterTransfer = ({ to, num, tokenDetails }, callBack, formatMessage) => {
    Toast.loading(formatMessage({ id: "common.transfering" }), 10);
    const { eos, account, network } = this;
    const { memo, decimals, symbol, contract } = tokenDetails;
    const transaction = { from: account.name, to, quantity: num, memo };
    const authorization = [`${account.name}@${account.authority}`];
    U.logIt([
      "submitDelegate-error-depositr-99",
      JSON.stringify({ account, tokenDetails, to, num, authorization }),
      "---end---",
    ]);
    eos
      .transaction([contract], contracts => {
        console.log(contracts, contract);
        U.logIt([
          "submitDelegate-error-depositr-100",
          JSON.stringify({ contracts, contract }),
          "---end---",
        ]);
        let _contract =
          contracts[contract] ||
          _.get(contracts, contract) ||
          _.get(contracts, contract.replace(/\./g, "_"));
        let EtWalletCode = _contract.transfer(transaction, {
          authorization,
        });
        if (!!EtWalletCode) {
          //用于EosToken的兼容
          EtWalletCode.then(e => {
            U.logIt([
              "submitDelegate-error-depositr-444",
              JSON.stringify(e),
              "---end---",
            ]);
            Toast.hide();
            callBack && callBack();
          }).catch(error => {
            this.catchError(error, formatMessage);
          });
        }
      })
      .then(e => {
        U.logIt([
          "submitDelegate-error-depositr-999",
          JSON.stringify(e),
          "---end---",
        ]);
        Toast.hide();
        callBack && callBack();
      })
      .catch(error => {
        this.catchError(error, formatMessage);
      });
    // this.walScatter
    //   .requestTransfer(network, to, num, tokenDetails)
    //   .then(result => {
    //     console.log("result", result);
    //   });
    // eos
    //   .transfer(account.name, to, num, memo, transactionOptions)
    //   .then(trx => {
    //     // alert("trx" + JSON.stringify(trx));
    //     // That's it!
    //     callBack && callBack();
    //     Toast.hide();
    //     // Toast.success(formatMessage({ id: "common.transferSuccess" }), 2);
    //   })
    //   .catch(error => {
    //     if (error.type === "signature_rejected") {
    //       Toast.hide();
    //       return;
    //     }
    //     let errors = ["tx_cpu_usage_exceeded"];
    //     console.log(JSON.stringify(error));
    //     let _error = JSON.parse(error);
    //     let errorStr = _.get(_error, "error.name");
    //     Toast.hide();
    //     const scatterrrorMsg = _.get(_error, "error.details[0].message");
    //     if (errors.includes(errorStr)) {
    //       let msg = formatMessage({
    //         id: `error.${_.get(_error, "error.name")}`
    //       });
    //       Toast.fail(msg, 3);
    //     } else {
    //       if (scatterrrorMsg.includes("overdrawn balance")) {
    //         Toast.fail(formatMessage({ id: "error.overdrawn_balance" }), 3);
    //       } else if (scatterrrorMsg.includes("unable to find key")) {
    //         Toast.fail(formatMessage({ id: "error.unable_to_find_key" }), 3);
    //       } else if (
    //         scatterrrorMsg.toLowerCase().includes("invalid packed transaction")
    //       ) {
    //       } else {
    //         Toast.fail(scatterrrorMsg, 3);
    //       }
    //     }
    //   });
  };
  scatterCreateOrder = () => {};
}
export default new WalScatter();
