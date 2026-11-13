import { css } from 'lit';

export const carouselStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  .semi-carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: var(--semi-color-fill-0);
    border-radius: var(--semi-border-radius-medium);
    touch-action: pan-y;
  }

  .semi-carousel-viewport {
    position: relative;
    width: 100%;
    height: 100%;
  }

  ::slotted(*) {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity var(--semi-carousel-speed, 400ms) ease;
    pointer-events: none;
  }

  ::slotted(.semi-carousel-item-active) {
    z-index: 1;
    opacity: 1;
    pointer-events: auto;
  }

  .semi-carousel-arrow {
    position: absolute;
    top: 50%;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    color: #fff;
    font-size: 18px;
    background: rgba(0, 0, 0, 0.32);
    border: 0;
    border-radius: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transition: opacity 0.2s ease, background 0.2s ease;
  }

  .semi-carousel-arrow:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .semi-carousel-arrow:focus-visible {
    outline: 2px solid var(--semi-color-primary-light-active);
    outline-offset: 2px;
  }

  .semi-carousel-arrow-left {
    left: 16px;
  }

  .semi-carousel-arrow-right {
    right: 16px;
  }

  .semi-carousel-arrow-hover .semi-carousel-arrow {
    opacity: 0;
  }

  .semi-carousel-arrow-hover:hover .semi-carousel-arrow,
  .semi-carousel-arrow-hover:focus-within .semi-carousel-arrow {
    opacity: 1;
  }

  .semi-carousel-indicators {
    position: absolute;
    bottom: 16px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateX(-50%);
  }

  .semi-carousel-indicators-left {
    left: 24px;
    transform: none;
  }

  .semi-carousel-indicators-center {
    left: 50%;
  }

  .semi-carousel-indicators-right {
    right: 24px;
    left: auto;
    transform: none;
  }

  .semi-carousel-indicator {
    display: block;
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    padding: 0;
    background: rgba(255, 255, 255, 0.55);
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    transition: width 0.2s ease, background 0.2s ease;
  }

  .semi-carousel-indicator:hover {
    background: rgba(255, 255, 255, 0.85);
  }

  .semi-carousel-indicator:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .semi-carousel-indicator-active {
    width: 20px;
    background: #fff;
    border-radius: 4px;
  }

  .semi-carousel-indicators-line .semi-carousel-indicator {
    width: 20px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.45);
  }

  .semi-carousel-indicators-line .semi-carousel-indicator-active {
    width: 32px;
    background: #fff;
  }

  .semi-carousel-slider {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    height: 4px;
    background: rgba(255, 255, 255, 0.25);
  }

  .semi-carousel-slider-bar {
    height: 100%;
    background: #fff;
    transition: width var(--semi-carousel-speed, 400ms) ease;
  }
`;
