import { configureStore } from '@reduxjs/toolkit';
import { reducer as courseHomeReducer } from 'features/course-home/data';
import { reducer as modelsReducer } from 'features/generic/model-store';

export default function initializeStore() {
  return configureStore({
    reducer: {
      models: modelsReducer,
      courseHome: courseHomeReducer,
    },
  });
}
