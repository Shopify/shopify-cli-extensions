import React from 'react';

import {ExtensionPayload} from '../../../../../types';
import {Checkbox, ExtensionTableHeader, ExtensionTableHeaderProps, ActionSet} from '../../../..';
import {mockExtensions, mount} from '../../../../../testing';

describe('ExtensionTableRow', () => {
  let defaultProps: ExtensionTableHeaderProps;
  let extensions: ExtensionPayload[];

  beforeEach(() => {
    defaultProps = {
      extensions: mockExtensions(),
      selectedExtensions: [],
      onSelected: () => {},
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

  it('calls onSelected with extensions', async () => {
    const onSelected = jest.fn();
    const container = mount(
      <table>
        <ExtensionTableHeader {...defaultProps} onSelected={onSelected} />
      </table>,
    );
    container.find(Checkbox)!.trigger('onChange');

    expect(onSelected).toHaveBeenCalled();
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

    expect(container.find(ActionSet)).toContainReactText('test_action');
  });
});
