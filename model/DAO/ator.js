/***********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
*           aqui realizamos o CRUD (Create, Read, Update, Delete) utilizando a linguagem SQL.
* Data: 25/04/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

//Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')

//Instância da classe prisma client
const prisma = new PrismaClient()

//Função para inserir um novo ator no Banco de Dados
const insertAtor = async function (dadosAtor) {

    let sql

    try {

        if (dadosAtor.data_falecimento != '' &&
            dadosAtor.data_falecimento != null &&
            dadosAtor.data_falecimento != undefined
        ) {

            sql = `insert into tbl_ator (   nome,
                                            nome_artistico,
                                            data_nascimento,
                                            data_falecimento,
                                            biografia,
                                            foto
            ) values (
                                            '${dadosAtor.nome}',
                                            '${dadosAtor.nome_artistico}',
                                            '${dadosAtor.data_nascimento}',
                                            '${dadosAtor.data_falecimento}',
                                            '${dadosAtor.biografia}',
                                            '${dadosAtor.foto}'
            )`

        } else {
            sql = `insert into tbl_ator (   nome,
                                            nome_artistico,
                                            data_nascimento,
                                            data_falecimento,
                                            biografia,
                                            foto
            ) values (
                                            '${dadosAtor.nome}',
                                            '${dadosAtor.nome_artistico}',
                                            '${dadosAtor.data_nascimento}',
                                            null,
                                            '${dadosAtor.biografia}',
                                            '${dadosAtor.foto}'
            )`
        }

        //$executeRawUnsafe() - serve para executar scripts sem retorno de dados
        //(insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts com retorno de dados (select)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//Função para atualizar um ator no Banco de Dados
const updateAtor = async function (id, dadoAtualizado) {
    let sql

    try {
        if (
            dadoAtualizado.data_falecimento != '' &&
            dadoAtualizado.data_falecimento != null &&
            dadoAtualizado.data_falecimento != undefined
        ) {
            sql = `update tbl_ator set 
                                        nome = "${dadoAtualizado.nome}",
                                        nome_artistico = "${dadoAtualizado.nome_artistico}",
                                        data_nascimento = '${dadoAtualizado.data_nascimento}',
                                        data_falecimento = '${dadoAtualizado.data_falecimento}',
                                        biografia = '${dadoAtualizado.biografia}',
                                        foto = '${dadoAtualizado.foto}'
                                        where
                                        id = ${id}`
        } else {
            sql = `update tbl_ator set 
                                        nome = "${dadoAtualizado.nome}",
                                        nome_artistico = "${dadoAtualizado.nome_artistico}",
                                        data_nascimento = '${dadoAtualizado.data_nascimento}',
                                        biografia = '${dadoAtualizado.biografia}',
                                        foto = '${dadoAtualizado.foto}'
                                        where
                                        id = ${id}`
        }

        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para excluir um ator no Banco de Dados
const deleteAtor = async function (id) {

    try {
        const sql = `delete from tbl_ator where id = ${id}`
        let rsAtor = await prisma.$executeRawUnsafe(sql)
        return rsAtor
    } catch (error) {
        return false
    }

}

//Função para listar todos os atores do Banco de Dados
const selectAllAtores = async function () {

    let sql = 'select * from tbl_ator'

    //$queryRawUnsafe(sql)
    //$queryRaw('select * from tbl_ator')
    let rsAtores = await prisma.$queryRawUnsafe(sql)

    if (rsAtores.length > 0)
        return rsAtores
    else
        return false
}

//Função para buscar um atores do Banco de Dados pelo ID
const selectByIdAtor = async function (id) {

    try {

        //ScriptSQL para buscar um ator pelo ID
        let sql = `select * from tbl_ator where id=${id}`

        //Encaminha o script SQL para o Banco de Dados
        let rsAtor = await prisma.$queryRawUnsafe(sql)

        return rsAtor

    } catch (error) {

        return false
    }

}

const selectNomeAtor = async function (nome) {

    try {

        let sql = `select * from tbl_ator where nome like '%${nome}%'`

        let rsAtor = await prisma.$queryRawUnsafe(sql)

        return rsAtor


    } catch (error) {

        return false
    }

}

module.exports = {
    insertAtor,
    updateAtor,
    deleteAtor,
    selectAllAtores,
    selectByIdAtor,
    selectNomeAtor
}