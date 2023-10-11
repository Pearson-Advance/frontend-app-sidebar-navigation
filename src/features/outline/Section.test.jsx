import {
  render,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import initializeStore from 'store';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Factory } from 'rosie';
import { getConfig, initializeMockApp } from '@edx/frontend-platform';

import Section from '../../features/outline/Section';
import { fetchCourseOutline } from '../../features/outline/data';
import { executeThunk } from 'testUtils';

initializeMockApp();

describe('Section', () => {
  let store;
  let axiosMock;
  let component;
  let defaultSectionProps;
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const outlineDataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/outline/${courseId}`;
  const outlineData = Factory.build('outlineTabData');
  let section;

  async function fetchAndRender(sectionProps) {
    component = (
      <Provider store={store}>
        <Section
          {...sectionProps}
        />
      </Provider>
    );
    await executeThunk(fetchCourseOutline(courseId), store.dispatch, store.getState);
    return render(component);
  }

  beforeEach(async () => {
    defaultSectionProps = {
      courseId,
      defaultOpen: false,
      expand: false,
      section: {},
    };
    section = {
      complete: true,
      id: 'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b',
      title: 'Introduction',
      resumeBlock: false,
      sequenceIds: [
        'block-v1:edX+DemoX+Demo_Course+type@sequential+block@bcdabcdabcdabcdabcdabcdabcdabcd1',
      ],
    };
    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock.onGet(outlineDataUrl)
      .reply(200, outlineData);
  });

  test('show checked icon when complete', async () => {
    await fetchAndRender({
      ...defaultSectionProps,
      section,
    });

    const checkedButton = document.querySelector('.float-left.mt-1.text-success');
    const uncheckedButton = document.querySelector('.float-left.mt-1.text-gray-400');

    expect(checkedButton).toBeInTheDocument();
    expect(uncheckedButton).not.toBeInTheDocument();
  });

  test('show unchecked icon when incomplete', async () => {
    await fetchAndRender({
      ...defaultSectionProps,
      section: {
        ...section,
        complete: false,
      },
    });

    const checkedButton = document.querySelector('.float-left.mt-1.text-success');
    const uncheckedButton = document.querySelector('.float-left.mt-1.text-gray-400');

    expect(uncheckedButton).toBeInTheDocument();
    expect(checkedButton).not.toBeInTheDocument();
  });

  test('is expanded when defaultOpen is true', async () => {
    await fetchAndRender({
      ...defaultSectionProps,
      section,
      defaultOpen: true,
    });

    const subsectionList = document.querySelector('.section-wrapper div:first-child');

    expect(subsectionList).toHaveAttribute('open');
  });

  test('is closed when defaultOpen is false', async () => {
    await fetchAndRender({
      ...defaultSectionProps,
      section,
      defaultOpen: false,
    });

    const subsectionList = document.querySelector('.section-wrapper div:first-child');

    expect(subsectionList).not.toHaveAttribute('open');
  });
});
