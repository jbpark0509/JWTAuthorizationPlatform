require('babel-polyfill');

const environment = {
    development: {
        isProduction: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: process.env.APIPORT || 3030,
    ATOKENSECRET: '+y%UzEVkgDP*8mq2HtvtY}4ehWHoAyPpi;EJoZMZ9{usR]G%dPCzrUCZ>xgVE63',
    RTOKENSECRET: 'MK4rRQPymbWu)9jr/Req*3w?Pdv{tHjQitAAykh2;Xzva,8XAmXd(damj7GH}Kk',
    RTOKENENCRYPTKEY: 'HDeVVNNTkTx@o+xoPA3(2yBY7yX.(NUKWJBj.m7rhVXfu#AUY+R9CV]fXaAvHs7',
    VALIDATIONSECRET: '9qc4EehoLPZGGxCUr]X+@[RT])URvHeyZY3Z4UEqKhuvnsy%nQpbR8Pe{V*pDd3',
    RESETEMAILSECRET: '^Gtc?LX(soTXpNDVp9G3z%r9Ur{ynnJkwCJCe[T4QiBds.2ZD^aC9buC&kjPuFe',
    FACEBOOK_APP_ID: '1772765012967628',
    FACEBOOK_APP_SECRET: 'ff724d49f32682441f456fd4cb3d3f71',
    GOOGLE_CLIENT_ID: '992226610777-i21s4mboq46186vr3ip75um0ihtob581.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: 'tQ4rv4CZ3oDi2NBM3TdkEuyh',
    BASE_URL: 'http://localhost:3000',
    app: {
        title: 'React Redux Example',
        description: 'All the modern best practices in one example.',
        head: {
            titleTemplate: 'React Redux Example: %s',
            meta: [
                { name: 'description', content: 'All the modern best practices in one example.' },
                { charset: 'utf-8' },
                { property: 'og:site_name', content: 'React Redux Example' },
                { property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg' },
                { property: 'og:locale', content: 'en_US' },
                { property: 'og:title', content: 'React Redux Example' },
                { property: 'og:description', content: 'All the modern best practices in one example.' },
                { property: 'og:card', content: 'summary' },
                { property: 'og:site', content: '@erikras' },
                { property: 'og:creator', content: '@erikras' },
                { property: 'og:image:width', content: '200' },
                { property: 'og:image:height', content: '200' }
            ]
        }
    },

}, environment);
