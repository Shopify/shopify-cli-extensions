import styles from '../src/styles/theme.module.scss';
import storybookStyles from './styles.module.scss';
import {classNames} from '../src/utilities';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: '#38393a',
      },
      {
        name: 'white',
        value: '#000000',
      },
    ],
  },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => {
    return (
    <div className={classNames(styles.Theme, storybookStyles.Storybook)}>
      <Story />
    </div>
  )},
];