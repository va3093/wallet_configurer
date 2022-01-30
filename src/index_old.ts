import { MetaMaskInpageProvider } from "@metamask/providers";
import networks, { NetworkConfig } from "./networks";
import Web3 from "web3";
import Web3Modal, { Provider } from "web3modal";

type Provider = any;

const ethereum = window.ethereum;

async function connectWallet(): Promise<Web3> {
  const providerOptions = {};

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
  });

  const provider = await web3Modal.connect();

  const web3 = new Web3(provider);
  return web3;
}

async function addNetwork(config: NetworkConfig) {
  console.log("add_polygon");
  // try {
  //   await ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: `0x${Number(config.chainId).toString(16)}` }],
  //   });
  // } catch (switchError) {
  // This error code indicates that the chain has not been added to MetaMask.
  // console.log(switchError);
  // if (switchError.code === 4902) {
  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{ ...config, chainId: `0x${Number(config.chainId).toString(16)}` }],
    });
  } catch (addError) {
    console.log(addError);
    // handle "add" error
  }
  // }
  // handle other "switch" errors
  // }
}

async function getCachedProvider(): Promise<Provider> | undefined {
  const isInjected = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
  if (isInjected) {
    return connectWallet();
  }
  return;
}

function networksWrapper(): Element {
  return document.getElementsByClassName("networks")[0];
}

(async function () {
  const provider = await getCachedProvider();

  if (provider) {
    networksWrapper().classList.add("disabled");
  }

  const buttons: HTMLButtonElement[] = [];
  for (let [key, config] of Object.entries(networks)) {
    const button = document.createElement("button");
    button.setAttribute("id", `add_${key}_button`);
    button.innerText = `Add ${config.chainName}`;
    button.addEventListener("click", () => addNetwork(config));
    networksWrapper().appendChild(button);

    buttons.push(button);
  }
  const connectButton = document.getElementById("connect_wallet_button");
  connectButton.addEventListener("click", connectWallet);
})();
