import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider) => {
  return new Web3Provider(provider); 
};

const Root = ({ store }) => (
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
