const path = require('path');
const globImporter = require('node-sass-glob-importer');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = async ({ config }) => {

  // Twig
  config.module.rules.push({
    test: /\.(html.twig|twig)$/,
    use: [
      {
        loader: 'twig-loader',
        options: {
          twigOptions: {
            namespaces: {
              "rocketship-theme-demo-atoms": path.resolve(
                __dirname,
                '../',
                'components/00-theme/01-atoms'
              ),
              "rocketship-theme-demo-molecules": path.resolve(
                __dirname,
                '../',
                'components/00-theme/02-molecules',
              ),
              "rocketship-theme-demo-organisms": path.resolve(
                __dirname,
                '../',
                'components/00-theme/03-organisms',
              ),
              "rocketship-theme-demo-templates": path.resolve(
                __dirname,
                '../',
                'components/00-theme/04-templates',
              ),
              "rocketship-theme-demo-pages": path.resolve(
                __dirname,
                '../',
                'components/00-theme/05-pages',
              ),
              "rocketship-theme-demo-p-organisms": path.resolve(
                __dirname,
                '../',
                'components/01-paragraphs/03-organisms',
              ),
              "rocketship-theme-demo-news-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f001-news/02-molecules',
              ),
              "rocketship-theme-demo-blog-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f002-blog/02-molecules',
              ),
              "rocketship-theme-demo-blog-organisms": path.resolve(
                __dirname,
                '../',
                'components/02-features/f002-blog/03-organisms',
              ),
              "rocketship-theme-demo-office-atoms": path.resolve(
                __dirname,
                '../',
                'components/02-features/f006-office/01-atoms',
              ),
              "rocketship-theme-demo-office-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f006-office/02-molecules',
              ),
              "rocketship-theme-demo-realisations-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f007-realisation/02-molecules',
              ),
              "rocketship-theme-demo-service-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f008-service/02-molecules',
              ),
              "rocketship-theme-demo-product-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f009-product/02-molecules',
              ),
              "rocketship-theme-demo-job-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f012-job/02-molecules',
              ),
              "rocketship-theme-demo-event-molecules": path.resolve(
                __dirname,
                '../',
                'components/02-features/f014-event/02-molecules',
              ),
              "rocketship-theme-demo-event-organisms": path.resolve(
                __dirname,
                '../',
                'components/02-features/f014-event/03-organisms',
              ),

              "rocketship_core": path.resolve(
                __dirname,
                '../',
                '../../../modules/contrib/rocketship_core/templates',
              ),

            },
          },
        },
      },
    ],
  });

  // SCSS
  config.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          url: false // otherwise get error or relative url paths in css not resolving
        },
      },
      // {
      //   loader: 'resolve-url-loader'
      // },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sassOptions: {
            importer: globImporter(),
          },
        },
      },
    ],
  });

  // YAML
  config.module.rules.push({
    test: /\.ya?ml$/,
    loader: 'js-yaml-loader',
  });


  // JS
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      cache: true,
      globals: [
        'jQuery',
        'Blazy',
        'dBlazy'
      ],
      quiet: true,
      // emitError: false,
      // emitWarning: false,
      failOnWarning: false,
      failOnError: false,
      sourceType: "module",
      requireConfigFile: false,
      allowImportExportEverywhere: false,
      ecmaFeatures: {
        globalReturn: false,
      },
      babelOptions: {
        configFile: ".babelrc"
      },
      plugins: ["jsx"]
    }
  });

  // MDX

  // 1. Loading non-story mdx files

  // config.module.rules.push({
  //   test: /(?!\.stories)\.mdx$/,
  //   exclude: /node_modules/,
  //   use: [
  //     {
  //       loader: 'babel-loader',
  //       // may or may not need this line depending on your app's setup
  //       options: {
  //         plugins: ['@babel/plugin-transform-react-jsx'],
  //       },
  //     },
  //     {
  //       loader: '@mdx-js/loader',
  //     },
  //   ],
  // });

  // 2a. Load `.stories.mdx` files as CSF and generate
  //     the docs page from the markdown
  config.module.rules.push({
    test: /\.stories\.mdx$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        // may or may not need this line depending on your app's setup
        options: {
          plugins: ['@babel/plugin-transform-react-jsx'],
        },
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})],
        },
      },
    ],
  });

  // 2b. Run `source-loader` on story files to show their source code
  //     automatically in `DocsPage` or the `Source` doc block.
  config.module.rules.push({
    test: /\.stories\.[tj]sx?$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre',
  });

  // Logo
  config.module.rules.push({
    test: /\.(png|svg|jpg|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      }
    ],
    include: [path.resolve(__dirname, '../', './')],
  });

  // Images
  config.module.rules.push({
    test: /\.(png|svg|jpg|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      }
    ],
    include: [path.resolve(__dirname, '../', 'images')],
  });

  // Icons
  // config.module.rules.push({
  //   test: /\.svg$/i,
  //   use: [
  //     {
  //       loader: 'file-loader',
  //       query: {
  //         name: '[name].[ext]'
  //       }
  //     }
  //   ],
  //   include: [path.resolve(__dirname, '../', 'icons')],
  // });

  // Fonts
  config.module.rules.push({
    test: /\.(woff|woff2|ttf|eot|otf|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      }
    ],
    include: [path.resolve(__dirname, '../', 'fonts')],
  });

  config.resolve.extensions.push(".ts", ".tsx")

  return config;
};
