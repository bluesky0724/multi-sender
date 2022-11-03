import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import  { SendSection } from './components/send';
import React from 'react';
import {testStore} from './components/test';

function App() {
  React.useEffect(() => {
    testStore();
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <SendSection/>
      </header>
    </div>
  );
}

export default App;
