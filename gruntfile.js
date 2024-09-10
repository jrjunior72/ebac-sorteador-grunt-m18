//gruntfile.js

const { match } = require("assert");
const { watch } = require("fs");

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: { // compilação no ambiente de desenvolvimento
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: { // compilação no ambiente de produção
                options: {
                    compress: true,
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },
        watch: { // configurando o plugin watch
            less: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        replace: {
            dev: {// criar o arquivo index.html no ambiente de desenvolvimento
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true, // desconsidera a pasta original src na hora de criar a pasta destino
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist: {// criar o arquivos no ambiente de produção
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true, // desconsidera a pasta original src na hora de criar a pasta destino
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true // remove espaços em branco
                },
                files: {
                    'prebuild/index.html': 'src/index.html' // minificação para uma pasta temporária
                }
            }

        },
        clean: ['prebuild'], // apagar a pasta temporária prebuild
        uglify: {
            options: {
            // Opções do UglifyJS aqui
            },
            target: {
                files: {
                    'dist/scripts/main.min.js' : 'src/scripts/main.js' // Configuração dos arquivos de origem e destino aqui
                }
            }
        }

    })
    // adicionando plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');// publicar html no ambiente de desenvolvimento
    grunt.loadNpmTasks('grunt-contrib-htmlmin');//mimificação do html
    grunt.loadNpmTasks('grunt-contrib-clean');// apaga a pasta temporária prebuild
    grunt.loadNpmTasks('grunt-contrib-uglify');// comprime o arquivo js
    // registrando tarefas
    grunt.registerTask('default', ['watch']); // publicar em ambiente de desenvolvimento
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); // publicar em ambiente de produção
}
