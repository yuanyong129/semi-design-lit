import { css, unsafeCSS } from "lit";
import { getPrefixCls } from "../../../components/_utils/global-config";
import * as token from "./token.style";
import {
  Radius,
  transitionDuration2,
  transitionTimingFunctionStandard
} from "../../style/theme";
export const switchPrefixCls = getPrefixCls('switch');

const switchSizeDefaultGap = ((parseInt(token.switchSizeDefault) - parseInt(token.switchSizeDotDefault)) / 2) + 'px';
const switchSizeSmallGap = ((parseInt(token.switchSizeSmall) - parseInt(token.switchSizeDotSmall)) / 2) + 'px';
const switchSizeDefaultLineGap = ((parseInt(token.switchSizeDefault) - parseInt(token.switchLineSizeDotDefault)) / 2) + 'px';
const switchSizeSmallLineGap = ((parseInt(token.switchSizeSmall) - parseInt(token.switchLineSizeDotSmall)) / 2) + 'px';

export const styles = css`
  .switch-slide-text-enter-from {
    left: -100% !important;
  }

  .switch-slide-text-enter-to {
    left: 8px !important;
  }

  .switch-slide-text-enter-active {
    transition: left ${unsafeCSS(transitionDuration2)} ${unsafeCSS(transitionTimingFunctionStandard)};
  }

  .switch-slide-text-leave-from {
    left: 100% !important;
  }

  .switch-slide-text-leave-to {
    left: ${unsafeCSS((parseInt(token.switchSizeDotDefault) + parseInt(switchSizeDefaultGap) + 6 + 'px'))} !important;
  }

  .switch-slide-text-leave-active {
    transition: left ${unsafeCSS(transitionDuration2)} ${unsafeCSS(transitionTimingFunctionStandard)};
  }

  .${unsafeCSS(switchPrefixCls)} {
    position: relative;
    box-sizing: border-box;
    min-width: ${unsafeCSS(token.switchCircleDefaultWidth)};
    height: ${unsafeCSS(token.switchSizeDefault)};
    padding: 0;
    overflow: hidden;
    line-height: ${unsafeCSS(token.switchSizeDefault)};
    vertical-align: middle;
    background-color: ${unsafeCSS(token.switchColorBg_off)};
    border: none;
    border-radius: ${unsafeCSS((parseInt(token.switchSizeDefault) / 2) + 'px')};
    outline: none;
    cursor: pointer;
    transition: background-color ${unsafeCSS(transitionDuration2)}
      ${unsafeCSS(transitionTimingFunctionStandard)};
  }

  .${unsafeCSS(switchPrefixCls)}-handle {
    position: absolute;
    top: ${unsafeCSS(switchSizeDefaultGap)};
    left: ${unsafeCSS(switchSizeDefaultGap)};
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${unsafeCSS(token.switchSizeDotDefault)};
    height: ${unsafeCSS(token.switchSizeDotDefault)};
    color: ${unsafeCSS(token.switchColorDotIcon_off)};
    font-size: 12px;
    background-color: ${unsafeCSS(token.switchColorDotBg)};
    border-radius: 50%;
    transition: all ${unsafeCSS(transitionDuration2)} ${unsafeCSS(transitionTimingFunctionStandard)};
  }

  .${unsafeCSS(switchPrefixCls)}-checked {
    background-color: ${unsafeCSS(token.switchColorBg_on)};
  }

  .${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    left: calc(100% - ${unsafeCSS(token.switchSizeDotDefault)} - ${unsafeCSS(switchSizeDefaultGap)});
    color: ${unsafeCSS(token.switchColorDotIcon_on)};
  }

  .${unsafeCSS(switchPrefixCls)}[disabled] .${unsafeCSS(switchPrefixCls)}-handle {
    color: ${unsafeCSS(token.switchColorDotIcon_off_disabled)};
  }

  .${unsafeCSS(switchPrefixCls)}[disabled].${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    color: ${unsafeCSS(token.switchColorDotIcon_on_disabled)};
  }

  .${unsafeCSS(switchPrefixCls)}[disabled] .${unsafeCSS(switchPrefixCls)}-handle {
    color: ${unsafeCSS(token.switchColorDotIcon_off_disabled)};
  }

  .${unsafeCSS(switchPrefixCls)}[disabled].${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    color: ${unsafeCSS(token.switchColorDotIcon_on_disabled)};
  }

  .${unsafeCSS(switchPrefixCls)}-text-holder {
    margin: 0 8px 0 calc(${unsafeCSS(token.switchSizeDotDefault)} + ${unsafeCSS(switchSizeDefaultGap)} + 6px);
    font-size: ${unsafeCSS(token.switchFontSizeText)};
    opacity: 0;
  }

  .${unsafeCSS(switchPrefixCls)}-text {
    position: absolute;
    top: 0;
    left: calc(${unsafeCSS(token.switchSizeDotDefault)} + ${unsafeCSS(switchSizeDefaultGap)} + 6px);
    color: ${unsafeCSS(token.switchColorText_off)};
    font-size: ${unsafeCSS(token.switchFontSizeText)};
  }

  .${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-text-holder {
    margin: 0 calc(${unsafeCSS(token.switchSizeDotDefault)} + ${unsafeCSS(switchSizeDefaultGap)} + 6px) 0 8px;
  }

  .${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-text {
    left: 8px;
    color: ${unsafeCSS(token.switchColorText_on)};
  }

  /** Disabled */ 
  .${unsafeCSS(switchPrefixCls)}[disabled] {
    background-color: ${unsafeCSS(token.switchColorBg_off_disabled)};
    cursor: not-allowed;
  }

  .${unsafeCSS(switchPrefixCls)}[disabled] .${unsafeCSS(switchPrefixCls)}-text {
    color: ${unsafeCSS(token.switchColorText_off_disabled)};
  }

  .${unsafeCSS(switchPrefixCls)}[disabled].${unsafeCSS(switchPrefixCls)}-checked {
    background-color: ${unsafeCSS(token.switchColorBg_on_disabled)};
  }

  .${unsafeCSS(switchPrefixCls)}[disabled].${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-text {
    color: ${unsafeCSS(token.switchColorText_on_disabled)};
  }

  /** Loading */ 
  .${unsafeCSS(switchPrefixCls)}-loading {
    background-color: ${unsafeCSS(token.switchColorBg_off_loading)};
  }

  .${unsafeCSS(switchPrefixCls)}-loading .${unsafeCSS(switchPrefixCls)}-handle {
    color: ${unsafeCSS(token.switchColorDotIcon_off_loading)};
  }

  .${unsafeCSS(switchPrefixCls)}-loading .${unsafeCSS(switchPrefixCls)}-text {
    color: ${unsafeCSS(token.switchColorText_off_loading)};
  }

  .${unsafeCSS(switchPrefixCls)}-loading.${unsafeCSS(switchPrefixCls)}-checked {
    background-color: ${unsafeCSS(token.switchColorBg_on_loading)};
  }

  .${unsafeCSS(switchPrefixCls)}-loading.${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    color: ${unsafeCSS(token.switchColorDotIcon_on_loading)};
  }

  .${unsafeCSS(switchPrefixCls)}-loading.${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-text {
    color: ${unsafeCSS(token.switchColorText_on_loading)};
  }

  .${unsafeCSS(switchPrefixCls)}-small {
    min-width: ${unsafeCSS(token.switchCircleSmallWidth)};
    height: ${unsafeCSS(token.switchSizeSmall)};
    line-height: ${unsafeCSS(token.switchSizeSmall)};
  }

  .${unsafeCSS(switchPrefixCls)}-small.${unsafeCSS(switchPrefixCls)}-checked {
    padding-left: -${unsafeCSS(switchSizeSmallGap)};
  }

  .${unsafeCSS(switchPrefixCls)}-small .${unsafeCSS(switchPrefixCls)}-handle {
    top: ${unsafeCSS(switchSizeSmallGap)};
    left: ${unsafeCSS(switchSizeSmallGap)};
    width: ${unsafeCSS(token.switchSizeDotSmall)};
    height: ${unsafeCSS(token.switchSizeDotSmall)};
    border-radius: calc(${unsafeCSS(token.switchSizeSmall)} / 2);

    .${unsafeCSS(switchPrefixCls)}-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.66667);
    }
  }

  .${unsafeCSS(switchPrefixCls)}-small.${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    left: calc(100% - ${unsafeCSS(token.switchSizeDotSmall)} - ${unsafeCSS(switchSizeSmallGap)});
  }

  /** Round */ 
  .${unsafeCSS(switchPrefixCls)}-type-round {
    min-width: ${unsafeCSS(token.switchRoundDefaultWidth)};
    border-radius: ${unsafeCSS(Radius.radiusSmall)};
  }

  .${unsafeCSS(switchPrefixCls)}-type-round .${unsafeCSS(switchPrefixCls)}-handle {
    border-radius: 2px;
  }

  .${unsafeCSS(switchPrefixCls)}-type-round.${unsafeCSS(switchPrefixCls)}-small {
    min-width: ${unsafeCSS(token.switchRoundSmallWidth)};
    height: ${unsafeCSS(token.switchSizeSmall)};
    line-height: ${unsafeCSS(token.switchSizeSmall)};
    border-radius: 2px;
  }

  .${unsafeCSS(switchPrefixCls)}-type-round.${unsafeCSS(switchPrefixCls)}-small .${unsafeCSS(switchPrefixCls)}-handle {
    border-radius: 1px;
  }

  /** Line */
  .${unsafeCSS(switchPrefixCls)}-type-line {
    min-width: ${unsafeCSS(token.switchLineDefaultWidth)};
    overflow: unset;
    background-color: transparent;

    &::after {
      display: block;
      width: 100%;
      height: ${unsafeCSS(token.switchLineHeightBgLine)};
      background-color: ${unsafeCSS(token.switchColorBg_off)};
      border-radius: calc(${unsafeCSS(token.switchLineHeightBgLine)} / 2);
      transition: background-color ${unsafeCSS(transitionDuration2)}
        ${unsafeCSS(transitionTimingFunctionStandard)};
      content: '';
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line .${unsafeCSS(switchPrefixCls)}-handle {
    top: ${unsafeCSS(switchSizeDefaultLineGap)};
    left: 0;
    width: ${unsafeCSS(token.switchLineSizeDotDefault)};
    height: ${unsafeCSS(token.switchLineSizeDotDefault)};
    background-color: ${unsafeCSS(token.switchColorDotBg)};
    border-radius: calc(${unsafeCSS(token.switchLineSizeDotDefault)} / 2);
    box-shadow: 0 1px 3px ${unsafeCSS(token.switchLineColorDotShadow)};
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-checked {
    background-color: transparent;

    &::after {
      background-color: ${unsafeCSS(token.switchColorBg_on)};
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-custom-color {
    --custom-color: ${unsafeCSS(token.switchColorBg_off)};

    &::after {
      background-color: var(--custom-color);
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-custom-color.${unsafeCSS(switchPrefixCls)}-checked {
    --custom-color: ${unsafeCSS(token.switchColorBg_on)};
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    left: calc(100% - ${unsafeCSS(token.switchLineSizeDotDefault)});
  }

  /** Disabled */ 
  .${unsafeCSS(switchPrefixCls)}-type-line[disabled] {
    background-color: transparent;
    cursor: not-allowed;

    &::after {
      background-color: ${unsafeCSS(token.switchColorBg_off_disabled)};
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line[disabled].${unsafeCSS(switchPrefixCls)}-checked {
    background-color: transparent;

    &::after {
      background-color: ${unsafeCSS(token.switchColorBg_on_disabled)};
    }
  }

  /** Loading */ 
  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-loading {
    background-color: transparent;

    &::after {
      background-color: ${unsafeCSS(token.switchColorBg_off_loading)};
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-loading.${unsafeCSS(switchPrefixCls)}-checked {
    background-color: transparent;

    &::after {
      background-color: ${unsafeCSS(token.switchColorBg_on_loading)};
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-small {
    min-width: ${unsafeCSS(token.switchLineSmallWidth)};
    height: ${unsafeCSS(token.switchSizeSmall)};
    line-height: ${unsafeCSS(token.switchSizeSmall)};
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-small.${unsafeCSS(switchPrefixCls)}-checked {
    padding-left: -${unsafeCSS(switchSizeSmallLineGap)};
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-small .${unsafeCSS(switchPrefixCls)}-handle {
    top: ${unsafeCSS(switchSizeSmallLineGap)};
    width: ${unsafeCSS(token.switchLineSizeDotSmall)};
    height: ${unsafeCSS(token.switchLineSizeDotSmall)};
    border-radius: calc(${unsafeCSS(token.switchSizeSmall)} / 2);

    .${unsafeCSS(switchPrefixCls)}-icon {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  .${unsafeCSS(switchPrefixCls)}-type-line.${unsafeCSS(switchPrefixCls)}-small.${unsafeCSS(switchPrefixCls)}-checked .${unsafeCSS(switchPrefixCls)}-handle {
    left: calc(
      100% - ${unsafeCSS(token.switchLineSizeDotSmall)} - ${unsafeCSS(switchSizeSmallLineGap)}
    );
  }
`;