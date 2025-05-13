import { css, unsafeCSS } from "lit";
import { prefix, transitionDuration1, transitionDuration3, transitionTimingFunctionLinear, transitionTimingFunctionOvershoot } from "../../style/theme";
import tokenStyle from './token.style';
import component from "../../style/theme/component";
import { iconHover } from "../../style/mixins/icon-hover";
import { arcoCssvarsPrefix, arcoThemeTag, ColorTransparent } from '../../style/theme/global';

const radioPrefixCls = `${prefix}-radio`;

export const styles = css`

  .${unsafeCSS(radioPrefixCls)} > input[type='radio'],
  .${unsafeCSS(radioPrefixCls)}-button > input[type='radio'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
  }

  .${unsafeCSS(radioPrefixCls)} > input[type='radio']:focus + .${unsafeCSS(prefix)}-radio-icon-hover::before,
  .${unsafeCSS(radioPrefixCls)}-button > input[type='radio']:focus + .${unsafeCSS(prefix)}-radio-icon-hover::before {
    background-color:  ${ unsafeCSS(component["icon-hover-color-bg"]) };
  }

  ${iconHover(radioPrefixCls, tokenStyle["radio-layout-height"], tokenStyle["radio-size-mask-height"])}

  .${unsafeCSS(radioPrefixCls)} {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding-left: ${(parseInt(tokenStyle["radio-size-mask-height"]) / 2) - (parseInt(tokenStyle["radio-layout-height"]) / 2)}px;
    font-size: ${unsafeCSS(tokenStyle["radio-font-text-size"])};
    line-height: unset;
    cursor: pointer;
  }

  /* radio circle */
  .${unsafeCSS(radioPrefixCls)}-label { 
    margin-left: ${unsafeCSS(tokenStyle["radio-margin-text-left"])};
    color: ${unsafeCSS(tokenStyle["radio-color-text"])};
  }

  .${unsafeCSS(radioPrefixCls)}-icon {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: ${unsafeCSS(tokenStyle["radio-layout-height"])};
    height: ${unsafeCSS(tokenStyle["radio-layout-height"])};
    line-height: ${unsafeCSS(tokenStyle["radio-layout-height"])};
    border: ${unsafeCSS(tokenStyle["radio-border-width"])} solid ${unsafeCSS(tokenStyle["radio-color-border"])};
    border-radius: ${unsafeCSS(tokenStyle["radio-border-radius"])};
  }

  .${unsafeCSS(radioPrefixCls)}-icon::after {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    box-sizing: border-box;
    width: ${unsafeCSS(parseInt(tokenStyle["radio-layout-height"]) - parseInt(tokenStyle["radio-border-width"]) * 2)}px;
    height: ${unsafeCSS(parseInt(tokenStyle["radio-layout-height"]) - parseInt(tokenStyle["radio-border-width"]) * 2)}px;
    background-color: ${unsafeCSS(tokenStyle["radio-color-bg"])};
    border-radius: ${unsafeCSS(tokenStyle["radio-border-radius"])};
    transform: scale(1);
    transition: transform ${unsafeCSS(transitionDuration3)}
      ${transitionTimingFunctionOvershoot};
    content: '';
  }

  .${unsafeCSS(radioPrefixCls)}:hover .${unsafeCSS(radioPrefixCls)}-icon {
    border-color: ${unsafeCSS(tokenStyle["radio-color-border_hover"])};
  }

  .${unsafeCSS(radioPrefixCls)}-checked .${unsafeCSS(radioPrefixCls)}-icon {
    background-color: ${unsafeCSS(tokenStyle["radio-color-bg_checked"])};
    border-color: ${unsafeCSS(tokenStyle["radio-color-bg_checked"])};
  }

  .${unsafeCSS(radioPrefixCls)}-checked .${unsafeCSS(radioPrefixCls)}-icon::after {
    background-color: var(${unsafeCSS(arcoCssvarsPrefix)}-color-white);
    transform: scale(0.4);
  }

  .${unsafeCSS(radioPrefixCls)}-checked:hover .${unsafeCSS(radioPrefixCls)}-icon {
    border-color: ${unsafeCSS(tokenStyle["radio-color-bg_checked"])};
  }

  .${unsafeCSS(radioPrefixCls)}-disabled {
    cursor: not-allowed;
  }

  .${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(prefix)}-radio-icon-hover {
    cursor: not-allowed;
  }

  .${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-label {
    color: ${unsafeCSS(tokenStyle["radio-color-text_disabled"])};
  }

  .${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-icon {
    border-color: ${unsafeCSS(tokenStyle["radio-color-border_disabled"])};
  }

  .${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-icon::after {
    background-color: ${unsafeCSS(tokenStyle["radio-color-bg_disabled"])};
  }

  .${unsafeCSS(radioPrefixCls)}-disabled:hover .${unsafeCSS(radioPrefixCls)}-icon {
    border-color: ${unsafeCSS(tokenStyle["radio-color-border_disabled"])};
  }

  .${unsafeCSS(radioPrefixCls)}-checked.${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-icon,
  .${unsafeCSS(radioPrefixCls)}-checked.${unsafeCSS(radioPrefixCls)}-disabled:hover .${unsafeCSS(radioPrefixCls)}-icon {
    background-color: ${unsafeCSS(tokenStyle["radio-color-bg_checked_disabled"])};
    border-color: ${unsafeCSS(ColorTransparent)};
  }

  .${unsafeCSS(radioPrefixCls)}-checked.${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-icon::after {
    background-color: ${unsafeCSS(tokenStyle["radio-color-dot-bg_checked_disabled"])};
  }

  .${unsafeCSS(radioPrefixCls)}-checked.${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-label {
    color: ${unsafeCSS(tokenStyle["radio-color-text_checked_disabled"])};
  }

  .${unsafeCSS(radioPrefixCls)}:hover .${unsafeCSS(prefix)}-radio-icon-hover::before {
    background-color: ${unsafeCSS(tokenStyle["radio-mask-bg-color-bg"])};
  }

  /* group type */
  .${unsafeCSS(radioPrefixCls)}-group {
    display: inline-block;
    box-sizing: border-box;

     .${unsafeCSS(radioPrefixCls)} {
      margin-right: ${unsafeCSS(tokenStyle["radio-group-margin-right"])};
    }

    /* button type */
    &-button {
      display: inline-flex;
      padding: ${parseInt(tokenStyle["radio-button-spacing"]) / 2}px;
      line-height: ${parseInt(tokenStyle["radio-size-default-height"]) - parseInt(tokenStyle["radio-button-spacing"]) * 2}px;
      background-color: ${unsafeCSS(tokenStyle["radio-group-button-color-bg"])};
      border-radius: ${unsafeCSS(tokenStyle["radio-button-bg-border-radius"])};
    }
  }

  .${unsafeCSS(radioPrefixCls)}-button {
    position: relative;
    display: inline-block;
    margin: ${parseInt(tokenStyle["radio-button-spacing"]) / 2}px;
    color: ${unsafeCSS(tokenStyle["radio-button-color-text"])};
    font-size: ${unsafeCSS(tokenStyle["radio-font-text-size"])};
    line-height: ${parseInt(tokenStyle["radio-size-default-height"]) - parseInt(tokenStyle["radio-button-spacing"]) * 2}px;
    background-color: ${unsafeCSS(tokenStyle["radio-button-color-bg"])};
    border-radius: ${unsafeCSS(tokenStyle["radio-button-border-radius"])};
    cursor: pointer;
    transition: all ${unsafeCSS(transitionDuration1)} ${unsafeCSS(transitionTimingFunctionLinear)};

    &-content {
      position: relative;
      display: block;
      padding: 0 ${unsafeCSS(tokenStyle["radio-button-padding-horizontal"])};
    }

    /* 按钮之间的分割线 */
    &:not(:first-of-type)::before {
      position: absolute;
      top: 50%;
      left: -${((parseInt(tokenStyle["radio-button-spacing"]) - parseInt(tokenStyle["radio-button-size-separator-width"])) / 2) - parseInt(tokenStyle["radio-button-size-separator-width"])}px;
      display: block;
      width: ${unsafeCSS(tokenStyle["radio-button-size-separator-width"])};
      height: ${unsafeCSS(tokenStyle["radio-button-size-separator-height"])};
      background-color: ${unsafeCSS(tokenStyle["radio-button-color-separator-bg"])};
      transform: translateY(-50%);
      transition: all ${unsafeCSS(transitionDuration1)} ${unsafeCSS(transitionTimingFunctionLinear)};
      content: '';
    }

    /* 被选中的按钮不需要左右的分割线 */
    &:hover::before,
    &:hover + &::before,
    & .${unsafeCSS(radioPrefixCls)}-checked::before,
    & .${unsafeCSS(radioPrefixCls)}-checked + &::before {
      opacity: 0;
    }

    &:hover {
      color: ${unsafeCSS(tokenStyle["radio-button-color-text_hover"])};
      background-color: ${unsafeCSS(tokenStyle["radio-button-color-bg_hover"])};
    }

    & .${unsafeCSS(radioPrefixCls)}-checked {
      color: ${unsafeCSS(tokenStyle["radio-button-color-text_active"])};
      background-color: ${unsafeCSS(tokenStyle["radio-button-color-bg_active"])};
    }

    & .${unsafeCSS(radioPrefixCls)}-disabled {
      color: ${unsafeCSS(tokenStyle["radio-button-color-text_disabled"])};
      background-color: ${unsafeCSS(tokenStyle["radio-button-color-bg_disabled"])};
      cursor: not-allowed;
    }

    & .${unsafeCSS(radioPrefixCls)}-disabled .${unsafeCSS(radioPrefixCls)}-checked {
      color: ${unsafeCSS(tokenStyle["radio-button-color-text_checked_disabled"])};
      background-color: ${unsafeCSS(tokenStyle["radio-button-color-bg_checked_disabled"])};
    }
  }

  /* size small default large huge */
  .${unsafeCSS(radioPrefixCls)}-group {
    &-size-small {
      line-height: ${unsafeCSS(tokenStyle["radio-size-small-height"])};

      & .${unsafeCSS(radioPrefixCls)}-group-button,
       .${unsafeCSS(radioPrefixCls)}-button {
        font-size: ${unsafeCSS(tokenStyle["radio-font-text-size_small"])};
        line-height: ${parseInt(tokenStyle["radio-size-small-height"]) - parseInt(tokenStyle["radio-button-spacing"]) * 2}px;
      }
    }

    &-size-large {
      line-height: ${unsafeCSS(tokenStyle["radio-size-large-height"])};

      & .${unsafeCSS(radioPrefixCls)}-group-button,
       .${unsafeCSS(radioPrefixCls)}-button {
        font-size: ${unsafeCSS(tokenStyle["radio-font-text-size_large"])};
        line-height: ${parseInt(tokenStyle["radio-size-large-height"]) - parseInt(tokenStyle["radio-button-spacing"]) * 2}px;
      }
    }

    &-size-mini {
      line-height: ${unsafeCSS(tokenStyle["radio-size-mini-height"])};

      & .${unsafeCSS(radioPrefixCls)}-group-button,
       .${unsafeCSS(radioPrefixCls)}-button {
        font-size: ${unsafeCSS(tokenStyle["radio-font-text-size_mini"])};
        line-height: ${parseInt(tokenStyle["radio-size-mini-height"]) - parseInt(tokenStyle["radio-button-spacing"]) *2}px;
      }
    }
  }

  /* vertical direction */
  .${unsafeCSS(radioPrefixCls)}-group-direction-vertical {
    /* default radio */
     .${unsafeCSS(radioPrefixCls)} {
      display: flex;
      margin-right: 0;
      line-height: ${unsafeCSS(tokenStyle["radio-group-size-line-height_vertical"])};
    }
  }

  /* dark mode */
  ${unsafeCSS(arcoThemeTag)}[arco-theme='dark'] {
     .${unsafeCSS(radioPrefixCls)}-button .${unsafeCSS(radioPrefixCls)}-checked,
     .${unsafeCSS(radioPrefixCls)}-button:not( .${unsafeCSS(radioPrefixCls)}-disabled):hover {
      background-color: var(${unsafeCSS(arcoCssvarsPrefix)}-color-fill-3);
    }

     .${unsafeCSS(radioPrefixCls)}-button::after {
      background-color: var(${unsafeCSS(arcoCssvarsPrefix)}-color-bg-3);
    }
  }
`;