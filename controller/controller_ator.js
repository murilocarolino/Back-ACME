/***********************************************************************************************************
* Objetivo: Arquivo responsável pelas validações e consistencias de dados de c
* Data: 01/02/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

//Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
//Import do arquivo responsável pela interação como Banco de Dados (model)
const atoresDAO = require('../model/DAO/ator.js')

//Função para validar e inserir um novo Ator
const setInserirNovoAtor = async function (dadosAtor, contentType) {

    try {

        //Validação de content-type (apenas application/json)
        if (String(contentType).toLowerCase() == 'application/json') {

            //Cria o objeto JSON para devolver os dados criados na requisição
            let novoAtorJSON = {}

            //Validação de campos obrigatórios ou com digitação inválida
            if (dadosAtor.nome == ''               || dadosAtor.nome == undefined             || dadosAtor.nome == null              || dadosAtor.nome.length > 100             ||
                dadosAtor.nome_artistico == ''     || dadosAtor.nome_artistico == undefined   || dadosAtor.nome_artistico == null    || dadosAtor.nome_artistico.length > 100   ||
                dadosAtor.data_nascimento == ''    || dadosAtor.data_nascimento == undefined  || dadosAtor.data_nascimento == null   || dadosAtor.data_nascimento.length != 10  ||
                dadosAtor.biografia == ''          || dadosAtor.biografia == undefined        || dadosAtor.biografia == null         || dadosAtor.biografia.length > 1000       ||
                dadosAtor.foto == ''               || dadosAtor.foto == undefined             || dadosAtor.foto == null              || dadosAtor.foto.length > 150
            ) {
                return message.ERROR_REQUIRED_FIELDS //400

            } else {

                let validateStatus = false

                //Validação da data de relançamento, já que ela não é obrigatória no Banco de Dados

                if (dadosAtor.data_falecimento != null &&
                    dadosAtor.data_falecimento != '' &&
                    dadosAtor.data_falecimento != undefined) {

                    //Validação para verificar se a data está com a quantidade de digitos corretos
                    if (dadosAtor.data_falecimento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }
                } else {
                    validateStatus = true
                }

                //Validação para verificar se a variável booleana é verdadeira
                if (validateStatus) {

                    //Encaminha os dados do Ator para o DAO inserir no Banco de Dados
                    let novoAtor = await atoresDAO.insertAtor(dadosAtor)

                    //Validação para verificar se DAO inseriu os dados do Banco
                    if (novoAtor) {

                        //Cria o JSON de retorno dos dados (201)
                        novoAtorJSON.ator = dadosAtor
                        novoAtorJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoAtorJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoAtorJSON //201
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

//Função para atualizar um novo Ator
const setAtualizarAtor = async function (idAtor, dadoAtualizado, contentType) {
    try {

        // Validação de content-type (apenas aplication/json)
        if (String(contentType).toLowerCase() == 'application/json') {
            let dadosID = atoresDAO.selectByIdAtor()

            if (idAtor == '' || idAtor == undefined || idAtor == isNaN(idAtor) || idAtor == null) {
                return message.ERROR_INVALID_ID
            } else if (idAtor > dadosID.length) {
                return message.ERROR_NOT_FOUND
            } else {
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarAtorJSON = {}

                //Validação de campos obrigatórios ou com digitação inválida
                if (dadoAtualizado.nome == ''               || dadoAtualizado.nome == undefined             || dadoAtualizado.nome == null              || dadoAtualizado.nome.length > 100             ||
                    dadoAtualizado.nome_artistico == ''     || dadoAtualizado.nome_artistico == undefined   || dadoAtualizado.nome_artistico == null    || dadoAtualizado.nome_artistico.length > 100   ||
                    dadoAtualizado.data_nascimento == ''    || dadoAtualizado.data_nascimento == undefined  || dadoAtualizado.data_nascimento == null   || dadoAtualizado.data_nascimento.length != 10  ||
                    dadoAtualizado.biografia == ''          || dadoAtualizado.biografia == undefined        || dadoAtualizado.biografia == null         || dadoAtualizado.biografia.length > 1000       ||
                    dadoAtualizado.foto == ''               || dadoAtualizado.foto == undefined             || dadoAtualizado.foto == null              || dadoAtualizado.foto.length > 150
                ) {              
                    return message.ERROR_REQUIRED_FIELDS
                }

                else {
                    let validateStatus = false

                    // Outra validação com campos obrigatorios ou com digitação inválida
                    if (dadoAtualizado.data_falecimento != null &&
                        dadoAtualizado.data_falecimento != ''   &&
                        dadoAtualizado.data_falecimento != undefined) {
                            console.log("22")

                        if (dadoAtualizado.data_falecimento.length != 10) {
                            return message.ERROR_REQUIRED_FIELDS//400
                        } else {
                            validateStatus = true
                        }
                    } else {

                        validateStatus = true
                    }

                    // Validação para verificar se a variavel booleana é verdadeira
                    if (validateStatus) {
                        console.log("11")

                        // Encaminha os dados do ator para o DAO inserir no DB
                        let dadosAtor = await atoresDAO.updateAtor(idAtor, dadoAtualizado)

                        // if(atualizarAtor){
                        //     let idAtores = await atoresDAO.IDAtor()
                        //     console.log(idAtores)
                        //     dadoAtualizado.id = Number(idAtores[0].id)
                        // }
                        console.log("rsere")

                        // Validação para verificar se o DAO inseriu os dados do DB
                        if (dadosAtor) {

                            //Cria o JSON de retorno dos dados (201)
                            atualizarAtorJSON.ator = dadosAtor
                            atualizarAtorJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            atualizarAtorJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            atualizarAtorJSON.message = message.SUCCESS_UPDATED_ITEM.message
                            return atualizarAtorJSON //201

                        } else {
                            return message.ERROR_INTERNAL_SERVER_DB //500
                        }
                    } else {
                        validateStatus = false
                    }
                    console.log("9999")

                }

            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log("0000")
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

//Função para excluir um novo Ator
const setExcluirAtor = async function (id) {

    let idAtor = id

    if (idAtor == '' || idAtor == undefined || idAtor == isNaN(idAtor) || idAtor == null) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosAtor = await atoresDAO.selectByIdAtor(idAtor)
        let validarId = dadosAtor.length

        if (validarId > 0) {

            dadosAtor = await atoresDAO.deleteAtor(idAtor)

            return message.SUCCESS_DELETED_ITEM

        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

//Função para listar todos os Atores
const getListarAtores = async function () {

    //Cria um objeto JSON
    let atoresJSON = {}

    //Chama a função do DAO que retorna os atores do Banco de Dados
    let dadosAtores = await atoresDAO.selectAllAtores()

    //Validação para verificar se o DAO retornou dados
    if (dadosAtores) {
        //Cria o JSON para retornar para o APP
        atoresJSON.atores = dadosAtores
        atoresJSON.quantidade = dadosAtores.length
        atoresJSON.status_code = 200

        return atoresJSON
    } else {
        return false
    }

}

//Função para buscar um novo Ator
const getBuscarAtor = async function (id) {

    //Recebe o ID do Ator
    let idAtor = id

    //Cria o objeto JSON
    let atorJSON = {}

    //Validação para verificar se ID é válido (vazio, indefinido e não numérico)
    if (idAtor == '' || idAtor == undefined || isNaN(idAtor)) {
        return message.ERROR_INVALID_ID
    } else {

        //Encaminha para o DAO localizar o ID do Ator
        let dadosAtor = await atoresDAO.selectByIdAtor(idAtor)

        //Validação para verificar se existem dados de retorno
        if (dadosAtor) {

            //Validação para verificar a quantidade de itens encontrados
            if (dadosAtor.length > 0) {

                //Cria o JSON de retorno
                atorJSON.ator = dadosAtor
                atorJSON.status_code = 200

                return atorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

const getNomeAtor = async function (nome) {

    let nomeAtor = nome

    let atorJSON = {}

    if (nomeAtor == '' || nomeAtor == undefined) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosAtor = await atoresDAO.selectNomeAtor(nomeAtor)

        if (dadosAtor) {

            if (dadosAtor.length > 0) {

                atorJSON.ator = dadosAtor
                atorJSON.status_code = 200

                return atorJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoAtor,
    setAtualizarAtor,
    setExcluirAtor,
    getListarAtores,
    getBuscarAtor,
    getNomeAtor
}