import { createContext } from '@lit/context';
import { Size } from '../_utils/constant';
import { SemiLang } from '../locale/interface';
import { Slots } from '../_utils/dom';

export type LayoutDirection = 'ltr' | 'rtl';

export interface ConfigProvider {
  slots: Slots;
  prefixCls?: string;
  locale?: SemiLang;
  size?: Size;
  themeMode?: 'light' | 'dark';
  direction?: LayoutDirection;
  rtl?: boolean;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  timeZone?: string | number;
  updateAtScroll?: boolean;
  scrollToClose?: boolean;
  exchangeTime?: boolean;
}

export const configProviderContextKey = Symbol('SemiConfigProvider');

export const configProviderContext = createContext<ConfigProvider>(configProviderContextKey);
