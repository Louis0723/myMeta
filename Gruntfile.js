var grunt = require("grunt");
grunt.config.init({
    pkg: grunt.file.readJSON('docs/package.json'),
    'create-windows-installer': {
        x64: {
            version:"0.4.0",
            appDirectory: './TheWallet/thewallet-win32-x64',
            outputDirectory:'./',
            title:"The Wallet Install",
            authors: 'Rue-Shan Lu Team - Lursun',
            name: 'TheWallet.exe',
            exe: 'TheWallet.exe',
            description:"The Wallet for Ethereum, Bitcoin.",
        }       
    }
})

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);
