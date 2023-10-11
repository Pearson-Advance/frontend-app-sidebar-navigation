import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapsible, IconButton } from '@edx/paragon';
import { faCheckCircle as fasCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleOutlineEvent } from '../../features/outline/eventsHandler';

import SequenceLink from '../../features/outline/SequenceLink';
import messages from '../../features/outline/messages';

function Section({
  courseId,
  defaultOpen,
  expand,
  section,
}) {
  const {
    complete,
    sequenceIds,
    title,
  } = section;
  const {
    sequences,
  } = useSelector(state => state.outline.outlineData);
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  // If an event occurs in frontend-app-learning setOpen will be set as true.
  useEffect(() => {
    handleOutlineEvent(setOpen);
  }, [setOpen]);

  const sectionTitle = (
    <div className="row w-100 m-0 align-items-center">
      {complete ? (
        <FontAwesomeIcon
          icon={fasCheckCircle}
          fixedWidth
          className="float-left mt-1 text-success"
          aria-hidden="true"
          title={messages.completedSection.defaultMessage}
        />
      ) : (
        <FontAwesomeIcon
          icon={farCheckCircle}
          fixedWidth
          className="float-left mt-1 text-gray-400"
          aria-hidden="true"
          title={messages.incompleteSection.defaultMessage}
        />
      )}
      <p
        className="ml-3 p-0 mb-0 font-weight-bold text-dark-500"
        aria-label={`${title}, ${complete ? messages.completedSection.defaultMessage : messages.incompleteSection.defaultMessage}`}
      >
        {title}
      </p>
    </div>
  );

  return (
    <li className="section-wrapper">
      <Collapsible
        className="mb-2"
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => { setOpen(!open); }}
        iconWhenClosed={(
          <IconButton
            alt={messages.openSection.defaultMessage}
            icon={faPlus}
            onClick={() => { setOpen(true); }}
            size="sm"
          />
        )}
        iconWhenOpen={(
          <IconButton
            alt={messages.close.defaultMessage}
            icon={faMinus}
            onClick={() => { setOpen(false); }}
            size="sm"
          />
        )}
      >
        <ol className="list-unstyled subsection-list">
          {sequenceIds.map((sequenceId, index) => (
            <SequenceLink
              key={sequenceId}
              id={sequenceId}
              courseId={courseId}
              sequence={sequences[sequenceId]}
              first={index === 0}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
}

Section.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  section: PropTypes.shape().isRequired,
};

export default Section;
