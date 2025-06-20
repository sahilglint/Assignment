import { createSlice } from '@reduxjs/toolkit';
import undoable, { includeAction } from 'redux-undo';

const initialState = {
  blocks: []
};

const slice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    addBlock: (state, action) => {
      state.blocks.push(action.payload);
    },
    reorderBlocks: (state, action) => {
      state.blocks = action.payload;
    },
    undo: state => state,
    redo: state => state,
    setBlocks: (state, action) => {
      state.blocks = action.payload;
    }
  }
});

export const { addBlock, reorderBlocks, undo, redo, setBlocks } = slice.actions;

export default undoable(slice.reducer, {
  filter: includeAction(['layout/addBlock', 'layout/reorderBlocks'])
});
