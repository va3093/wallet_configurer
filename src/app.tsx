import React from "react";
import networks, { NetworkConfig } from "./networks";
import "../styles/home.css";
import { FaInfo } from "react-icons/fa";
import cn from "classnames";

import { ethers } from "ethers";
import Web3Modal, { getInjectedProvider, getInjectedProviderName, getProviderInfo, Provider } from "web3modal";
import { Web3Provider } from "@ethersproject/providers";

const ethereum = window.ethereum;

async function connectWallet(): Promise<Web3Provider> {
  const providerOptions = {};

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
  });

  const instance = await web3Modal.connect();

  const provider = new ethers.providers.Web3Provider(instance);
  return provider;
}

async function addNetwork(config: NetworkConfig) {
  await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{ ...config, chainId: `0x${config.chainId.toString(16)}` }],
  });
}

async function getCachedProvider(): Promise<Web3Provider> | undefined {
  if (typeof window.ethereum !== "undefined") {
    let instance = window.ethereum;
    const provider = new ethers.providers.Web3Provider(instance);
    if ((await provider.listAccounts()).length > 0) {
      return provider;
    }
  }
  return;
}

interface Wallet {
  address?: string;
  isConnecting: boolean;
  connect: () => void;
}

function useGetWallet(): Wallet {
  const [address, setAddress] = React.useState<string | undefined>();
  const [provider, setProvider] = React.useState<Web3Provider | undefined>();
  const getCachedAddress = async () => {
    const provider = await getCachedProvider();
    if (provider) {
      setProvider(provider);
      const signer = provider.getSigner();
      setAddress(await signer.getAddress());
    }
  };

  const connect = async () => {
    const provider = await connectWallet();
    setProvider(provider);
    const signer = provider.getSigner();
    console.log(signer);
    setAddress(await signer.getAddress());
  };

  React.useEffect(() => {
    getCachedAddress();
    return () => {};
  }, []);

  React.useEffect(() => {
    // Subscribe to provider disconnection
    if (provider) {
      provider.on("disconnect", (error: { code: number; message: string }) => {
        setAddress(undefined);
      });
    }
  }, [provider]);
  return { address, isConnecting: false, connect };
}

const NetworkButtonRow: React.FC<{ network: NetworkConfig }> = ({ network }) => {
  return (
    <>
      <div className={cn("networkButtonRow")}>
        <a
          className="networkButton"
          onClick={(e) => {
            e.preventDefault();
            addNetwork(network);
          }}
        >
          <img className="logo" src={network.iconUrls[0]}></img>
          {`Add ${network.chainName}`}
        </a>
        {/* <FaInfo className="networkInfoButton" /> */}
      </div>
      <div className="networkButtonRowDivider"></div>
    </>
  );
};

const ConnectWalletButton: React.FC<{ onClick: () => void }> = (props) => {
  return (
    <button className="connectWalletButton" onClick={props.onClick}>
      Connect your wallet
    </button>
  );
};

const Address: React.FC<{}> = (props) => {
  return (
    <div className="addressWrapper">
      <h5>Connected to</h5>
      <span>{props.children}</span>
    </div>
  );
};

const App = () => {
  const { address, isConnecting, connect } = useGetWallet();

  return (
    <div className="content">
      <div className="title">
        <h1>Add a Layer 2 to your wallet</h1>
      </div>
      {address ? (
        <Address>{address}</Address>
      ) : (
        <ConnectWalletButton onClick={() => connect()}>Connect your wallet</ConnectWalletButton>
      )}
      <div className={cn("networks", !address && "disabled")}>
        {Object.entries(networks).map(([key, network]) => {
          return <NetworkButtonRow key={key} network={network}></NetworkButtonRow>;
        })}
      </div>
    </div>
  );
};

export default App;
