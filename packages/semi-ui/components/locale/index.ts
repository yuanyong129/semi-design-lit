import { LitElement } from 'lit';
import { isString } from '../_utils/is';
import { configProviderContext } from '../config-provider/context';
import type { SemiI18nMessages, SemiLang } from './interface';
import { ContextConsumer } from '@lit/context';
import { localeContext } from './context';
import zhCN from './lang/zh-cn';

export { SemiLocaleProvider } from './locale-provider';
export { localeContext } from './context';

let LOCALE = 'zh-CN';
const I18N_MESSAGES: SemiI18nMessages = {
  'zh-CN': zhCN,
};

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
 * 切换地区语言。仅在未提供 ConfigProvider / LocaleProvider 时生效。
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

/**
 * 获取当前上下文的语言包。
 *
 * 优先级：ConfigProvider.locale > 最近的 LocaleProvider > 全局 useLocale。
 */
export const useI18n = (context: LitElement) => {
  const localeProvider = new ContextConsumer(context, {
    context: localeContext,
    subscribe: true,
  }).value as SemiLang | undefined;

  const configProvider = new ContextConsumer(context, {
    context: configProviderContext,
    subscribe: true,
  }).value;

  const i18nMessage = (): SemiLang =>
    configProvider?.locale ?? localeProvider ?? I18N_MESSAGES[LOCALE] ?? zhCN;

  const message = i18nMessage();
  const locale = message.code ?? message.locale;

  const transform = (key: string, ...args: any[]): string => {
    const keyArray = key.split('.');
    let temp: any = message;

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
