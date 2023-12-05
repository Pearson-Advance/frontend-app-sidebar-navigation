import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import initializeStore from 'store';
import { executeThunk } from 'testUtils';
import { fetchCourseOutline } from '../../features/outline/data';
import {
  fetchCourseOutlineFailure,
  fetchCourseOutlineRequest,
  fetchCourseOutlineSuccess,
} from '../../features/outline/data/slice';

initializeMockApp();
jest.mock('@edx/frontend-platform/logging');

describe('thunks tests', () => {
  let axiosMock;
  let store;
  let outlineData;
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const outlineDataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/outline/${courseId}`;

  beforeEach(() => {
    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  test('dispatches are being perfomed', async () => {
    const dispatch = jest.fn();
    outlineData = { course: 'course' };
    axiosMock.onGet(outlineDataUrl)
      .reply(200, outlineData);

    await fetchCourseOutline(courseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(fetchCourseOutlineRequest({ courseId }));
    expect(dispatch).toHaveBeenCalledWith(fetchCourseOutlineSuccess({
      courseId,
      courseOutlineResult: {
        course: {},
        sections: {},
        sequences: {},
      },
    }));
  });

  test('dispatches are being perfomed when failed', async () => {
    const dispatch = jest.fn();
    axiosMock.onGet(outlineDataUrl)
      .reply(404);

    await fetchCourseOutline(courseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(fetchCourseOutlineFailure({ courseId }));
  });

  test('state is changed correctly', async () => {
    outlineData = { course: 'course' };
    axiosMock.onGet(outlineDataUrl)
      .reply(200, outlineData);

    expect(store.getState().outline.courseStatus).toEqual('loading');
    expect(store.getState().outline.outlineData).toEqual({});

    await executeThunk(fetchCourseOutline(courseId), store.dispatch, store.getState);

    expect(store.getState().outline.courseStatus).toEqual('loaded');
    expect(store.getState().outline.outlineData).toEqual({
      course: {},
      sections: {},
      sequences: {},
    });
  });

  test('state is changed correctly when failed', async () => {
    outlineData = { course: 'course' };
    axiosMock.onGet(outlineDataUrl)
      .reply(404);

    await executeThunk(fetchCourseOutline(courseId), store.dispatch, store.getState);

    expect(store.getState().outline.courseStatus).toEqual('failed');
    expect(logError).toBeCalled();
    expect(store.getState().outline.outlineData).toEqual({});
  });
});
