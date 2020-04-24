import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './App.css';

// Copied from https://codesandbox.io/s/-w5szl?file=/src/index.js:0-4999

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

/**
 * Styling
 */
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightseagreen" : "darkseagreen",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "bisque" : "blanchedalmond",
  padding: grid,
  width: 250
});

/**
 * Button to add new card
 */
 const AddNewCardButton = (props) => {
  return <button
    type="button"
    onClick={() => props.onClick(props.columnIndex)}
  >
    Add new card
  </button>
 };

 /**
 * Adds a column/swimlane
 */
 const AddColumnButton = (props) => {
  return <button
        type="button"
        onClick={() => props.onClick()}
      >
        Add column
      </button>
 };

/**
 * Card
 */
 const Card = (props) => {
   const {item, index, ind, deleteCard} = props;
 return <Draggable
    key={item.id}
    draggableId={item.id}
    index={index}
  >
    {(provided, snapshot) => (
      <div
        className={'card'}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(
          snapshot.isDragging,
          provided.draggableProps.style
        )}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          <textarea defaultValue={item.content}></textarea>
          <DeleteCardButton index={index} ind={ind} deleteCard={deleteCard}/>
        </div>
      </div>
    )}
  </Draggable>
}

/**
 * Delete card button
 */
 const DeleteCardButton = (props) => {
   const {index, ind, deleteCard} = props;
   return <button
      type="button"
      onClick={() => deleteCard(ind, index)}
    >
      delete
    </button>
 }

/**
 * Main app
 */
function App() {
  const [state, setState] = useState([getItems(5), getItems(5, 10)]);
  const addCardToColumn = columnIndex => {
   const updatedState = [...state];
   updatedState[columnIndex].push(getItems(1)[0]);
   setState([...updatedState]);
  };

  const addColumn = () => setState([...state, []]);
  const deleteCard = (ind, index) => {
    const newState = [...state];
    newState[ind].splice(index, 1);
    setState(
      newState.filter(group => group.length)
    );
  };

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group.length));
    }
  }

  return (
    <div>
      <AddColumnButton onClick={addColumn}/>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <AddNewCardButton onClick={addCardToColumn} columnIndex={ind}/>

                  {el.map((item, index) => (
                    <Card item={item} index={index} ind={ind} deleteCard={deleteCard}/>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
