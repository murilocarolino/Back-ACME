/***********************************************************************************************************
* Objetivo: Arquivo para realizar as requisições de Filme
* Data: 08/02/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

/***********************************************************************************************************
 *  Para realizar a integração com o Banco de Dados devemos utilizar uma das seguintes bibliotecas:
 *      - SEQUELIZE     - É a biblioteca mais antiga
 *      - PRISMA ORM    - É a biblioteca mais atual (Utilizaremos no projeto)
 *      - FASTFY ORM    - É a biblioteca mais atual
 * 
 *      Para instalação do PRISMA ORM:
 *          npm install prisma --save            (É responsável pela conexão com o Banco de Dados)
 *          npm install @prisma/client --save   (É responsável por executar scripts SQL no Banco)
 * 
 *      Para iniciar o prisma no projeto, devemos:
 *          npx prisma init
 ************************************************************************************************************/

/******************************Import dos arquivos de Controller do projeto *********************************/

const controllerFilmes = require('./controller/controller_filme.js')
const controllerGeneros = require('./controller/controller_genero.js')
const controllerClassificacao = require('./controller/controller_classificacao.js')
const controllerAtor =  require('./controller/controller_ator.js')
const controllerDiretor =  require('./controller/controller_diretor.js')

/****************************************************************************************************************************************/

const express       = require('express')
const cors          = require ('cors')
const bodyParser    = require('body-parser')

//Cria um objeto app tendo como referência a classe do express
const app = express()

app.use((request, response, next) => {
    
    response.header('Access-Control-Allow-Origin', "*") 
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    app.use(cors())
    next()
})

const bodyParserJSON = bodyParser.json()

app.use((request, response, next) => {

    //Permite especificar quem poderá acessar a API('*' - libera o acesso publico, 'IP' - libera acesso apenas para aquela máquina)
    response.header('Access-Control-Allow-Origin', '*')

    //Permite especificar como a API, será requisitada (GET, POST, PUT e DELETE)
    response.header('Access-Control-Allow-Methods', 'GET')

    //Ativa as configurações de permissão do cors
    app.use(cors())

    next()
})

//EndPoints: Versão 1.0 que retorna os dados de um arquivo de filmes
//Período de utilização 01/2024 até 02/2024
app.get('/v1/acmeFilmes/filmes', cors(), async function (request, response, next) {

    let controllerFilmes = require('./controller/funcao.js')
    
    let filmes = await controllerFilmes.getFilmes()
    
    if (filmes) {
        response.json(filmes)
        response.status(200)
    } else {
        response.status(400)
    }
})

//EndPoints: Versão 2.0 - Retorna os dados do filme do Banco de Dados
app.get('/v2/acmeFilmes/filmes', cors(), async function (request, response, next) {
    
    //Chama a função da controller para retornar todos os filmes
    let dadosFilmes = await controllerFilmes.getListarFilmes()
    
    //Validação para verificar se existem dados a serem retornados
    if (dadosFilmes) {
        response.json(dadosFilmes)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum registro encontrado' })
        response.status(404)
    }

})

//EndPoint: Retorna os dados filtrando pelo ID
app.get('/v2/acmefilmes/filme/:id', cors(), async function(request, response) {

    //Recebe o ID da requisição
    let idFilme = request.params.id

    //Encaminha o ID para a controller buscar o Filme
    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})

//EndPoint: Retorna os dados filtrando pelo nome dele
app.get('/v2/acmefilmes/filme', cors(), async function(request, response) {

    let nome = request.query.nome

    let dadosFilme = await controllerFilmes.getNomeFilme(nome)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})

app.post('/v2/acmefilmes/filme', cors(), bodyParserJSON, async function (request, response){

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Recebe todos os dados encaminhados na requisição pelo body
    let dadosBody = request.body

    //Encaminha os dados para o controller enviar para o DAO
    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody, contentType)

    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})

app.delete('/v2/acmefilmes/filme/:id', cors(), async function (request, response, next) {

    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.setExcluirFilme(idFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)

})

app.put('/v2/acmefilmes/filme/:id', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})

/************************************************************ GENERO **********************************************************************/

app.get('/v2/acmefilmes/genero/:id', cors(), async function(request, response) {

    let idGenero = request.params.id

    let dadosGenero = await controllerGeneros.getBuscarGenero(idGenero)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})

app.get('/v2/acmefilmes/genero', cors(), async function(request, response) {

    let nome = request.query.nome

    let dadosGenero = await controllerGeneros.getListarGeneros(nome)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})

app.post('/v2/acmefilmes/genero', cors(), bodyParserJSON, async function (request, response){

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDadosNovoGenero = await controllerGeneros.setInserirNovoGenero(dadosBody, contentType)

    response.status(resultDadosNovoGenero.status_code)
    response.json(resultDadosNovoGenero)
})

