import React from 'react';
import './App.css';
import { Draggable } from 'react-beautiful-dnd';

function Card() {

  return (
  <div className="card" draggable="true">
    <header>
      Card
    </header>
    <textarea id="w3mission" rows="4" cols="50">
    </textarea>
  </div>
)};


export default Card;
