import { logError } from '@edx/frontend-platform/logging';

import { getCourseOutlineData } from 'features/course-home/data/api';
import { addModel } from 'features/generic/model-store';
import {
  fetchCourseOutlineFailure,
  fetchCourseOutlineRequest,
  fetchCourseOutlineSuccess,
} from 'features/course-home/data/slice';

/**
  * A thunk to make all the fetching cycle of the outline.
  *
  * Steps:
  * - Dispatches the fetchCourseOutlineRequest action to change the status to loading.
  * - Tries to fetch the outline data with getCourseOutlineData.
  * - If succcessful it adds the outline model data to the state with addModel an then
  *   it dispatches fetchCourseOutlineSuccess to change the status to loaded.
  * - If an error is catched, it dispatches fetchCourseOutlineFailure to change the status to failed.
  *
  * @param  { string } courseId String with the id of the course to fetch.
  *
  * @public
  */
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
