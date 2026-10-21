import { TemplateResult } from 'lit';

export type Data = Record<string, any>;
type RenderFunction = <T = any>(_: T) => TemplateResult;
export type RenderContent = string | TemplateResult | RenderFunction;