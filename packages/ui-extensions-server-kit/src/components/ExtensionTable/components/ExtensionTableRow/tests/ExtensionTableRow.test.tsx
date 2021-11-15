/* eslint-disable jest/no-disabled-tests */
import React from 'react';

import {ExtensionPayload} from '../../../../../types';
import {ActionSet, Checkbox, ExtensionTableRow, ExtensionTableRowProps} from '../../../..';
import {mockExtension, mount} from '../../../../../testing';

describe('ExtensionTableRow', () => {
  let defaultProps: ExtensionTableRowProps;
  let extension: ExtensionPayload;

  beforeEach(() => {
    defaultProps = {
      extension: mockExtension(),
      onHighlight: () => {},
      onClearHighlight: () => {},
      selected: true,
      toggleSelection: () => {},
      actions: <></>,
    };

    extension = defaultProps.extension;
  });

  it('calls toggleSelection with extension and stops propagation when row is clicked', async () => {
    const toggleSelection = jest.fn();
    const stopPropagation = jest.fn();
    const container = mount(
      <table>
        <tbody>
          <ExtensionTableRow {...defaultProps} toggleSelection={toggleSelection} />
        </tbody>
      </table>,
    );
    container.find('tr')?.trigger('onClick', {stopPropagation});

    expect(toggleSelection).toHaveBeenCalledWith(extension);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('calls toggleSelection with extension when checkbox is clicked', async () => {
    const toggleSelection = jest.fn();
    const stopPropagation = jest.fn();
    const container = mount(
      <table>
        <tbody>
          <ExtensionTableRow {...defaultProps} toggleSelection={toggleSelection} />
        </tbody>
      </table>,
    );
    container.find(Checkbox)?.trigger('onChange');

    expect(toggleSelection).toHaveBeenCalledWith(extension);
  });

  it('calls onHighlight with extension when when row onMouseEnter is triggered', async () => {
    const onHighlight = jest.fn();
    const container = mount(
      <table>
        <tbody>
          <ExtensionTableRow {...defaultProps} onHighlight={onHighlight} />
        </tbody>
      </table>,
    );

    container.find('tr')?.trigger('onMouseEnter');

    expect(onHighlight).toHaveBeenCalledWith(extension);
  });

  it('calls onClearHighlight with extension when when row onMouseLeave is triggered', async () => {
    const onClearHighlight = jest.fn();
    const container = mount(
      <table>
        <tbody>
          <ExtensionTableRow {...defaultProps} onClearHighlight={onClearHighlight} />
        </tbody>
      </table>,
    );

    container.find('tr')?.trigger('onMouseLeave');

    expect(onClearHighlight).toHaveBeenCalled();
  });

  it('renders ActionSet with provided extension and selected props', async () => {
    const container = mount(
      <table>
        <tbody>
          <ExtensionTableRow {...defaultProps} selected />
        </tbody>
      </table>,
    );

    expect(container).toContainReactComponent(ActionSet);
  });
});
