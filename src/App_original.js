import React from 'react';
import './App.css';
import Project from './Project';

function App() {
  return (
  <div className="App">
    <header className="App-header">
      <Project sections={['Backlog', 'In progress']}/>
    </header>
  </div>
)};


export default App;
