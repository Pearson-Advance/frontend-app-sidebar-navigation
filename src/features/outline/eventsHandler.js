/* eslint-disable object-shorthand */

import { getConfig } from '@edx/frontend-platform';

/**
 * Helper function to make a postEvent call.
 * @param {string} message with the name of the event
 * @param {string} id xBlock with id of the subsection
 *  useCase: In another route, the event is received in
 *  the MFE with the message and within its data it contains
 *  the subsection id.
 */
export function postEventOutlineToParent(message, id) {
  const messageTargets = [
    getConfig().LEARNING_BASE_URL,
  ];

  messageTargets.forEach(target => {
    window.parent.postMessage(
      {
        message: message,
        subsection_id: id,
      },
      target,
    );
  });
}

/**
 * Helper function to handle when an event occurs for Outline Navigation Sidebar.
 * @param {string} message with the name of the event
 * @param {state} set state as true.
 *  useCase: An event is received from a different route to the MFE through a
 *  message and the desired functionality is executed.
 *
 *  example: const [expandAll, setExpandAll] = useState(false);
 *  handleOutlineEvent(setExpandAll);
 */
export function handleOutlineEvent(callback) {
  const handleMessage = (event) => {
    if (event.data.message === 'outline_event') {
      callback(true);
    }
  };

  window.addEventListener('message', handleMessage);
  // Cleanup eventListener.
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}
