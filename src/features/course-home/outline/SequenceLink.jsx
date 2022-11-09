import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import messages from './messages';

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

  const coursewareUrl = <a href={`${process.env.LEARNING_MFE_BASE_URL}course/${courseId}/${id}`} target="_blank" rel="noreferrer">{title}</a>;
  const displayTitle = showLink ? coursewareUrl : title;

  return (
    <li>
      <div className={classNames('', { 'mt-2 pt-2 border-top border-light': !first })}>
        <div className="row w-100 m-0">
          <div className="col-auto p-0">
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
          </div>
          <div className="col-10 p-0 ml-3 text-break">
            <span className="align-middle">{displayTitle}</span>
            <span className="sr-only">
              , {complete ? messages.completedAssignment.defaultMessage : messages.incompleteAssignment.defaultMessage}
            </span>
          </div>
        </div>
      </div>
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
