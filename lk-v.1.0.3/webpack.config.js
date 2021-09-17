// webpack.config.js
var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where all compiled assets will be stored
    .setOutputPath('public/build/')

    .copyFiles({
         from: './assets/images',

         // optional target path, relative to the output dir
         to: 'images/[path][name].[ext]',

         // if versioning is enabled, add the file hash too
         //to: 'images/[path][name].[hash:8].[ext]',

         // only copy files matching this pattern
         //pattern: /\.(png|jpg|jpeg)$/
     })

    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')

    // will create public/build/app.js and public/build/app.css
    .addEntry('app', './assets/js/app.js')
    .addEntry('aboninfo', './assets/js/aboninfo.js')
    .addEntry('abon_search_empty', './assets/js/abon_search_empty.js')
    .addEntry('abon_search_history', './assets/js/abon_search_history.js')
    .addEntry('abon_dashboard', './assets/js/abon_dashboard.js')
    .addEntry('self_settings', './assets/js/self_settings.js')
    .addEntry('abon_list', './assets/js/abon_list.js')
    .addEntry('login', './assets/css/login.css')

    // allow legacy applications to use $/jQuery as a global variable
    .autoProvidejQuery()

    // enable source maps during development
    .enableSourceMaps(!Encore.isProduction())

    // empty the outputPath dir before each build
    .cleanupOutputBeforeBuild()

    // show OS notifications when builds finish/fail
    .enableBuildNotifications()

    // create hashed filenames (e.g. app.abc123.css)
    .enableVersioning()

    // allow sass/scss files to be processed
    .enableSassLoader()
;

// export the final configuration
module.exports = Encore.getWebpackConfig();
