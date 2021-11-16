import styles from '../src/styles/theme.module.scss';
import storybookStyles from './styles.module.scss';
import {classNames} from '../src/utilities';
import {I18nContext, I18nManager} from '@shopify/react-i18n';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
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
  docs: {
    source: {
      state: 'open',
    },
  },
<<<<<<< HEAD
}

const i18nManager = new I18nManager({locale: 'en'})
=======
};

const i18nManager = new I18nManager({locale: 'en'});
>>>>>>> de0db33 (wip: troubleshooting checkboxes)

export const decorators = [
  (Story) => (
    <I18nContext.Provider value={i18nManager}>
      <div className={classNames(styles.Theme, storybookStyles.Storybook)}>
        <Story />
      </div>
    </I18nContext.Provider>
  ),
];