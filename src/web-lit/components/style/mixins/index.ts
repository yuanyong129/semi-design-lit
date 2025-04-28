import { css } from "lit";

export const textEllipsis = () => {
  return css`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `;
}