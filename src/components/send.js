import React, { useEffect, useReducer } from "react";
import { useState } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import {
  Input,
  InputNumber,
  Select,
  Button,
  Divider,
  Modal,
  Radio,
} from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { addEmployee, updateEmployeeList } from "../reducers";
import "./style.scss";
import { contractAddress } from "../contracts/contractAddress";
import { abi } from "../contracts/abi";

export const SendSection = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tokenType, setTokenType] = useState("ETH");
  const [amount, setAmount] = useState(0);
  const [visible, setVisible] = useState(false);

  const Option = Select.Option;
  const { active, chainId, account } = useWeb3React();
  const { activate, deactivate, library } = useWeb3React();
  const employees = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  const handleEdit = (name, address, tokenType, amount) => {
    setData(name, address, tokenType, amount);
    setVisible(true);
  };

  const handleDeleteClick = (address) => {
    dispatch(
      updateEmployeeList(
        employees.filter((employee) => employee.address !== address)
      )
    );
  };



  const ReceipeintCard = ({ name, address, tokenType, amount }) => {
    return (
      <div className={"receipient-card " + tokenType}>
        <div>
          <div>{name}</div>
          <div style={{ fontSize: "14px" }}>{address}</div>
        </div>
        <div>{amount + " " + tokenType}</div>
        <div>
          <Button
            type="dashed"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEdit(name, address, tokenType, amount)}
          />
          <Button
            type="dashed"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(address)}
          />
        </div>
      </div>
    );
  };

  const handleOk = () => {
    dispatch(addEmployee({ name, address, tokenType, amount }));
    setVisible(false);
  };

  const handleAddClick = () => {
    setInitial();
    setVisible(true);
  };

  const handleSendClick = () => {
    if (!(active && account && library)) {
        console.log('rejected');
      return;
    }
    console.log('success');
    const contract = new Contract(contractAddress, abi, library.getSigner());
    const addresses = employees.map((employee) => employee.address);
    const amounts = employees.map((employee) => employee.amount);
    contract
      .multiSendDiffEth(addresses, amounts, {
        gasLimit: 500000000,
        value: sum(amounts),
      })
      .then((result) => console.log(result));
  };

  const sum = (array) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) sum += array[i];
    return sum;
  };

  const handleCancel = () => {
    setInitial();
    setVisible(false);
  };

  const setData = (name, address, tokenType, amount) => {
    setName(name);
    setAddress(address);
    setTokenType(tokenType);
    setAmount(amount);
  };

  const setInitial = () => {
    setData("", "", "", 0);
  };

  useEffect(() => {
    const connector = new InjectedConnector({
      supportedChainIds: [5777],
    });
    activate(connector);
  }, []);

  const totalAmount = sum(employees.map((employee) => employee.amount));
  const totalReceipient = sum(employees);
  
  return (
    <div className="multi-send">
      <div className="header">
        <h1>Multi Sender</h1>
        <h5>Send your asset to everyone with just ONE click</h5>
      </div>
      <div className="body">
        <div className="sender">
          <div className="sender-item">
            <span style={{ width: "40%" }}>Your Address:</span>
            <Input style={{ width: "auto" }} disabled={true} value={account} />
          </div>
          <div className="detail">
            <p>Total : {totalAmount} eth, 5 ERC20</p>
            <p>{totalReceipient} receipients ( 3 for ether and 7 for ERC20 )</p>
          </div>
          <div className="btn-group">
            <Button size="large" onClick={handleAddClick}>
              Add
            </Button>
            <Button size="large" onClick={handleSendClick}>
              Send
            </Button>
          </div>
        </div>
        <Divider style={{ backgroundColor: "gray" }} />
        <div className="receipients">
          <h4 style={{ marginBottom: "0.5rem" }}>Receipients</h4>
          {employees.map((employee) => (
            <ReceipeintCard
              name={employee.name}
              address={employee.address}
              tokenType={employee.tokenType}
              amount={employee.amount}
            />
          ))}
        </div>
      </div>
      <Modal
        title="Add Receipient"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="receipient-item">
          <span style={{ width: "20%" }}>Name:</span>
          <Input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            maxLength="30"
            placeholder="Enter receipient name."
          />
        </div>
        <div className="receipient-item">
          <span style={{ width: "20%" }}>Address:</span>
          <Input
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            value={address}
            placeholder="Enter receipient address."
          />
        </div>
        <div className="receipient-item">
          <span style={{ width: "20%" }}>Amount:</span>
          <InputNumber
            onChange={(value) => {
              setAmount(value);
            }}
            value={amount}
          />
        </div>
        <div className="receipient-item">
          <span style={{ width: "20%" }}>Token type:</span>
          <Radio.Group
            onChange={(e) => setTokenType(e.target.value)}
            value={tokenType}
          >
            <Radio value={"ETH"}>ETH</Radio>
            <Radio value={"ERC20"}>ERC20</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({ employees: state.employees });

connect(mapStateToProps)(SendSection);
