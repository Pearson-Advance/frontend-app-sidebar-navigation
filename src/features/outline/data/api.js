import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logInfo } from '@edx/frontend-platform/logging';

// eslint-disable-next-line import/no-self-import, import/no-cycle
import { normalizeOutlineBlocks as exportedNormalizeOutlineBlocks } from '../../../features/outline/data/api';

/**
  * A function that normalizes all blocks received from the outline API.
  *
  * The outline API from edx-platform returns all course blocks inside of a array without any distinction.
  * This function classifies by type each block so they can later be used in the components.
  * Returns the classified blocks.
  *
  * @param { string } courseId Must contain the id of the course.
  * @param { Object } blocks Object with the key 'blocks' with value of an object which contains
  * all course blocks objects.
  *
  * Return example:
  * {
  *   "course":{
  *     "id":"course-v1:edX+DemoX+Demo_Course",
  *     "title":"Demonstration Course",
  *     "sectionIds":[
  *       "block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b",
  *       "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
  *       "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
  *       "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
  *       "block-v1:edX+DemoX+Demo_Course+type@chapter+block@1414ffd5143b4b508f739b563ab468b7"
  *     ],
  *     "hasScheduledContent":null
  *   },
  *   "sections":{
  *       "block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b":{
  *         "complete":true,
  *         "id":"block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b",
  *         "title":"Introduction",
  *         "resumeBlock":false,
  *         "sequenceIds":[
  *             "block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction",
  *             "block-v1:edX+DemoX+Demo_Course+type@sequential+block@169471aa77c84dc4be5be3a1416a74c0",
  *             "block-v1:edX+DemoX+Demo_Course+type@sequential+block@f626c58b7db744639c26deb41ded47c0"
  *         ]
  *       }
  *       ...
  *   }
  *   "sequences":{
  *       "block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction":{
  *         "complete":true,
  *         "id":"block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction",
  *         "title":"Demo Course Overview",
  *         "showLink":true,
  *         "resumeBlock":false,
  *       }
  *       ...
  *   }
  * }
  * @public
  */
export function normalizeOutlineBlocks(courseId, blocks) {
  const models = {
    course: {},
    sections: {},
    sequences: {},
  };
  Object.values(blocks).forEach(block => {
    switch (block.type) {
      case 'course':
        models.course = {
          id: courseId,
          title: block.display_name,
          sectionIds: block.children || [],
          hasScheduledContent: block.has_scheduled_content,
        };
        break;

      case 'chapter':
        models.sections[block.id] = {
          complete: block.complete,
          id: block.id,
          title: block.display_name,
          resumeBlock: block.resume_block,
          sequenceIds: block.children || [],
        };
        break;

      case 'sequential':
        models.sequences[block.id] = {
          complete: block.complete,
          id: block.id,
          showLink: !!block.lms_web_url,
          title: block.display_name,
        };
        break;

      default:
        logInfo(`Unexpected course block type: ${block.type} with ID ${block.id}.  Expected block types are course, chapter, and sequential.`);
    }
  });

  return models;
}

/**
  * A function that fetches the course outline of a given course and returns the normalized course blocks.
  *
  * @param { string } courseId Must contain the id of the course to get the outline from.
  *
  * @public
  */
export async function getCourseOutlineData(courseId) {
  const url = `${getConfig().LMS_BASE_URL}/api/course_home/outline/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().get(url) || {};

  return exportedNormalizeOutlineBlocks(courseId, data?.course_blocks?.blocks || {});
}
