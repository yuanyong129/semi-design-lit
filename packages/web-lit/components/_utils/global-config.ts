// const COMPONENT_PREFIX = 'A';
const CLASS_PREFIX = 'semi';
// const GLOBAL_CONFIG_NAME = '$semi';

export const getPrefixCls = (componentName?: string) => {
  return componentName ? `${CLASS_PREFIX}-${componentName}` : CLASS_PREFIX;
}