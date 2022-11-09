/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, shallowEqual } from 'react-redux';

export function useModel(type, id) {
  return useSelector(
    state => ((state.models[type] !== undefined && state.models[type][id] !== undefined) ? state.models[type][id] : {}),
    shallowEqual,
  );
}

function add(state, modelType, model, idField) {
  idField = idField ?? 'id';
  const id = model[idField];
  if (state[modelType] === undefined) {
    state[modelType] = {};
  }
  state[modelType][id] = model;
}

const slice = createSlice({
  name: 'models',
  initialState: {},
  reducers: {
    addModel: (state, { payload }) => {
      const { modelType, model, idField } = payload;
      add(state, modelType, model, idField);
    },
  },
});

export const {
  addModel,
} = slice.actions;

export const { reducer } = slice;
