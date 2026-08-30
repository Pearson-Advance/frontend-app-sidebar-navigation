import { configureStore } from '@reduxjs/toolkit';
import { reducer as outlineReducer } from './features/outline/data';

export default function initializeStore() {
  return configureStore({
    reducer: {
      outline: outlineReducer,
    },
  });
}
