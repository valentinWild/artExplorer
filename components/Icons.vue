<template>
    <div v-if="type === 'happy'">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13Z"></path>
            <path d="M3.7 8c.5 1.8 2.5 2.9 4.3 2.4c1.1-.4 2-1.3 2.3-2.4M4.8 5.45a.25.25 0 0 1 0-.5m0 .5a.25.25 0 0 0 0-.5m4.4.5a.25.25 0 0 1 0-.5m0 .5a.25.25 0 0 0 0-.5"></path>
        </g>
        </svg>
    </div>
    <div v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13Z"></path>
          <path d="M3.7 10.5C4.2 8.7 6.1 7.6 8 8.1c1.1.3 2 1.2 2.4 2.4M4.85 5.45a.25.25 0 0 1 0-.5m0 .5a.25.25 0 0 0 0-.5m4.4.5a.25.25 0 0 1 0-.5m0 .5a.25.25 0 0 0 0-.5"></path>
        </g>
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Icons',
    props: {
      type: {
        type: String,
        required: true
      }
    }
  }
  </script>
  