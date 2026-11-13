import { css } from 'lit';

export const imageStyles = css`
  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  .semi-image-wrapper {
    position: relative;
    max-width: 100%;
  }

  .semi-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    background: var(--semi-color-fill-0);
    cursor: zoom-in;
  }

  .semi-image-img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
  }

  .semi-image-error {
    cursor: default;
  }

  .semi-image-placeholder {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      var(--semi-color-fill-0) 25%,
      var(--semi-color-fill-1) 37%,
      var(--semi-color-fill-0) 63%
    );
    background-size: 400% 100%;
    animation: semi-image-shimmer 1.4s ease infinite;
  }

  @keyframes semi-image-shimmer {
    0% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0 50%;
    }
  }

  .semi-image-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    min-height: 120px;
    color: var(--semi-color-text-3);
    font-size: 13px;
    background: var(--semi-color-fill-0);
  }

  .semi-image-fallback semi-icon-close-circle {
    font-size: 28px;
  }

  .semi-image-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .semi-image:hover .semi-image-mask {
    opacity: 1;
  }

  .semi-image-preview {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 48px;
    background: rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(2px);
  }

  .semi-image-preview-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .semi-image-preview-img {
    display: block;
    max-width: 80vw;
    max-height: 80vh;
    object-fit: contain;
    transition: transform 0.2s ease;
    user-select: none;
  }

  .semi-image-preview-toolbar {
    position: absolute;
    bottom: 32px;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(28, 31, 35, 0.9);
    border-radius: 8px;
    transform: translateX(-50%);
  }

  .semi-image-preview-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    padding: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    background: transparent;
    border: 0;
    border-radius: 6px;
    cursor: pointer;
  }

  .semi-image-preview-btn:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  .semi-image-preview-btn:focus-visible {
    outline: 2px solid var(--semi-color-primary-light-active);
    outline-offset: 1px;
  }

  .semi-image-preview-scale {
    min-width: 44px;
    font-size: 12px;
    text-align: center;
  }

  .semi-image-preview-close {
    margin-left: 8px;
  }
`;
