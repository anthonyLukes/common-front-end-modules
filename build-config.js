module.exports = {
  PROD_FLAG: 'prod',
  SERVE_FLAG: 'serve',
  SASS: {
    INPUT: './src/styles/**/*.scss',
    KSS_OVERVIEW: './src/styles/styleguide/styleguide.md',
    KSS_TEMPLATE: './src/styles/styleguide/kss-node-github/template',
    OUTPUT: './web/styles',
    OPTIONS: {
      ERR_LOG_TO_CONSOLE: true,
      OUTPUT_STYLE: 'expanded'
    }
  },
  JS: {
    INPUT: './src/js/main.js',
    INPUT_GLOB: './src/js/**/*.js',
    OUTPUT_DIR: './web/js/',
    OUTPUT_FILE: 'bundle.js'
  },
  HTML: {
    INPUT: './src/templates', // templates for rendering engine to know about
    INPUT_PAGES: './src/pages/**/*.html', // pages to compile
    INPUT_ALL: './src/**/*.html', // files to watch
    OUTPUT: './web',
    OUTPUT_GLOB: './web/*.html'
  },
  DATA: {
    INPUT: './src/data/pageData.json'
  },
  TEMPLATE_PATHS: {
    JS: {
      DEV: 'js/bundle.js',
      PROD: 'js/bundle.min.js'
    },
    CSS: {
      MODERN: {
        DEV: 'styles/modern.css',
        PROD: 'styles/modern.min.css'
      },
      LEGACY: {
        DEV: 'styles/legacy.css',
        PROD: 'styles/legacy.min.css'
      }
    }
  },
  MEDIA: {
    INPUT: './src/media/**/*',
    OUTPUT: './web/media'
  },
  CONNECT: {
    PORT_NUMBER: 8000,
    LIVE_RELOAD: true
  },
  SHARED_CONFIG: {
    INPUT: './src/data/sharedConfig.json',
    OUTPUT: {
      SCSS: {
        DIR: './src/styles/helpers/',
        FILE: '_sharedConfig.scss'
      },
      JS: {
        DIR: './src/js/config/',
        FILE: 'sharedConfig.json'
      }
    }
  }
}