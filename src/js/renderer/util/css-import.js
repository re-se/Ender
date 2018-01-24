import hook from 'css-modules-require-hook'
import store from '../main/store'
import engine from '../main/engine'

export default function() {
  hook({
    rootDir: engine.getVar('config.basePath'),
    generateScopedName: '[local]',
    append: [
      // Rewrite css urls
      // require('postcss-url')({
      //   url: function (url, decl, from, dirname, to, options, result) {
      //     return path.join(root, dirname, url)
      //   }
      // })
      (css, result) => {
        css.exports = css.source.input.css
      },
    ],
    processCss: function(css) {
      if (!document || !document.head) {
        return css
      }
    },
  })
}
