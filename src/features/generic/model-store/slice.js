/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, shallowEqual } from 'react-redux';

/**
  * A function that retreives and returns the data of a model from the state.
  *
  * @param { string } type Must contain the name of the model class. i.g: 'outline'.
  * @param { string } id The id of the model instance to be retreived.
  *
  * @public
  */
export function useModel(type, id) {
  return useSelector(
    state => ((state.models[type] !== undefined && state.models[type][id] !== undefined) ? state.models[type][id] : {}),
    shallowEqual,
  );
}

/**
  * A private function that modifies the app state passed.
  * This function is used in the reducer addModel
  *
  * @param { Object } state Current state of the app to modify.
  * @param { string } modelType Must contain the name of the model class.
  * @param { Object } model Model object that contains all the data.
  * @param { string } idField String that must contain the name of the id field if different from id.
  *
  * @private
  */
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
    /**
     * Action to modify the model-store state to add a model instance.
     */
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
