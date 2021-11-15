/* eslint-disable jest/no-disabled-tests */
import React from 'react';

import {ExtensionPayload} from '../../../../../types';
import {Checkbox, ExtensionTableHeader, ExtensionTableHeaderProps} from '../../../..';
import {mockExtensions, mount} from '../../../../../testing';

describe('ExtensionTableRow', () => {
  let defaultProps: ExtensionTableHeaderProps;
  let extensions: ExtensionPayload[];

  beforeEach(() => {
    defaultProps = {
      extensions: mockExtensions(),
      selectedExtensions: [],
      setSelected: () => {},
      actions: <>test_action</>,
    };

    extensions = defaultProps.extensions;
  });

  it('renders columns', async () => {
    const container = mount(
      <table>
        <ExtensionTableHeader {...defaultProps} columns={['one', 'two']} />
      </table>,
    );

    expect(container).toContainReactComponent('th', {children: 'one'});
    expect(container).toContainReactComponent('th', {children: 'two'});
  });

  it('calls setSelected with extensions', async () => {
    const setSelected = jest.fn();
    const container = mount(
      <table>
        <ExtensionTableHeader {...defaultProps} setSelected={setSelected} />
      </table>,
    );
    container.find(Checkbox)!.trigger('onChange');

    expect(setSelected).toHaveBeenCalled();
  });

  it('checks bulk select Checkbox if all extensions are selected', async () => {
    const container = mount(
      <table>
        <ExtensionTableHeader {...defaultProps} selectedExtensions={extensions} />
      </table>,
    );

    expect(container).toContainReactComponent(Checkbox, {checked: true});
  });

  it('renders custom actions', async () => {
    const container = mount(
      <table>
        <ExtensionTableHeader {...defaultProps} />
      </table>,
    );

    expect(container.find('div', {className: 'ActionGroup'})).toContainReactText('test_action');
  });
});
