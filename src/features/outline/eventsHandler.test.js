import { postEventOutlineToParent, handleOutlineEvent } from '../../features/outline/eventsHandler';
import { getConfig } from '@edx/frontend-platform';

describe('postEventOutlineToParent', () => {
  beforeEach(() => {
    window.parent.postMessage = window.postMessage;
  });

  afterEach(() => {
    window.parent.postMessage = window.postMessage;
  });

  it('should call postMessage with the correct arguments', () => {
    jest.spyOn(window.parent, 'postMessage');

    postEventOutlineToParent('event_name', 'subsection_id');

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      message: 'event_name',
      subsection_id: 'subsection_id',
    }, getConfig().LEARNING_BASE_URL);
  });
});

describe('handleOutlineEvent', () => {
  let callback;
  beforeEach(() => {
    callback = jest.fn();
    handleOutlineEvent(callback);
  });

  it('should call the callback with true when it receives an outline_event message', () => {
    window.dispatchEvent(new MessageEvent('message', { data: { message: 'outline_event' } }));
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('should not call the callback when it receives an non-outline_event message', () => {
    window.dispatchEvent(new MessageEvent('message', { data: { message: 'other_event' } }));
    expect(callback).not.toHaveBeenCalled();
  });
});
