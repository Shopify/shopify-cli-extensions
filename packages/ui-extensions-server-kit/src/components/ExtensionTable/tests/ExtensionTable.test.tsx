import React from 'react';

import {mockExtensions, mount} from '../../../testing';
import {DevConsoleProvider} from '../../../state/context';
import {
  ExtensionTable,
  ExtensionTableProps,
  ExtensionTableRow,
  RefreshAction,
  ToggleViewAction,
} from '../..';
import {ExtensionTableHeader} from '..';
import * as context from '../../../state/context';

describe('ExtensionTableRow', () => {
  let defaultProps: ExtensionTableProps;
  let container: any;

  beforeEach(() => {
    defaultProps = {
      // eslint-disable-next-line react/display-name
      renderItem: ({extension, selected, toggleSelection, onHighlight, onClearHighlight}) => {
        return (
          <ExtensionTableRow
            extension={extension}
            selected={selected}
            toggleSelection={toggleSelection}
            onHighlight={onHighlight}
            onClearHighlight={onClearHighlight}
            actions={
              <>
                <RefreshAction />
                <ToggleViewAction />
              </>
            }
          />
        );
      },
    };
  });

  it('renders default header', async () => {
    container = mount(
      <DevConsoleProvider host="ws://localhost:8000/extensions/">
        <ExtensionTable {...defaultProps} />
      </DevConsoleProvider>,
    );

    expect(container).toContainReactComponent(ExtensionTableHeader);
  });

  it('renders custom header', async () => {
    container = mount(
      <DevConsoleProvider host="ws://localhost:8000/extensions/">
        <ExtensionTable
          {...defaultProps}
          header={
            <thead>
              <tr>
                <th>custom header</th>
              </tr>
            </thead>
          }
        />
      </DevConsoleProvider>,
    );

    expect(container).toContainReactText('custom header');
  });

  it('does not render rows when extensions list is empty', async () => {
    jest.spyOn(context, 'useDevConsole').mockReturnValue({
      update: jest.fn(),
      dispatch: jest.fn(),
      extensions: [],
      store: '',
    });

    container = mount(
      <DevConsoleProvider host="ws://localhost:8000/extensions/">
        <ExtensionTable {...defaultProps} />
      </DevConsoleProvider>,
    );

    expect(container).not.toContainReactComponent(ExtensionTableRow);
  });

  it('renders rows when extensions exist', async () => {
    jest.spyOn(context, 'useDevConsole').mockReturnValue({
      update: jest.fn(),
      dispatch: jest.fn(),
      extensions: mockExtensions(),
      store: '',
    });

    container = mount(
      <DevConsoleProvider host="ws://localhost:8000/extensions/">
        <ExtensionTable {...defaultProps} />
      </DevConsoleProvider>,
    );

    expect(container).toContainReactComponent(ExtensionTableRow);
  });
});
