import { createContext } from '@lit/context';
import { Size } from '../_utils/constant';
import { SemiLang } from '../locale/interface';
import { Slots } from '../_utils/dom';

export interface ConfigProvider {
  slots: Slots;
  prefixCls?: string;
  locale?: SemiLang;
  size?: Size;
  themeMode?: 'light' | 'dark';
  updateAtScroll?: boolean;
  scrollToClose?: boolean;
  exchangeTime?: boolean;
  rtl?: boolean;
}

export const configProviderContextKey = Symbol('SemiConfigProvider');

export const configProviderContext = createContext<ConfigProvider>(configProviderContextKey);
