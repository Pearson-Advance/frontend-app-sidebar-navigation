import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Button, Spinner } from '@edx/paragon';

import { fetchCourseOutline } from 'features/outline/data';
import messages from 'features/outline/messages';
import Section from 'features/outline/Section';
import { FAILED, LOADING } from 'features/outline/data/slice';
import { handleOutlineEvent } from 'features/outline/eventsHandler';

function CourseOutline() {
  const { courseId: courseIdFromUrl } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourseOutline(courseIdFromUrl));
  }, [courseIdFromUrl, dispatch]);

  const {
    courseId,
    courseStatus,
  } = useSelector(state => state.outline);
  const {
    course,
    sections,
  } = useSelector(state => state.outline.outlineData);
  const [expandAll, setExpandAll] = useState(false);

  // If an event occurs in frontend-app-learning setExpandAll will be set as true.
  useEffect(() => {
    handleOutlineEvent(setExpandAll);
  }, [setExpandAll]);

  if (courseStatus === LOADING) {
    return (
      <div className="w-100 d-flex justify-content-center h-100 mt-3" data-testid="spinner-wrapper">
        <Spinner animation="border" variant="primary" screenReaderText={messages.loading.defaultMessage} />
      </div>
    );
  }

  if (courseStatus === FAILED) {
    return (
      <p className="text-danger m-3 text-center">{messages.failed.defaultMessage}</p>
    );
  }

  return (
    <aside className="sidebar-outline-wrapper">
      <nav className="sidebar-outline p-3" aria-label="Sidebar Navigation">
        <Button
          id="expandButton"
          variant="outline-primary w-100 mb-3"
          onClick={() => { setExpandAll(!expandAll); }}
        >
          {expandAll ? messages.collapseAll.defaultMessage : messages.expandAll.defaultMessage}
        </Button>
        <ol className="sidebar-section-wrapper list-unstyled">
          {course.sectionIds.map((sectionId) => (
            <Section
              key={sectionId}
              courseId={courseId}
              defaultOpen={sections[sectionId].resumeBlock}
              expand={expandAll}
              section={sections[sectionId]}
            />
          ))}
        </ol>
      </nav>
    </aside>
  );
}

export default CourseOutline;
