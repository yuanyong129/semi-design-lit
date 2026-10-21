import { createContext } from '@lit/context';
import type { SemiLang } from './interface';

export const localeContextKey = Symbol('SemiLocaleProvider');

export const localeContext = createContext<SemiLang>(localeContextKey);
