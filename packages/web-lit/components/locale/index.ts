import { LitElement } from 'lit';
import { isString } from '../_utils/is';
import { configProviderContext } from '../config-provider/context';
import type { SemiI18nMessages, SemiLang } from './interface';
import zhCN from './lang/zh-cn';
import { ContextConsumer } from '@lit/context';

let LOCALE = 'zh-CN';
const I18N_MESSAGES :SemiI18nMessages = ({
  'zh-CN': zhCN,
});

/**
 * 添加地区语言包。添加过后的语言包可以通过 `useLocale` 使用
 * @param messages 需要添加的地区语言数据
 * @param options
 */
export const addI18nMessages = (
  messages: SemiI18nMessages,
  options?: {
    overwrite?: boolean;
  }
) => {
  for (const key of Object.keys(messages)) {
    if (!I18N_MESSAGES[key] || options?.overwrite) {
      I18N_MESSAGES[key] = messages[key];
    }
  }
};

/**
 * 切换地区语言。仅在未提供ConfigProvider时生效。
 * @param locale
 */
export const useLocale = (locale: string) => {
  if (!I18N_MESSAGES[locale]) {
    // eslint-disable-next-line no-console
    console.warn(`use ${locale} failed! Please add ${locale} first`);
    return;
  }
  LOCALE = locale;
};

/**
 * 获取当前的地区语言
 */
export const getLocale = () => {
  return LOCALE;
};

// 仅内部使用
export const useI18n = (context: LitElement) => {
  const configProvider = new ContextConsumer(context, {context: configProviderContext}).value;
  const i18nMessage = (
    () => configProvider?.locale ?? I18N_MESSAGES[LOCALE]
  );
  const locale = i18nMessage().locale;

  const transform = (key: string, ...args: any[]): string => {
    const keyArray = key.split('.');
    let temp: any = i18nMessage();

    for (const keyItem of keyArray) {
      if (!temp[keyItem]) {
        return key;
      }
      temp = temp[keyItem];
    }
    if (isString(temp)) {
      if (args.length > 0) {
        return temp.replace(/{(\d+)}/g, (sub, index) => args[index] ?? sub);
      }

      return temp;
    }
    return temp;
  };

  return {
    i18nMessage,
    locale,
    t: transform,
  };
};