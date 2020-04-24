import React from 'react';
import './App.css';
import Card from './Card';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function Project(props) {
  const {sections} = props;
  return (
  <div className="project">
    <header>
      Project
    </header>
    <div>
    {sections.map(sectionTitle => {
      return (
      <div>
        <header>
          {sectionTitle}
        </header>
        <Card/>
      </div>)
    })}

    </div>
  </div>
)};


export default Project;
