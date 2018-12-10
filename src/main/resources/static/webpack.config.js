
var path = require('path');

module.exports = {
    mode: 'development',
    entry: './js/main.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test:path.join(__dirname,'.'),
                exclude: /(node_modules)/,
                use:[{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    }
};