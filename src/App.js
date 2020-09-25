import React from 'react';
import logo from './logo.svg';
import {Button} from './stories/Button'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          <h2> This is sample react app built for picture frame company</h2>
          <Button primary={true}  label={"Does Nothing"} />
        </p>
      </header>
    </div>
  );
}

export default App;
