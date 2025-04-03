import { css, unsafeCSS } from "lit";
import { arcoCssvarsPrefix, arcoThemeTag, prefix, transitionDuration1, transitionTimingFunctionLinear } from "../../../style/theme";
import * as token from './token.style';
import { textEllipsis } from "../../../style/mixins";
import { iconHover, iconHoverBg } from "../../../style/mixins/icon-hover";

export const tagPrefixCls = `${prefix}-tag`;

const colors = ['red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'arcoblue', 'purple',
  'pinkpurple', 'magenta', 'gray'];

const upperFirstChar = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const styles = css`
  .${unsafeCSS(tagPrefixCls)} {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: ${unsafeCSS(token.tagSizeDefault)};
    padding: ${unsafeCSS(token.tagPaddingVertical)} ${unsafeCSS(token.tagPaddingHorizontal)};
    color: ${unsafeCSS(token.tagDefaultColorText)};
    font-weight: ${unsafeCSS(token.tagTextFontWeight)};
    font-size: ${unsafeCSS(token.tagSizeDefaultFontSize)};
    line-height: ${unsafeCSS((parseInt(token.tagSizeDefault) - parseInt(token.tagBorderWidth) * 2 - parseInt(token.tagPaddingVertical) * 2) + 'px')};;
    vertical-align: middle;
    border: ${unsafeCSS(token.tagBorderWidth)} ${unsafeCSS(token.tagBorderType)} transparent;
    border-radius: ${unsafeCSS(token.tagBorderRadius)};
    ${textEllipsis()}

    ${iconHover(tagPrefixCls, '12px', '16px')}
    ${iconHoverBg(tagPrefixCls, token.tagDefaultColorBg_hover)}
  }

  .${unsafeCSS(tagPrefixCls)}-checkable {
    cursor: pointer;
    transition: all ${unsafeCSS(transitionDuration1)} ${unsafeCSS(transitionTimingFunctionLinear)};
  }

  .${unsafeCSS(tagPrefixCls)}-checkable:hover {
    background-color: ${unsafeCSS(token.tagColorBgNotChecked_hover)};
  }

  .${unsafeCSS(tagPrefixCls)}-checked {
    background-color: ${unsafeCSS(token.tagDefaultColorBg)};
    border-color: ${unsafeCSS(token.tagDefaultColorBorder)};
  }

  .${unsafeCSS(tagPrefixCls)}-checkable.${unsafeCSS(tagPrefixCls)}-checked:hover {
    background-color: ${unsafeCSS(token.tagDefaultColorBg_hover)};
    border-color: ${unsafeCSS(token.tagDefaultColorBorder_hover)};
  }

  .${unsafeCSS(tagPrefixCls)}-bordered,
  .${unsafeCSS(tagPrefixCls)}-checkable.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-bordered:hover {
    border-color: ${unsafeCSS(token.tagDefaultBorderedColorBorder)};
  }

  /** Size */ 
  .${unsafeCSS(tagPrefixCls)}-size-small {
    height: ${unsafeCSS(token.tagSizeSmall)};
    font-size: ${unsafeCSS(token.tagSizeSmallFontSize)};
    line-height: ${unsafeCSS((parseInt(token.tagSizeSmall) - parseInt(token.tagBorderWidth) * 2) + 'px')};
  }

  .${unsafeCSS(tagPrefixCls)}-size-medium {
    height: ${unsafeCSS(token.tagSizeMedium)};
    font-size: ${unsafeCSS(token.tagSizeMediumFontSize)};
    line-height: ${unsafeCSS((parseInt(token.tagSizeMedium) - parseInt(token.tagBorderWidth) * 2) + 'px')};
  }

  .${unsafeCSS(tagPrefixCls)}-size-large {
    height: ${unsafeCSS(token.tagSizeLarge)};
    font-size: ${unsafeCSS(token.tagSizeLargeFontSize)};
    line-height: ${unsafeCSS((parseInt(token.tagSizeLarge) - parseInt(token.tagBorderWidth) * 2 ) + 'px')};
  }

  .${unsafeCSS(tagPrefixCls)}-hide {
    display: none;
  }

  .${unsafeCSS(tagPrefixCls)}-loading {
    cursor: default;
    opacity: 0.8;
  }

  .${unsafeCSS(tagPrefixCls)}-icon {
    margin-right: ${unsafeCSS(token.tagIconMarginRight)};
    color: ${unsafeCSS(token.tagDefaultColorIcon)};
  }

  .${unsafeCSS(tagPrefixCls)}-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ${unsafeCSS(colors.map(value => {
      return css`
        .${unsafeCSS(tagPrefixCls)}.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)} {
          color: ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}ColorText`])};
          background-color: ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}ColorBg`])};
          border: ${unsafeCSS(token.tagBorderWidth)} ${unsafeCSS(token.tagBorderType)} ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}ColorBorder`])};
    
          ${iconHoverBg(tagPrefixCls, (token as any)[`tag${upperFirstChar(value)}ColorIconBg_hover`])}
        }
    
        .${unsafeCSS(tagPrefixCls)}.${unsafeCSS(tagPrefixCls)}-checkable.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)}:hover {
          background-color: ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}ColorBg_hover`])};
          border-color: ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}ColorBorder_hover`])};
        }
    
        .${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)}.${unsafeCSS(tagPrefixCls)}-bordered,
        .${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)}.${unsafeCSS(tagPrefixCls)}-bordered:hover {
          border-color: ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}BorderedColorBorder`])};
        }
    
        .${unsafeCSS(tagPrefixCls)}.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)} .${unsafeCSS(tagPrefixCls)}-icon,
        .${unsafeCSS(tagPrefixCls)}.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)} .${unsafeCSS(tagPrefixCls)}-close-btn,
        .${unsafeCSS(tagPrefixCls)}.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)} .${unsafeCSS(tagPrefixCls)}-loading-icon {
          color: ${unsafeCSS((token as any)[`tag${upperFirstChar(value)}ColorIcon`])};
        }
      `;
    }).join('\n'))}

  .${unsafeCSS(tagPrefixCls)}.${unsafeCSS(tagPrefixCls)}-custom-color {
    color: ${unsafeCSS(token.tagCustomColorText)};

    ${iconHoverBg(tagPrefixCls, token.tagCustomColorIconBg_hover)}
  }

  .${unsafeCSS(tagPrefixCls)} .${unsafeCSS(tagPrefixCls)}-close-btn {
    margin-left: 4px;
    font-size: 12px;
  }

  .${unsafeCSS(tagPrefixCls)} .${unsafeCSS(tagPrefixCls)}-close-btn ::part(svg) {
    position: relative;
  }

  .${unsafeCSS(tagPrefixCls)} .${unsafeCSS(tagPrefixCls)}-loading-icon {
    margin-left: 4px;
    font-size: 12px;
  }

  ${unsafeCSS(arcoThemeTag)}[arco-theme='dark'] {
    .${unsafeCSS(tagPrefixCls)}-checked {
      color: rgba(255, 255, 255, 0.9);
    }

    ${unsafeCSS(colors.map(value => {
      return css`
        .${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)} {
          background-color: ${unsafeCSS(`rgba(var(${arcoCssvarsPrefix}-${value}-6), 0.2)`)};
    
          ${iconHoverBg(tagPrefixCls, `rgba(var(${arcoCssvarsPrefix}-${value}-6), 0.35)`)};
        }
    
        .${unsafeCSS(tagPrefixCls)}-checkable.${unsafeCSS(tagPrefixCls)}-checked.${unsafeCSS(tagPrefixCls)}-${unsafeCSS(value)}:hover {
          background-color: ${unsafeCSS(`rgba(var(${arcoCssvarsPrefix}-${value}-6), 0.35)`)};
        }
      `;
    }).join('\n'))}
  }

  .${unsafeCSS(tagPrefixCls)}-rtl {
    direction: rtl;

    .${unsafeCSS(tagPrefixCls)} {
      .${unsafeCSS(tagPrefixCls)}-icon {
        margin-right: 0;
        margin-left: ${unsafeCSS(token.tagIconMarginRight)};
      }

      .${unsafeCSS(tagPrefixCls)}-close-btn,
      .${unsafeCSS(tagPrefixCls)}-loading-icon {
        margin-right: 4px;
        margin-left: 0;
      }
    }
  }
`;
