import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import uglify from 'rollup-plugin-uglify'
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import csso from 'postcss-csso';
import { minify } from 'uglify-es'

const isProduction = process.env.NODE_ENV === `production`
const isDevelopment = process.env.NODE_ENV === `development`

function createConfig(entry, output, name) {

  const libPath = (isDevelopment 
        ? `dist/${output}.js` 
        : `dist/${output}.min.js`)

  const babelConfig = {
    'compact': false,
    'babelrc': false,
    'presets': [ 
      [
        // env preset https://github.com/babel/babel-preset-env
        'env', 
        // let rollup take care of modules 
        { 'modules': false } 
      ]
    ],
    'plugins': [
      // let rollup bundle helpers once
      // see https://github.com/rollup/rollup-plugin-babel#helpers
      'external-helpers'  
    ]
  }
  
    
  const sassConfig = {
    include: [ '**/*.css', '**/*.scss' ],
    options: {includePaths: ['node_modules']},
    processor: css => postcss((isDevelopment
                        ? [autoprefixer()]
                        : [autoprefixer(), csso()]))
                      .process(css)
                      .then(result => result.css)
  }
  
  if (isProduction) {
    sassConfig.output = `dist/${output}.min.css`
  } else {
    sassConfig.insert = true
  }

  const config = {
    input: entry,
    output: {
      file: libPath,
      format: 'umd',
      name: name
    },
    external: ['vue'],
    plugins: [
      vue ({ autoStyles: false, styleToImports: true }),
      resolve({ jsnext: true, main: true, browser: true }),
      sass(sassConfig),
      babel(babelConfig),
      commonjs (),
    ],
    sourcemap: isDevelopment ? 'inline' : true,
    onwarn
  }

  if (isProduction) {
    config.plugins.push(uglify({}, minify))
  }
  return config
}


export default [
  createConfig('components/entry.js', 'vue-mdc-adapter', 'VueMDCAdapter'),
  createConfig('components/button/entry.js', 'vue-mdc-button', 'VueMDCButton'),
  createConfig('components/card/entry.js', 'vue-mdc-card', 'VueMDCCard'),
  createConfig('components/checkbox/entry.js', 'vue-mdc-checkbox', 'VueMDCCheckbox'),
  createConfig('components/dialog/entry.js', 'vue-mdc-dialog', 'VueMDCDialog'),
  createConfig('components/drawer/entry.js', 'vue-mdc-drawer', 'VueMDCDrawer'),
  createConfig('components/fab/entry.js', 'vue-mdc-fab', 'VueMDCFab'),
  createConfig('components/grid-list/entry.js', 'vue-mdc-grid-list', 'VueMDCGridList'),
  createConfig('components/icon-toggle/entry.js', 'vue-mdc-icon-toggle', 'VueMDCIconToggle'),
  createConfig('components/icon/entry.js', 'vue-mdc-icon', 'VueMDCIcon'),
  createConfig('components/layout-app/entry.js', 'vue-mdc-layout-app', 'VueMDCLayoutApp'),
  createConfig('components/layout-grid/entry.js', 'vue-mdc-layout-grid', 'VueMDCLayoutGrid'),
  createConfig('components/linear-progress/entry.js', 'vue-mdc-linear-progress', 'VueMDCLinearProgress'),
  createConfig('components/list/entry.js', 'vue-mdc-list', 'VueMDCList'),
  createConfig('components/menu/entry.js', 'vue-mdc-menu', 'VueMDCMenu'),
  createConfig('components/radio/entry.js', 'vue-mdc-radio', 'VueMDCRadio'),
  createConfig('components/select/entry.js', 'vue-mdc-select', 'VueMDCSelect'),
  createConfig('components/slider/entry.js', 'vue-mdc-slider', 'VueMDCSlider'),
  createConfig('components/snackbar/entry.js', 'vue-mdc-snackbar', 'VueMDCSnackbar'),
  createConfig('components/switch/entry.js', 'vue-mdc-switch', 'VueMDCSwitch'),
  createConfig('components/tabs/entry.js', 'vue-mdc-tabs', 'VueMDCTabs'),
  createConfig('components/textfield/entry.js', 'vue-mdc-texfield', 'VueMDCTextfield'),
  createConfig('components/toolbar/entry.js', 'vue-mdc-toolbar', 'VueMDCToolbar'),
  createConfig('components/typography/entry.js', 'vue-mdc-typography', 'VueMDCTypography'),
]


function onwarn (warning) {

  // skip certain warnings
  if (warning.code == 'NON_EXISTENT_EXPORT') {
    if (warning.name == 'MDCIconToggleAdapter') return;
  } 

  // console.warn everything else
  console.log(warning);
  console.warn(warning.message);
}
