import { createContext } from '@lit/context';
import { Size } from '../_utils/constant';
import { ArcoLang } from '../locale/interface';
import { Slots } from '../_utils/dom';

export interface ConfigProvider {
  slots: Slots;
  prefixCls?: string;
  locale?: ArcoLang;
  size?: Size;
  updateAtScroll?: boolean;
  scrollToClose?: boolean;
  exchangeTime?: boolean;
  rtl?: boolean;
}

export const configProviderContextKey = Symbol('ArcoConfigProvider');

export const configProviderContext = createContext<ConfigProvider>(configProviderContextKey);
