import {
  render, fireEvent, screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { useParams } from 'react-router';
import initializeStore from 'store';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Factory } from 'rosie';
import { getConfig, initializeMockApp } from '@edx/frontend-platform';

import CourseOutline from '../../features/outline/CourseOutline';
import { fetchCourseOutline } from '../../features/outline/data';
import { executeThunk } from 'testUtils';
import messages from '../../features/outline/messages';

initializeMockApp();
jest.mock('react-router');

describe('CourseOutline', () => {
  let component;
  let store;
  let axiosMock;
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const outlineDataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/outline/${courseId}`;

  async function fetchAndRender() {
    render(component);
    await executeThunk(fetchCourseOutline(courseId), store.dispatch, store.getState);
  }

  beforeEach(() => {
    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    component = (
      <Provider store={store}>
        <CourseOutline />
      </Provider>
    );
  });

  describe('when courseStatus is loaded', () => {
    const outlineData = Factory.build('outlineTabData');
    useParams.mockReturnValue({ courseId });
    beforeEach(async () => {
      axiosMock.onGet(outlineDataUrl)
        .reply(200, outlineData);
      await fetchAndRender();
    });

    test('test expandAll button expands sections and collapseAll button is shown', async () => {
      const button = screen.getByText(messages.expandAll.defaultMessage);

      fireEvent.click(button);

      expect(button).toHaveTextContent(messages.collapseAll.defaultMessage);
    });

    test('content is rendered correctly when courseStatus is loaded', async () => {
      const asideSidebar = document.querySelector('aside.sidebar');

      expect(document.body).toContainElement(asideSidebar);
    });

    test('section map the correct number of sections', async () => {
      const sectionList = document.querySelectorAll('li.section-wrapper');

      expect(sectionList).toHaveLength(1);
    });
  });

  test('when courseStatus is loading', () => {
    render(component);

    expect(document.body).toHaveTextContent(messages.loading.defaultMessage);
  });

  test('when courseStatus is failed', async () => {
    await fetchAndRender();

    expect(document.body).toHaveTextContent(messages.failed.defaultMessage);
  });
});
