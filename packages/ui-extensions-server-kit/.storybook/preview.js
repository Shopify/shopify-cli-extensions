// import {I18nContext, I18nManager} from '@shopify/react-i18n';
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
    // const i18nManager = useMemo(
    //   () =>
    //     new I18nManager({
    //       locale: "en",
    //       onError(error) {
    //         // eslint-disable-next-line no-console
    //         console.log(error);
    //       },
    //     }, {
    //       // TODO: Translations
    //     }),
    //   [],
    // );
    return (
    <div className={classNames(styles.Theme, storybookStyles.Storybook)}>
    {/* <I18nContext.Provider value={i18nManager}> */}
      <Story />
      {/* </I18nContext.Provider> */}
    </div>
  )},
];