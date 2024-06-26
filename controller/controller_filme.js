/***********************************************************************************************************
* Objetivo: Arquivo responsável pelas validações e consistencias de dados de Filme
* Data: 01/02/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

//Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
//Import do arquivo responsável pela interação como Banco de Dados (model)
const filmesDAO = require('../model/DAO/filme.js')
const classificacaoDAO = require('../model/DAO/classificacao.js')
const generoDAO = require('../model/DAO/genero.js')

//Função para validar e inserir um novo Filme
const setInserirNovoFilme = async function (dadosFilme, contentType) {

    try {

        //Validação de content-type (apenas application/json)
        if (String(contentType).toLowerCase() == 'application/json') {

            //Cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            //Validação de campos obrigatórios ou com digitação inválida
            if (dadosFilme.nome == ''               || dadosFilme.nome == undefined             || dadosFilme.nome == null              || dadosFilme.nome.length > 80              ||
                dadosFilme.sinopse == ''            || dadosFilme.sinopse == undefined          || dadosFilme.sinopse == null           || dadosFilme.sinopse.length > 65000        ||
                dadosFilme.duracao == ''            || dadosFilme.duracao == undefined          || dadosFilme.duracao == null           || dadosFilme.duracao.length > 8            ||
                dadosFilme.data_lancamento == ''    || dadosFilme.data_lancamento == undefined  || dadosFilme.data_lancamento == null   || dadosFilme.data_lancamento.length != 10  ||
                dadosFilme.foto_capa == ''          || dadosFilme.foto_capa == undefined        || dadosFilme.foto_capa == null         || dadosFilme.foto_capa.length > 200        ||
                dadosFilme.tbl_classificacao_id == ''         || dadosFilme.tbl_classificacao_id == undefined       || dadosFilme.tbl_classificacao_id == null || isNaN(dadosFilme.tbl_classificacao_id) ||
                dadosFilme.valor_unitario.length > 6
            ) {
                return message.ERROR_REQUIRED_FIELDS //400

            } else {

                let validateStatus = false

                //Validação da data de relançamento, já que ela não é obrigatória no Banco de Dados

                if (dadosFilme.data_relancamento != null &&
                    dadosFilme.data_relancamento != '' &&
                    dadosFilme.data_relancamento != undefined) {

                    //Validação para verificar se a data está com a quantidade de digitos corretos
                    if (dadosFilme.data_relancamento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }
                } else {
                    validateStatus = true
                }

                //Validação para verificar se a variável booleana é verdadeira
                if (validateStatus) {

                    //Encaminha os dados do FIlme para o DAO inserir no Banco de Dados
                    let novoFilme = await filmesDAO.insertFilme(dadosFilme)

                    if(novoFilme){
                        let idFilmes = await filmesDAO.IDFilme()
                        dadosFilme.id = Number(idFilmes[0].id)
                    }

                    //Validação para verificar se DAO inseriu os dados do Banco
                    if (novoFilme) {

                        //Cria o JSON de retorno dos dados (201)
                        novoFilmeJSON.filme = dadosFilme
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 - Erro na controller
    }
}

//Função para atualizar um novo Filme
const setAtualizarFilme = async function (idFilme, dadoAtualizado, contentType) {
    try {

        // Validação de content-type (apenas aplication/json)
        if (String(contentType).toLowerCase() == 'application/json') {
            let dadosID = filmesDAO.selectByIdFilme()

            if (idFilme == '' || idFilme == undefined || idFilme == isNaN(idFilme) || idFilme == null) {
                return message.ERROR_INVALID_ID
            } else if (idFilme > dadosID.length) {
                return message.ERROR_NOT_FOUND
            } else {
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarFilmeJSON = {}

                //Validação de campos obrigatórios ou com digitação inválida
                if (dadoAtualizado.nome == '' || dadoAtualizado.nome == undefined || dadoAtualizado.nome == null || dadoAtualizado.nome.length > 80 ||
                    dadoAtualizado.sinopse == '' || dadoAtualizado.sinopse == undefined || dadoAtualizado.sinopse == null || dadoAtualizado.sinopse.length > 65000 ||
                    dadoAtualizado.duracao == '' || dadoAtualizado.duracao == undefined || dadoAtualizado.duracao == null || dadoAtualizado.duracao.length > 8 ||
                    dadoAtualizado.data_lancamento == '' || dadoAtualizado.data_lancamento == undefined || dadoAtualizado.data_lancamento == null || dadoAtualizado.data_lancamento.length != 10 ||
                    dadoAtualizado.foto_capa == '' || dadoAtualizado.foto_capa == undefined || dadoAtualizado.foto_capa == null || dadoAtualizado.foto_capa.length > 200 ||
                    dadoAtualizado.id_classificacao == ''         || dadoAtualizado.id_classificacao == undefined       || dadoAtualizado.id_classificacao == null || isNaN(dadoAtualizado.id_classificacao) ||
                    dadoAtualizado.valor_unitario.length > 6
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                }

                else {
                    let validateStatus = false

                    // Outra validação com campos obrigatorios ou com digitação inválida
                    if (dadoAtualizado.data_relancamento != null &&
                        dadoAtualizado.data_relancamento != '' &&
                        dadoAtualizado.data_relancamento != undefined) {

                        if (dadoAtualizado.data_relancamento.length != 10) {
                            return message.ERROR_REQUIRED_FIELDS//400
                        } else {
                            validateStatus = true
                        }
                    } else {

                        validateStatus = true
                    }

                    // Validação para verificar se a variavel booleana é verdadeira
                    if (validateStatus) {

                        // Encaminha os dados do filme para o DAO inserir no DB
                        let dadosFilme = await filmesDAO.updateFilme(idFilme, dadoAtualizado)

                        // Validação para verificar se o DAO inseriu os dados do DB
                        if (dadosFilme) {

                            //Cria o JSON de retorno dos dados (201)
                            atualizarFilmeJSON.filme = dadosFilme
                            atualizarFilmeJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            atualizarFilmeJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            atualizarFilmeJSON.message = message.SUCCESS_UPDATED_ITEM.message
                            return atualizarFilmeJSON //201

                        } else {
                            return message.ERROR_INTERNAL_SERVER_DB //500
                        }
                    } else {
                        validateStatus = false
                    }

                }

            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

//Função para excluir um novo Filme
const setExcluirFilme = async function (id) {

    let idFilme = id

    if (idFilme == '' || idFilme == undefined || idFilme == isNaN(idFilme) || idFilme == null) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)
        let validarId = dadosFilme.length

        if (validarId > 0) {

            dadosFilme = await filmesDAO.deleteFilme(idFilme)

            return message.SUCCESS_DELETED_ITEM

        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

//Função para listar todos os Filmes
const getListarFilmes = async function () {

    //Cria um objeto JSON
    let filmesJSON = {}

    //Chama a função do DAO que retorna os filmes do Banco de Dados
    let dadosFilmes = await filmesDAO.selectAllFilmes()

    //Validação para verificar se o DAO retornou dados
    if(dadosFilmes.length > 0){

            
        for(let filmes of dadosFilmes){
            let classifyFilmes = await classificacaoDAO.selectByIdClassificacao(filmes.id_classificacao)
            let filmeAtor = await filmesDAO.filmeAtor(filmes.id)
            let generoFilme = await generoDAO.generoFilme(filmes.id)
            delete filmes.id_classificacao
            filmes.classificacao = classifyFilmes  
            filmes.genero = generoFilme
            filmes.ator = filmeAtor
        }
        
        // Cria o JSON para retornar para o APP
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.length
        filmesJSON.status_code = 200

        return filmesJSON
    }else{
        return message.ERROR_NOT_FOUND // 404
    }
}

//Função para buscar um novo Filme
const getBuscarFilme = async function (id) {

    //Recebe o ID do Filme
    let idFilme = id

    //Cria o objeto JSON
    let filmeJSON = {}

    //Validação para verificar se ID é válido (vazio, indefinido e não numérico)
    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID_ID
    } else {

        //Encaminha para o DAO localizar o ID do filme
        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)

        //Validação para verificar se existem dados de retorno
        if (dadosFilme) {

            //Validação para verificar a quantidade de itens encontrados
            if (dadosFilme.length > 0) {

                //Cria o JSON de retorno
                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

//Exercício QUERY
const buscar = async function () {

    let buscarDadosJSON = {}

    let selecionarFilmes = await filmesDAO.selectAllFilmes()

    if (selecionarFilmes) {
        buscarDadosJSON.filmes = selecionarFilmes
    }
}

const getNomeFilme = async function (nome) {

    let nomeFilme = nome

    let filmeJSON = {}

    if (nomeFilme == '' || nomeFilme == undefined) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosFilme = await filmesDAO.selectNomeFilme(nomeFilme)

        if (dadosFilme) {

            if (dadosFilme.length > 0) {

                filmeJSON.filme = dadosFilme
                filmeJSON.status_code = 200

                return filmeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getNomeFilme
}