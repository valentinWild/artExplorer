<template>
    <div class="circular-progress">
      <svg class="progress-ring" :width="size" :height="size">
        <circle
          class="progress-ring__circle"
          :stroke="backgroundStroke"
          :stroke-width="stroke"
          :r="radius"
          :cx="size / 2"
          :cy="size / 2"
        />
        <circle
          class="progress-ring__circle"
          :stroke="foregroundStroke"
          :stroke-width="stroke"
          :r="radius"
          :cx="size / 2"
          :cy="size / 2"
          :style="{ strokeDasharray: circumference, strokeDashoffset: offset }"
        />
      </svg>
      <div class="progress-text">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CircularProgress",
    props: {
      percentage: {
        type: Number,
        required: true,
      },
      size: {
        type: Number,
        default: 150,
      },
      stroke: {
        type: Number,
        default: 10,
      },
      backgroundStroke: {
        type: String,
        default: "#e6e6e6",
      },
      foregroundStroke: {
        type: String,
        default: "#00FF00",
      },
    },
    computed: {
      radius() {
        return (this.size - this.stroke) / 2;
      },
      circumference() {
        return 2 * Math.PI * this.radius;
      },
      offset() {
        return this.circumference - (this.percentage / 100) * this.circumference;
      },
    },
  };
  </script>
  
  <style>
  .circular-progress {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress-ring {
    transform: rotate(-90deg);
  }
  .progress-ring__circle {
    fill: transparent;
  }
  .progress-text {
    position: absolute;
    top: calc(50% - 0.9rem);
    left: calc(50% -0.5rem);
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    color: #ffff !important;
  }
  </style>
  