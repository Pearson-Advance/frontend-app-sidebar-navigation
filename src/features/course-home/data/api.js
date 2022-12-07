import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logInfo } from '@edx/frontend-platform/logging';

/**
  * A function that normalizes all blocks received from the outline API.
  *
  * The outline API returns all course blocks inside of a array without any distinction.
  * This function classifies by type each block so they can later be used in the components.
  * Returns the classified blocks.
  *
  * @param { string } courseId Must contain the id of the course.
  * @param { Object } blocks Object with the key 'blocks' with value of an object which contains
  * all course blocks objects.
  *
  * @public
  */
export function normalizeOutlineBlocks(courseId, blocks) {
  const models = {
    courses: {},
    sections: {},
    sequences: {},
  };
  Object.values(blocks).forEach(block => {
    switch (block.type) {
      case 'course':
        models.courses[block.id] = {
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

  // Next go through each list and use their child lists to decorate those children with a
  // reference back to their parent.
  Object.values(models.courses).forEach(course => {
    if (Array.isArray(course.sectionIds)) {
      course.sectionIds.forEach(sectionId => {
        const section = models.sections[sectionId];
        section.courseId = course.id;
      });
    }
  });

  Object.values(models.sections).forEach(section => {
    if (Array.isArray(section.sequenceIds)) {
      section.sequenceIds.forEach(sequenceId => {
        if (sequenceId in models.sequences) {
          models.sequences[sequenceId].sectionId = section.id;
        } else {
          logInfo(`Section ${section.id} has child block ${sequenceId}, but that block is not in the list of sequences.`);
        }
      });
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
  const outlineData = await getAuthenticatedHttpClient().get(url);

  const {
    data,
  } = outlineData;

  const courseBlocks = data.course_blocks ? normalizeOutlineBlocks(courseId, data.course_blocks.blocks) : {};

  return courseBlocks;
}
