import { logError } from '@edx/frontend-platform/logging';

import { getCourseOutlineData } from '../../../features/outline/data/api';
import {
  fetchCourseOutlineFailure,
  fetchCourseOutlineRequest,
  fetchCourseOutlineSuccess,
} from '../../../features/outline/data/slice';

/**
  * A thunk to make all the fetching cycle of the outline.
  *
  * Steps:
  * - Dispatches the fetchCourseOutlineRequest action to change the courseStatus to loading.
  * - Tries to fetch the outline data with getCourseOutlineData.
  * - If succcessful it adds the outline model data to the state and changes the courseStatus to loaded.
  * - If an error is catched, it dispatches fetchCourseOutlineFailure to change the courseStatus to failed.
  *
  * @param  { string } courseId String with the id of the course to fetch.
  *
  * @public
  */
export function fetchCourseOutline(courseId) {
  return async (dispatch) => {
    dispatch(fetchCourseOutlineRequest({ courseId }));
    try {
      const courseOutlineResult = await getCourseOutlineData(courseId);

      if (courseOutlineResult) {
        dispatch(fetchCourseOutlineSuccess({
          courseId,
          courseOutlineResult,
        }));
      }
    } catch (e) {
      dispatch(fetchCourseOutlineFailure({ courseId }));
      logError(e);
    }
  };
}
