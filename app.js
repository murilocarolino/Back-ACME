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

/********************************************************************************************************** */

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

app.put('/v2/acmefilmes/updateFilme/:id', cors(), bodyParserJSON, async function (request, response, next) {
    
    let contentType = request.headers['content-type']
    let idFilme = request.params.id
    let dadosBody = request.body

    let resultUpdateFilme = await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)

    response.status(resultUpdateFilme.status_code)
    response.json(resultUpdateFilme)
})

//Executa a API e faz ela ficar aguardando requisições
app.listen(8080, function(){
    console.log("api funcionando")
})