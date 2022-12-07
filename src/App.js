import React, { useState, useEffect } from "react";

import './App.css';
import { Routes, Route } from "react-router-dom";
import { Container, Menu, Segment, Image } from 'semantic-ui-react';
import { createContract } from './ethereum/WineSupplyChainContract';
import web3 from './ethereum/web3';
import Home from './components/Home';
import Farms from './components/Farms/Farms';
import FarmsForm from "./components/Farms/FarmsForm";
import Grapes from './components/Grapes/Grapes';
import GrapesForm from "./components/Grapes/GrapesForm";
import Wines from './components/Wines/Wines';
import WinesForm from "./components/Wines/WinesForm";

function App() {

  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    let contract;
    let accounts;
    const getContract = async () => {
      contract = await createContract();
      setContract(contract);
    }
  
    const getAccounts = async() =>  {
      accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    } 
    
    try {
      getContract();
      getAccounts();
    } catch (e) {
      console.log(e);
    }
    
    
  }, [])
  
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
  document.head.appendChild(styleLink);

  return (
    <div>
    {contract && accounts && accounts.length > 0 ? 
    (<Segment>
        <Container>
          <Menu secondary>
            <Menu.Item
              name='Home'
              href='/'
            />
            <Menu.Item
              name='Fincas'
              href='/farms'
            />
            <Menu.Item
              name='Uvas'
              href='/grapes'
            />
            <Menu.Item
              name='Vinos'
              href='/wines'
            />
          </Menu>
        </Container>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/farms" element={<Farms contract={contract} accounts={accounts}/>} />
            <Route path="/farms/create" element={<FarmsForm contract={contract} accounts={accounts}/>} />
            <Route path="/grapes" element={<Grapes contract={contract} accounts={accounts}/>} />
            <Route path="/grapes/create" element={<GrapesForm contract={contract} accounts={accounts}/>} />
            <Route path="/wines" element={<Wines contract={contract} accounts={accounts}/>} />
            <Route path="/wines/create" element={<WinesForm contract={contract} accounts={accounts}/>} />
          </Routes>
        </div>
      </Segment>)
    : 
    (<Segment loading>
      <Image src='/images/wireframe/paragraph.png' />
    </Segment>)
    }
    </div>
    
  );
}

export default App;
