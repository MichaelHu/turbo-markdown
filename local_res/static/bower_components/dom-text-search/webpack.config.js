const path = require("path");
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const webpack = require( 'webpack' );

module.exports = {

    // 1. the home directory for webpack, for resolving entry points and loaders from configration
    // 2. the entry and module.rules.loader option is resolved relative to this directory
    // 3. must be an absolute path
    context: __dirname

    , mode: "production" // "production" | "development" | "none"
    // , mode: "production" // enable many optimizations for production builds
    // , mode: "development" // enabled useful tools for development
    // , mode: "none" // no defaults
    // Chosen mode tells webpack to use its built-in optimizations accordingly.

    , resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)

        modules: [ "node_modules" ]
        // directories where to look for modules

        , extensions: [".js", ".json", ".jsx", ".css"]
        // extensions that are used

        , alias: {
            // a list of module name aliases

            // module: "new-module",
            // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"

            // "only-module$": "new-module",
            // alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"

            // module: path.resolve(__dirname, "app/third/module.js")
            // alias "module" -> "./app/third/module.js" and "module/file" results in error
            // modules aliases are imported relative to the current context
        }
        /* alternative alias syntax (click to show) */

        /* Advanced resolve configuration (click to show) */
    }

    , entry: {
        'dts_full': './src/dts_full.js'
        , 'dts_no-vim-like': './src/dts_no-vim-like.js'
        , 'dts_no-animate': './src/dts_no-animate.js'
    }
    // entry: "./src/index.js", // string | object | array
    // Here the application starts executing
    // and webpack starts bundling

    , output: {
        // options related to how webpack emits results


        // 1. the target directory for all output files, is of type string
        // 2. must be an absolute path (use the Node.js path module)
        path: path.resolve( __dirname, "build" )

        // 1. important for on-demand-loading or loading external resources
        // 2. the value of the option is prefixed to every URL created by the runtime or loaders
        // 3. the four url patterns:
        //    a. page-relative
        //    b. server-relative
        //    c. protocol-relative
        //    d. absolute
        // , publicPath: "" // page-relative, the same directory
        // , publicPath: "assets/" // page-relative
        // , publicPath: "../assets/" // page-relative
        // , publicPath: "/assets/" // server-relative
        // , publicPath: '//cdn.example.com/assets/' // CDN, protocol-relative
        // , publicPath: 'https://cdn.example.com/assets/' // CDN, absolute
          
        // 1. the option determines the name of each output bundle  
        // 2. real name for single entry point, template string for more than one entry point
        // 3. also allowed to create a folder structure, like 'js/[name]/bundle.js'
        // 4. this option does not affect output files for on-demand-loaded chunks,
        //      use `chunkFilename` instead in that case
        // 5. also doesn't affect files created by loaders
        // 6. template variables
        //      name        entry name
        //      id          internal chunk id
        //      hash        the unique hash generated for every build
        //      chunkhash   hashes based on each chunk's content
        // , filename: "[name]_[hash:7]_[chunkhash:7].js"
        // , filename: "[id].js"
        // , filename: "[id]_[hash:7].js"
        // , filename: "[name]_[hash:7].js"
        // , filename: "[id]_[chunkhash:7].js"
        , filename: "[name].js"


        // 1. this option determines the name of non-entry chunk files, i.e., code-splitting
        // 2. defaults to `[id].js`, or a value infered from `output.filename` ( `[name]` is replaced with `[id]` or `[id].` is prepended )
        // , chunkFilename: '[id]_[chunkhash].js'

        // number of milliseconds before chunk request expires
        // , chunkLoadTimeout: 120000

        // only used wgeb target is web, which uses JSONP for loading on-demand chunks, by adding script tags
        // , crossOriginLoading: "anonymous"

        // allow customization of the script type webpack injects script tags into the DOM to download async chunks
        // , jsonpScriptType: 'text/javascript'
        // , jsonpScriptType: 'module' // use with ES6 ready code

        // the name of the exported library
        // , library: "MyLibrary"
        , library: "DomTextSearch"

        // the type of the exported library
        , libraryTarget: "umd" // universal module definition

        // 1. tell webpack to include comments in bundles with information about the contained modules
        // 2. defaults to false, and should not be used in production
        , pathinfo: false
    }

    , module: {
        // configuration regarding modules

        rules: [
            // rules for modules (configure loaders, parser options, etc.)

            {
                test: /\.jsx?$/
                // include: [path.resolve(__dirname, "app")],
                // exclude: [path.resolve(__dirname, "app/demo-files")],
                
                // these are matching conditions, each accepting a regular expression or string
                // test and include have the same behavior, both must be matched
                // exclude must not be matched (takes preferrence over test and include)
                // Best practices:
                // - Use RegExp only in test and for filename matching
                // - Use arrays of absolute paths in include and exclude
                // - Try to avoid exclude and prefer include

                // issuer: { test, include, exclude },
                // conditions for the issuer (the origin of the import)

                // enforce: "pre",
                // enforce: "post",
                // flags to apply these rules, even if they are overridden (advanced option)

                , loader: "babel-loader"
                // the loader which should be applied, it'll be resolved relative to the context
                // -loader suffix is no longer optional in webpack2 for clarity reasons
                // see webpack 1 upgrade guide

                , options: {
                    presets: ["env", "stage-0"]
                }
                // options for the loader
            }

            // {
            //     test: /\.html$/,

            //     use: [
            //         // apply multiple loaders and options
            //         "htmllint-loader",
            //         {
            //             loader: "html-loader",
            //             options: {
            //                 /* ... */
            //             }
            //         }
            //     ]
            // },

            , {
                test: /\.s?css$/
                , use: [
                    'style-loader'
                    , {
                        loader: 'css-loader'
                        , options: {
                            modules: true
                            // , localIdentName: '[path][name]__[local]--[hash:base64:5]'
                            , localIdentName: '[local]-[hash:base64:5]'
                        }
                    }
                    , 'sass-loader'
                ]
            }

            // {
            //     oneOf: [
            //         /* rules */
            //     ]
            // },
            // only use one of these nested rules

            // {
            //     rules: [
            //         /* rules */
            //     ]
            // },
            // use all of these nested rules (combine with conditions to be useful)

            // {
            //     resource: {
            //         and: [
            //             /* conditions */
            //         ]
            //     }
            // },
            // matches only if all conditions are matched

            // {
            //     resource: {
            //         or: [
            //             /* conditions */
            //         ]
            //     }
            // },
            // {
            //     resource: [
            //         /* conditions */
            //     ]
            // }
            // matches if any condition is matched (default for arrays)

            // { resource: { not: /* condition */ } }
            // matches if the condition is not matched
        ]

        /* Advanced module configuration (click to show) */
    }

    // , performance: {
    //     hints: "warning", // enum
    //     maxAssetSize: 200000, // int (in bytes),
    //     maxEntrypointSize: 400000, // int (in bytes)
    //     assetFilter: function(assetFilename) {
    //         // Function predicate that provides asset filenames
    //         return (
    //             assetFilename.endsWith(".css") || assetFilename.endsWith(".js")
    //         );
    //     }
    // }

    // 1. enhance debugging by adding meta info for the browser devtools 
    // 2. source-map most detailed at the expense of build speed
    // 3. docs: <https://webpack.js.org/configuration/devtool/#devtool>
    // , devtool: "source-map"

    , target: "web" // enum
    // the environment in which the bundle should run
    // changes chunk loading behavior and available modules

    // 1. Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime
    // 2. the bundle with external dependencies maybe: CommonJS, AMD, Global, ES2015 module
    // 3. the externals library forms: commonjs, amd, root, commonjs2
    // 4. docs: <https://webpack.js.org/configuration/externals/>
    // 5. Examples:
    // , externals: { jquery: 'jQuery' }
    // , externals: {
    //      substract: [ './math', 'substract' ] // require( './math/substract' )
    // }
    // , externals: {
    //      substract: {
    //          root: [ 'math', 'substract' ]    // window[ 'math' ][ 'substract' ]
    //      }
    // }
    // , externals: ["react", /^@angular\//]
    // , externals: {
    //     lodash : {
    //         commonjs: "lodash",
    //         amd: "lodash", 
    //         root: "_" // indicates global variable, window[ '_' ]
    //     }
    // }
    // , externals: [
    //     function( context, request, callback ) {
    //         if ( /^yourregex$/.test( request ) ){
    //             // The 'commonjs ' + request defines the type of module that needs to be externalized.
    //             return callback( null, 'commonjs ' + request );
    //         }
    //         callback();
    //     }
    // ]
    , externals: { 
        jquery: 'jQuery' 
    }


    // lets you precisely control what bundle information gets displayed
    , stats: "errors-only"

    , plugins: [
        // ...
        // new ExtractTextPlugin( '[name]_[contenthash:7].css' )

        // docs: https://github.com/jantimon/html-webpack-plugin#configuration
        new HtmlWebpackPlugin( {
            title: 'dom-text-search'
            , filename: 'index.html'
            , template: 'src/index.html'
            // , inject: true | 'head' | 'body' | false
            // , favicon: 'src/icon/favicon.ico'
            // , minify: {} // html-minifier's options
            // , hash: true | false
            // , showErrors: true | false
            , chunks: [ 'index' ]
            // , chunksSortMode: 'none' | 'auto' | 'dependency' | 'manual' | function(){}
            // , excludeChunks: [ ... ]
            // , xhtml: true | false
        } )

        // docs: <https://webpack.js.org/plugins/commons-chunk-plugin/>
        // , new webpack.optimize.CommonsChunkPlugin( {

        //     // 1. The chunk name of the commons chunk. An existing chunk can be selected by passing a name of an existing chunk.
        //     // 2. If an array of strings is passed this is equal to invoking the plugin multiple times for each chunk name.
        //     // 3. If omitted and `options.async` or `options.children` is set all chunks are used, otherwise `options.filename`
        //     //      is used as chunk name.
        //     // 4. When using `options.async` to create common chunks from other async chunks you must specify an entry-point
        //     //      chunk name here instead of omitting the `option.name`.
        //     name: 'common'
        //     // name: string // or
        //     // , names: string[]
        //     // names: [ 'index', 'other' ]

        //     // 1. The filename template for the commons chunk. Can contain the same placeholders as `output.filename`.
        //     // 2. If omitted the original filename is not modified (usually `output.filename` or `output.chunkFilename`).
        //     // 3. This option is not permitted if you're using `options.async` as well, see below for more details.
        //     // , filename: string
        //     , filename: '[name]_[hash:7].js'

        //     // 1. The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
        //     // 2. The number must be greater than or equal 2 and lower than or equal to the number of chunks.
        //     // 3. Passing `Infinity` just creates the commons chunk, but moves no modules into it.
        //     //      <https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk>
        //     // 4. By providing a `function` you can add custom logic. (Defaults to the number of chunks)
        //     // , minChunks: number|Infinity|function(module, count) -> boolean

        //     // 1. Select the source chunks by chunk names. The chunk must be a child of the commons chunk.
        //     // 2. If omitted all `entry chunks` are selected.
        //     // , chunks: [ 'index' ]
        //     // , chunks: string[]
        //     , chunks: [ 'index', 'other' ]

        //     // If `true` all children of the commons chunk are selected
        //     // , children: boolean
        //     // , children: true

        //     // If `true` all descendants of the commons chunk are selected
        //     // , deepChildren: boolean

        //     // 1. If `true` a new async commons chunk is created as child of `options.name` and sibling of `options.chunks`.
        //     // 2. It is loaded in parallel with `options.chunks`.
        //     // 3. Instead of using `option.filename`, it is possible to change the name of the output file by providing
        //     //      the desired string here instead of `true`.
        //     // 4. async: boolean|string,
        //     // , async: true

        //     // Minimum size of all common module before a commons chunk is created.
        //     // , minSize: number
        // } )

    ]
    // list of additional plugins

    /* Advanced configuration (click to show) */
};
