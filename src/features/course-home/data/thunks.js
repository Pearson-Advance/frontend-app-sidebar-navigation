import { logError } from '@edx/frontend-platform/logging';

import { getCourseOutlineData } from 'features/course-home/data/api';
import { addModel } from 'features/generic/model-store';
import {
  fetchCourseOutlineFailure,
  fetchCourseOutlineRequest,
  fetchCourseOutlineSuccess,
} from 'features/course-home/data/slice';

export function fetchCourseOutline(courseId) {
  return async (dispatch) => {
    dispatch(fetchCourseOutlineRequest({ courseId }));
    try {
      const courseOutlineResult = getCourseOutlineData && await getCourseOutlineData(courseId);
      if (courseOutlineResult) {
        dispatch(addModel({
          modelType: 'outline',
          model: {
            id: courseId,
            ...courseOutlineResult,
          },
        }));
      }

      if (courseOutlineResult || !getCourseOutlineData) {
        dispatch(fetchCourseOutlineSuccess({
          courseId,
        }));
      }
    } catch (e) {
      dispatch(fetchCourseOutlineFailure({ courseId }));
      logError(e);
    }
  };
}
