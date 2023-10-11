import {
  render,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import initializeStore from 'store';

import SequenceLink from '../../features/outline/SequenceLink';

describe('Section', () => {
  let store;
  let defaultSequenceProps;

  function renderWithProps(props) {
    const component = (
      <Provider store={store}>
        <SequenceLink
          {...props}
        />
      </Provider>
    );
    render(component);
  }

  beforeEach(() => {
    defaultSequenceProps = {
      id: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@bcdabcdabcdabcdabcdabcdabcdabcd1',
      first: true,
      sequence: {},
    };
    store = initializeStore();
  });

  test('show checked icon when complete', () => {
    const sequence = {
      complete: true,
      title: 'Demo',
    };
    renderWithProps({
      ...defaultSequenceProps,
      sequence,
    });

    const checkedButton = document.querySelector('.float-left.mt-1.text-success');
    const uncheckedButton = document.querySelector('.float-left.mt-1.text-gray-400');

    expect(checkedButton).toBeInTheDocument();
    expect(uncheckedButton).not.toBeInTheDocument();
  });

  test('show unchecked icon when incomplete', () => {
    const sequence = {
      complete: false,
      title: 'Demo',
    };
    renderWithProps({
      ...defaultSequenceProps,
      sequence,
    });

    const checkedButton = document.querySelector('.float-left.mt-1.text-success');
    const uncheckedButton = document.querySelector('.float-left.mt-1.text-gray-400');

    expect(uncheckedButton).toBeInTheDocument();
    expect(checkedButton).not.toBeInTheDocument();
  });

  test('sequence is styled correctly when is first', () => {
    const sequence = {
      complete: false,
      title: 'Demo',
    };
    renderWithProps({
      ...defaultSequenceProps,
      sequence,
    });

    const sequenceWrapper = document.querySelector('li.w-100.m-0.pl-3.d-flex.align-items-center');

    expect(sequenceWrapper).not.toHaveClass('mt-2 pt-2 border-top border-light');
  });

  test('sequence is styled correctly when is not first', () => {
    const sequence = {
      complete: false,
      title: 'Demo',
    };
    renderWithProps({
      ...defaultSequenceProps,
      sequence,
      first: false,
    });

    const sequenceWrapper = document.querySelector('li.w-100.m-0.pl-3.d-flex.align-items-center');

    expect(sequenceWrapper).toHaveClass('mt-2 pt-2 border-top border-light');
  });
});
