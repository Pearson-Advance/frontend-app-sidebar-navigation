/* eslint-disable import/first */
import { expect, jest, test } from '@jest/globals';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logInfo } from '@edx/frontend-platform/logging';
import { getConfig } from '@edx/frontend-platform';

jest.mock('@edx/frontend-platform/logging');
jest.mock('@edx/frontend-platform/auth');
jest.mock('./api');

describe('normalizeOutlineBlocks', () => {
  const { normalizeOutlineBlocks } = jest.requireActual('features/outline/data/api');
  test('behaves as expected when everything is correct', () => {
    const blocks = {
      'block-v1:edX+DemoX+Demo_Course+type@course+block@course': {
        children: [
          'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b',
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@course+block@course',
        lms_web_url: 'http://localhost:18000/courses/course-v1:edX+DemoX+Demo_Course/jump_to/block-v1:edX+DemoX+Demo_Course+type@course+block@course',
        type: 'course',
      },
      'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b': {
        children: [
          'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction',
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b',
        type: 'chapter',
      },
      'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction': {
        children: [
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction',
        type: 'sequential',
      },
    };
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    const normalizedBlocks = normalizeOutlineBlocks(courseId, blocks);

    Object.keys(normalizedBlocks.sections).forEach(key => {
      expect(key).toMatch(/chapter/);
    });
    Object.keys(normalizedBlocks.sequences).forEach(key => {
      expect(key).toMatch(/sequential/);
    });
    expect(normalizedBlocks.course.id).toMatch(/course/);
    expect(logInfo).toBeCalledTimes(0);
  });

  test('log is thrown when block type is incorrect', () => {
    const incorrectType = 'courseIncorrect';
    const blocks = {
      'block-v1:edX+DemoX+Demo_Course+type@course+block@course': {
        children: [
          'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b',
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@course+block@course',
        type: incorrectType,
      },
    };
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    normalizeOutlineBlocks(courseId, blocks);

    expect(logInfo).toBeCalledWith(`Unexpected course block type: ${incorrectType} with ID ${'block-v1:edX+DemoX+Demo_Course+type@course+block@course'}.  Expected block types are course, chapter, and sequential.`);
  });

  test('correct data is returned when blocks are not passed correctly', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const expectedOutput = {
      course: {},
      sections: {},
      sequences: {},
    };

    const normalizedBlocks = normalizeOutlineBlocks(courseId, {});

    expect(normalizedBlocks).toEqual(expectedOutput);
  });
});

describe('getCourseOutlineData', () => {
  const { getCourseOutlineData } = jest.requireActual('features/outline/data/api');
  const { normalizeOutlineBlocks } = jest.requireMock('features/outline/data/api');
  test('request is called correctly', async () => {
    const blocks = {
      'block-v1:edX+DemoX+Demo_Course+type@course+block@course': {
        children: [
          'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b',
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@course+block@course',
        lms_web_url: 'http://localhost:18000/courses/course-v1:edX+DemoX+Demo_Course/jump_to/block-v1:edX+DemoX+Demo_Course+type@course+block@course',
        type: 'course',
      },
      'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b': {
        children: [
          'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction',
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b',
        type: 'chapter',
      },
      'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction': {
        children: [
        ],
        id: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction',
        type: 'sequential',
      },
    };
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockReturnValue({ data: blocks }),
    });
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const url = `${getConfig().LMS_BASE_URL}/api/course_home/outline/${courseId}`;

    await getCourseOutlineData(courseId);

    expect(getAuthenticatedHttpClient().get).toBeCalledWith(url);
    expect(getAuthenticatedHttpClient().get).toBeCalledTimes(1);
  });

  test('if data key is not present in the response', async () => {
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });
    normalizeOutlineBlocks.mockReturnValue({});
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    await getCourseOutlineData(courseId);

    expect(normalizeOutlineBlocks).toBeCalledWith(courseId, {});
  });

  test('if blocks are returned then call normalizeOutlineBlocks', async () => {
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockReturnValue({
        data: {
          course_blocks: { blocks: {} },
        },
      }),
    });
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    await getCourseOutlineData(courseId);

    expect(normalizeOutlineBlocks).toBeCalledWith(courseId, {});
  });
});
