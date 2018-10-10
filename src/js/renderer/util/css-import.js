import hook from 'css-modules-require-hook'
import store from '../main/store'
import engine from '../main/engine'
import less from 'less'

export default function() {
  hook({
    extensions: ['.less'],
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
    preprocessCss: (css, path) => {
      if (path.endsWith('.less')) {
        less.render(css, { sync: true }, (e, result) => {
          css = result.css
        })
        return css
      }
      return css
    },
    processCss: function(css) {
      if (!document || !document.head) {
        return css
      }
    },
  })
}