app.delete('/v2/acmefilmes/genero/:id', cors(), async function (request, response, next) {

    let idGenero = request.params.id

    let dadosGenero = await controllerGeneros.setExcluirGenero(idGenero)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)

})

app.put('/v2/acmefilmes/genero/:id', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idGenero = request.params.id

    let dadosGenero = await controllerGeneros.setAtualizarGenero(idGenero, dadosBody, contentType)

    response.status(dadosGenero.status_code)
    response.json(dadosGenero)
})

/********************************************************* CLASSIFICAÇÃO *******************************************************************/

app.get('/v2/acmefilmes/classificacao/:id', cors(), async function(request, response) {

    let idClassificacao = request.params.id

    let dadosClassificacao = await controllerClassificacao.getBuscarClassificacao(idClassificacao)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})

app.get('/v2/acmefilmes/classificacao', cors(), async function(request, response) {

    let classificacao = request.query.nome

    let dadosClassificacao = await controllerClassificacao.getListarClassificacoes(classificacao)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})

app.post('/v2/acmefilmes/classificacao', cors(), bodyParserJSON, async function (request, response){

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDadosNovaClassificacao = await controllerClassificacao.setInserirNovaClassificacao(dadosBody, contentType)

    response.status(resultDadosNovaClassificacao.status_code)
    response.json(resultDadosNovaClassificacao)
})

app.delete('/v2/acmefilmes/classificacao/:id', cors(), async function (request, response, next) {

    let idClassificacao = request.params.id

    let dadosClassificacao = await controllerClassificacao.setExcluirClassificacao(idClassificacao)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)

})

app.put('/v2/acmefilmes/classificacao/:id', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idClassificacao = request.params.id

    let dadosClassificacao = await controllerClassificacao.setAtualizarClassificacao(idClassificacao, dadosBody, contentType)

    response.status(dadosClassificacao.status_code)
    response.json(dadosClassificacao)
})


/*************************************************************** ATOR **********************************************************************/

app.get('/v2/acmefilmes/ator/:id', cors(), async function(request, response) {

    let idAtor = request.params.id

    let dadosAtor = await controllerAtor.getBuscarAtor(idAtor)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

app.get('/v2/acmefilmes/ator', cors(), async function(request, response) {

    let ator = request.query.nome

    let dadosAtor = await controllerAtor.getListarAtores(ator)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

app.post('/v2/acmefilmes/ator', cors(), bodyParserJSON, async function (request, response){

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDadosNovoAtor = await controllerAtor.setInserirNovoAtor(dadosBody, contentType)

    response.status(resultDadosNovoAtor.status_code)
    response.json(resultDadosNovoAtor)
})

app.delete('/v2/acmefilmes/ator/:id', cors(), async function (request, response, next) {

    let idAtor = request.params.id

    let dadosAtor = await controllerAtor.setExcluirAtor(idAtor)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)

})

app.put('/v2/acmefilmes/ator/:id', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idAtor = request.params.id

    let dadosAtor = await controllerAtor.setAtualizarAtor(idAtor, dadosBody, contentType)

    response.status(dadosAtor.status_code)
    response.json(dadosAtor)
})

/************************************************************** DIRETOR ********************************************************************/

app.get('/v2/acmefilmes/diretor/:id', cors(), async function(request, response) {

    let idDiretor = request.params.id

    let dadosDiretor = await controllerDiretor.getBuscarDiretor(idDiretor)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)
})

app.get('/v2/acmefilmes/diretor', cors(), async function(request, response) {

    let diretor = request.query.nome

    let dadosDiretor = await controllerDiretor.getListarDiretores(diretor)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)
})

app.post('/v2/acmefilmes/diretor', cors(), bodyParserJSON, async function (request, response){

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDadosNovoDiretor = await controllerDiretor.setInserirNovoDiretor(dadosBody, contentType)

    response.status(resultDadosNovoDiretor.status_code)
    response.json(resultDadosNovoDiretor)
})

app.delete('/v2/acmefilmes/diretor/:id', cors(), async function (request, response, next) {

    let idDiretor = request.params.id

    let dadosDiretor = await controllerDiretor.setExcluirDiretor(idDiretor)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)

})

app.put('/v2/acmefilmes/diretor/:id', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idDiretor = request.params.id

    let dadosDiretor = await controllerDiretor.setAtualizarDiretor(idDiretor, dadosBody, contentType)

    response.status(dadosDiretor.status_code)
    response.json(dadosDiretor)
})

app.listen(8080, function(){
    console.log("api funcionando")
})