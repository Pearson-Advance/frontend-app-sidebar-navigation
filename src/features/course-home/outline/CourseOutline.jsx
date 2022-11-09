import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Button } from '@edx/paragon';

import { fetchCourseOutline } from 'features/course-home/data';
import messages from 'features/course-home/outline/messages';
import Section from 'features/course-home/outline/Section';
import { useModel } from 'features/generic/model-store';
import { FAILED, LOADING } from 'features/course-home/data/slice';

function CourseOutline() {
  const { courseId: courseIdFromUrl } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourseOutline(courseIdFromUrl));
  }, [courseIdFromUrl, dispatch]);

  const {
    courseId,
    courseStatus,
  } = useSelector(state => state.courseHome);

  const {
    courses,
    sections,
  } = useModel('outline', courseId);

  const [expandAll, setExpandAll] = useState(false);

  const rootCourseId = courses && Object.keys(courses)[0];

  if (courseStatus === LOADING) {
    return (
      <h3>Loading</h3>
    );
  }

  if (courseStatus === FAILED) {
    return (
      <h3>There was an error trying to load this course.</h3>
    );
  }

  return (
    <div className="row course-outline-tab">
      <div className="col">
        {rootCourseId && (
          <>
            <div className="row w-100 m-0 mb-3 justify-content-end">
              <div className="col-12 col-md-auto p-0">
                <Button variant="outline-primary" block onClick={() => { setExpandAll(!expandAll); }}>
                  {expandAll ? messages.collapseAll.defaultMessage : messages.expandAll.defaultMessage}
                </Button>
              </div>
            </div>
            <ol id="courseHome-outline" className="list-unstyled">
              {courses[rootCourseId].sectionIds.map((sectionId) => (
                <Section
                  key={sectionId}
                  courseId={courseId}
                  defaultOpen={sections[sectionId].resumeBlock}
                  expand={expandAll}
                  section={sections[sectionId]}
                />
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}

export default CourseOutline;
