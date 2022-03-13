const path = require("path");
const webpack = require( 'webpack' );
const config = require( './webpack.config.js' );

// config.devtool = 'eval';
config.plugins.push(

    // docs: <https://webpack.js.org/guides/hot-module-replacement/>
    new webpack.HotModuleReplacementPlugin()

);

// HMR mode: [chunkhash] can not be used
config.output.filename = '[name]_[hash:7].js';

config.devServer = {

    // 1. only necessary if want to serve static files those not from webpack
    // 2. default: current working directory
    // 3. it is recommended to use an absolute path
    // 4. it is also possible to serve from multiple directories
    // 5. value: boolean | string | array, static file location
    //
    contentBase: path.join( __dirname, "build" ) 
    // contentBase: false

    
    // 1. configure advanced options for serving static files from contentBase
    // 2. this only works when using contentBase as a string.
    // 3. Express documentation: <http://expressjs.com/en/4x/api.html#express.static>
    //
    // , staticOptions: { redirect: false }


    // 1. tell the server to watch the files served by the devServer.contentBase
    // 2. file changes will trigger a full page reload
    //
    , watchContentBase: true


    // 1. webpack uses the file system to get notified of file changes
    // 2. in some cases this does not work, such as NFS, Vagrant
    // 3. in these cases, use polling
    // 4. watchOptions: <https://webpack.js.org/configuration/watch/#watchoptions>
    //
    // , watchOptions: {
    //     poll: true // enable polling
    //     , poll: 5000 // or set poll interval in milliseconds
    // }
    

    , index: 'index.html'


    // when using inline mode and you're proxying dev-server, the inline client script does
    // not always know where to connect to. It will try to guess the URL of the server based on
    // window.location, but if fails you'll need to use this.
    // For example, the dev-server is proxied by nginx, and available on myapp.test
    //
    // , public: 'myapp.test:80'


    // 1. the bundled files will be available in the browser under this path.
    // 2. make sure always starts and ends with a forward slash.
    // 3. it is recommended that devServer.publicPath is the same as output.publicPath
    //
    // , publicPath: '/assets/'


    // in lazy mode, the dev-server will only compile the bundle when it gets requested. this
    // means that webpack will not watch any file changes. We call this lazy mode.
    //
    // , lazy: true
    

    // 1. lets you reduce the compilation in lazy mode
    // 2. it has no effect when used without lazy mode
    //
    // , filename: 'bundle.js'


    // , compress: true // enable gzip compression
    // , host: 'localhost' 
    , host: '0.0.0.0' // use 0.0.0.0 if you want your server to be accessible externally
    , port: 8899 // port to listen on


    // adds headers to all responses
    //
    // , headers: { "X-Custom-Foo": "bar" }
    

    // set to true to bypasses host checking
    //
    // , disableHostCheck: true
    // , socket: 'socket' // the unix socket to listen to ( instead of a host )


    // , proxy: {
    //     // proxy URLs to backend development server
    //     // "/api": "http://localhost:3000" // /api/users => http://localhost:3000/api/users
    //     , '/api': {
    //         target: 'http://localhost:3000'
    //         , pathRewrite: { '^/api': '' }
    //     }
    //     // A backend server running on HTTPS with an invalid certificate will not be accepted by default.
    //     // If you want to, modify your config like this:
    //     , '/api': {
    //         target: 'https://other-server.example.com'
    //         , secure: false
    //     }
    //     // bypass the proxy based on the return value of a function
    //     , '/api': {
    //         target: 'http://localhost:3000'
    //         // a function return either false or a path to be served
    //         , bypass: function( req, res, proxyOptions ) {
    //             if ( req.headers.accept.indexOf( 'html' ) !== -1 ) {
    //                 console.log( 'Skipping proxy for browser request. ' )
    //                 return '/index.html';
    //             }
    //         }
    //     }
    //     // proxy multiple, specific paths to the same target
    //     , proxy: [
    //         {
    //             context: [ '/auth', '/api' ]
    //             target: 'http://localhost:3000'
    //         }
    //     ]
    // }

    // useful for HTML5 History API
    // true for index.html upon 404, object for multiple paths
    //
    , historyApiFallback: true
    // , historyApiFallback: {
    //     rewrites: [
    //         { from: /^\/$/, to: '/views/landing.html' }
    //     ]
    // }
    // , historyApiFallback: {
    //     disableDotRule: true
    // }


    // , hot: true // hot module replacement. Depends on HotModuleReplacementPlugin
    // , hotOnly: true // enable HMR without page refresh as fallback in case of build failures

    , https: false // true for self-signed, a self-signed certificate is used
    // object for cert authority, you can provide your own
    // , https: {
    //     key: fs.readFileSync( '/path/to/server.key' )
    //     , cert: fs.readFileSync( '/path/to/server.crt' )
    //     , ca: fs.readFileSync( '/path/to/ca.pem' )
    // }
    // , pfx: '/path/to/file.pfx' // specify a path to an SSL .pfx file
    // , pfxPassphrase: 'passphrase' // the passphrase to an SSL pfx file


    , inline: true // toggle dev-server's modes, default is true, true for inline mode, false for iframe mode

    , open: false // when true, the dev server will open the browser
    // , openPage: '/different/page' // specify a page to navigate to when opening the browser
    // , useLocalIp: true // lets the browser open with your local IP

    , noInfo: true // only errors & warns on hot reload
    , quiet: false // nothing except the initial startup information will written to the console


    // 1. lets you precisely control what bundle information get displayed
    // 2. stats documentation: <https://webpack.js.org/configuration/stats/>
    // 3. this option has no effect when used with `quiet` or `noInfo`
    //
    // , stats: 'errors-only'


    // shows a full-screen overlay in the browser when there are compiler errors or warnings
    , overlay: true // show only compiler errors
    // show warnings as well as errors
    // , overlay: {
    //     warnings: true
    //     , errors: true
    // }


    // app: an Express app object
    // , setup: function( app ) {} // the same as before, and is deprecated, will be removed in v3.0.0.
    // , before: function( app ) {} // execute custom middleware prior to all other middleware internally within the server 
    /**
     * before(app){
     *     app.get('/some/path', function(req, res) {
     *         res.json({ custom: 'response' });
     *     });
     * }
     */
    // , after: function( app ) {} // execute custom middleware after all other middleware internally within the server.


    , allowedHosts: [] // whitelist services that are allowed to access the dev server
    , bonjour: true // broadcasts the server via ZeroConf networking on start
    // value: "none" || "error" || "warning" || "info" 
    , clientLogLevel: "info" 
    // , progress: true // output running progress to console. CLI only

    // Options below are not supported in configration file
    // , stdin: true // this option closes the server when stdin ends. CLI only `--stdin`
    // , color: true // Enables/Disables colors on the console. CLI only `--color`
    // , info: true // output cli information. CLI only `--info`

};

module.exports = config;
