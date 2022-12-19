import React from 'react';
import PropTypes from 'prop-types';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getConfig } from '@edx/frontend-platform';

import messages from 'features/outline/messages';

function SequenceLink({
  id,
  courseId,
  first,
  sequence,
}) {
  const {
    complete,
    showLink,
    title,
  } = sequence;
  const coursewareUrl = (
    <a
      href={`${getConfig().LEARNING_BASE_URL}course/${courseId}/${id}`}
      target="_blank"
      rel="noreferrer"
      className="p-0 ml-3 text-break"
      aria-label={`${title}, ${complete ? messages.completedAssignment.defaultMessage : messages.incompleteAssignment.defaultMessage}`}
    >
      {title}
    </a>
  );
  const displayTitle = showLink ? coursewareUrl : title;

  return (
    <li className={`w-100 m-0 pl-3 d-flex align-items-center ${!first && 'mt-2 pt-2 border-top border-light'}`}>
      {complete ? (
        <FontAwesomeIcon
          icon={fasCheckCircle}
          fixedWidth
          className="float-left text-success mt-1"
          aria-hidden="true"
          title={messages.completedAssignment.defaultMessage}
        />
      ) : (
        <FontAwesomeIcon
          icon={farCheckCircle}
          fixedWidth
          className="float-left text-gray-400 mt-1"
          aria-hidden="true"
          title={messages.incompleteAssignment.defaultMessage}
        />
      )}
      {displayTitle}
    </li>
  );
}

SequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  sequence: PropTypes.shape().isRequired,
};

export default SequenceLink;
