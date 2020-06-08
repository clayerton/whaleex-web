import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .main {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    overflow: hidden;
  }

  #app {
      background-color: #fafafa;
        min-height: 100%;
        min-width: 100%;
        height: 100%;
    }

    #app > [data-reactroot] { height: 100% } /* Some page needs special background-color, expand this dom to screen height */
`;
