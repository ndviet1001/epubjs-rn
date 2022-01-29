export const renditionEmbeddedScripts = `
  <script>${process.env.BABEL_POLYFILL}</script>
  <script>${process.env.EPUBJS}</script>
  <script>${process.env.BRIDGE}</script>
`;
