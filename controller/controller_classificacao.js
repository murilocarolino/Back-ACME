

/***********************************************************************************************************
* Objetivo: Arquivo responsável pelas validações e consistencias de dados de Classificacao
* Data: 01/02/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

//Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
//Import do arquivo responsável pela interação como Banco de Dados (model)
const classificacaoDAO = require('../model/DAO/classificacao.js')

const setInserirNovaClassificacao = async function (dadosClassificacao, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let novaClassificacaoJSON = {}

            if (dadosClassificacao.faixa_etaria == ''       || dadosClassificacao.faixa_etaria == undefined     || dadosClassificacao.faixa_etaria == null      || dadosClassificacao.faixa_etaria.length > 5       ||
                dadosClassificacao.classificacao == ''      || dadosClassificacao.classificacao == undefined    || dadosClassificacao.classificacao == null     || dadosClassificacao.classificacao.length > 50     ||
                dadosClassificacao.caracteristica == ''     || dadosClassificacao.caracteristica == undefined   || dadosClassificacao.caracteristica == null    || dadosClassificacao.caracteristica.length > 1000  ||
                dadosClassificacao.icone == ''              || dadosClassificacao.icone == undefined            || dadosClassificacao.icone == null             || dadosClassificacao.icone.length > 200         
                ) {
                    
                return message.ERROR_REQUIRED_FIELDS //400

            } else {

                let validateStatus = true


                if (validateStatus) {

                    let novaClassificacao = await classificacaoDAO.insertClassificacao(dadosClassificacao)

                    if (novaClassificacao) {

                        novaClassificacaoJSON.classificacao = dadosClassificacao
                        novaClassificacaoJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novaClassificacaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novaClassificacaoJSON.message = message.SUCCESS_CREATED_ITEM.message

                        console.log(novaClassificacao);

                        return novaClassificacaoJSON //201
                        
                    
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

const setAtualizarClassificacao = async function (id, dadoAtualizado, contentType) {
    try {
        let idClassificacao = id

        if (String(contentType).toLowerCase() == 'application/json') {
            let dadosID = classificacaoDAO.selectByIdClassificacao()

            if (idClassificacao == '' || idClassificacao == undefined || idClassificacao == isNaN(idClassificacao) || idClassificacao == null) {
                return message.ERROR_INVALID_ID
            } else if (idClassificacao > dadosID.length) {
                return message.ERROR_NOT_FOUND
            } else {

                let atualizarClassificacaoJSON = {}

                if (dadoAtualizado.faixa_etaria == ''       || dadoAtualizado.faixa_etaria == undefined     || dadoAtualizado.faixa_etaria == null      || dadoAtualizado.faixa_etaria.length > 5       ||
                    dadoAtualizado.classificacao == ''      || dadoAtualizado.classificacao == undefined    || dadoAtualizado.classificacao == null     || dadoAtualizado.classificacao.length > 50     ||
                    dadoAtualizado.caracteristica == ''     || dadoAtualizado.caracteristica == undefined   || dadoAtualizado.caracteristica == null    || dadoAtualizado.caracteristica.length > 1000  ||
                    dadoAtualizado.icone == ''              || dadoAtualizado.icone == undefined            || dadoAtualizado.icone == null             || dadoAtualizado.icone.length > 200 
                ) { 
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    let validateStatus = true

                    if (validateStatus) {

                        let dadosClassificacao = await classificacaoDAO.updateClassificacao(idClassificacao, dadoAtualizado)
                        if (dadosClassificacao) {

                            atualizarClassificacaoJSON.Classificacao = dadosClassificacao
                            atualizarClassificacaoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            atualizarClassificacaoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            atualizarClassificacaoJSON.message = message.SUCCESS_UPDATED_ITEM.message
                            return atualizarClassificacaoJSON //201

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

const setExcluirClassificacao = async function (id) {

    let idClassificacao = id

    if (idClassificacao == '' || idClassificacao == undefined || idClassificacao == isNaN(idClassificacao) || idClassificacao == null) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosClassificacao = await classificacaoDAO.selectByIdClassificacao(idClassificacao)
        let validarId = dadosClassificacao.length

        if (validarId > 0) {

            dadosClassificacao = await classificacaoDAO.deleteClassificacao(idClassificacao)

            return message.SUCCESS_DELETED_ITEM

        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const getListarClassificacoes = async function () {

    let classificacoesJSON = {}

    let dadosClassificacoes = await classificacaoDAO.selectAllClassificacoes()

    if (dadosClassificacoes) {

        classificacoesJSON.Classificacoes = dadosClassificacoes
        classificacoesJSON.quantidade = dadosClassificacoes.length
        classificacoesJSON.status_code = 200

        return classificacoesJSON
    } else {
        return false
    }

}

const getBuscarClassificacao = async function (id) {

    let idClassificacao = id

    let classificacaoJSON = {}

    if (idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosClassificacao = await classificacaoDAO.selectByIdClassificacao(idClassificacao)

        if (dadosClassificacao) {

            if (dadosClassificacao.length > 0) {

                classificacaoJSON.classificacao = dadosClassificacao
                classificacaoJSON.status_code = 200
                return classificacaoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaClassificacao,
    setAtualizarClassificacao,
    setExcluirClassificacao,
    getListarClassificacoes,
    getBuscarClassificacao
}