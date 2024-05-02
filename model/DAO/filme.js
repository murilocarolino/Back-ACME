/***********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
*           aqui realizamos o CRUD (Create, Read, Update, Delete) utilizando a linguagem SQL.
* Data: 01/02/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

//Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')

//Instância da classe prisma client
const prisma = new PrismaClient()

//Função para inserir um novo filme no Banco de Dados
const insertFilme = async function (dadosFilme) {

    let sql

    try {

        if (dadosFilme.data_relancamento != '' &&
            dadosFilme.data_relancamento != null &&
            dadosFilme.data_relancamento != undefined
        ) {

            sql = `insert into tbl_filme (  nome,
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario,
                                            tbl_classificacao_id
            ) values (
                                            '${dadosFilme.nome}',
                                            '${dadosFilme.sinopse}',
                                            '${dadosFilme.duracao}',
                                            '${dadosFilme.data_lancamento}',
                                            '${dadosFilme.data_relancamento}',
                                            '${dadosFilme.foto_capa}',
                                            '${dadosFilme.valor_unitario}',
                                            '${dadosFilme.tbl_classificacao_id}'
            )`

        } else {
            sql = `insert into tbl_filme (  nome,
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario,
                                            tbl_classificacao_id
            ) values (
                                            '${dadosFilme.nome}',
                                            '${dadosFilme.sinopse}',
                                            '${dadosFilme.duracao}',
                                            '${dadosFilme.data_lancamento}',
                                            null,
                                            '${dadosFilme.foto_capa}',
                                            '${dadosFilme.valor_unitario}',
                                            '${dadosFilme.tbl_classificacao_id}'
            )`
        }

        //$executeRawUnsafe() - serve para executar scripts sem retorno de dados
        //(insert, update e delete)
        //$queryRawUnsafe() - serve para executar scripts com retorno de dados (select)
        let result = await prisma.$executeRawUnsafe(sql)
        console.log(result)
        console.log(sql);

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//Função para atualizar um filme no Banco de Dados
const updateFilme = async function (id, dadoAtualizado) {
    let sql
    try {
        if (dadoAtualizado.data_relancamento != '' &&
            dadoAtualizado.data_relancamento != null &&
            dadoAtualizado.data_relancamento != undefined) {
            sql = `update tbl_filme set 
            nome = "${dadoAtualizado.nome}",
            sinopse = "${dadoAtualizado.sinopse}",
            duracao = '${dadoAtualizado.duracao}',
            data_lancamento = '${dadoAtualizado.data_lancamento}',
            data_relancamento = '${dadoAtualizado.data_relancamento}',
            foto_capa = '${dadoAtualizado.foto_capa}',
            valor_unitario = '${dadoAtualizado.valor_unitario}'
            id_classificacao = '${dadosFilme.id_classificacao}'
            where
            id = ${id}`
        } else {
            sql = `update tbl_filme set 
            nome = "${dadoAtualizado.nome}",
            sinopse = "${dadoAtualizado.sinopse}",
            duracao = '${dadoAtualizado.duracao}',
            data_lancamento = '${dadoAtualizado.data_lancamento}',
            foto_capa = '${dadoAtualizado.foto_capa}',
            valor_unitario = '${dadoAtualizado.valor_unitario}',
            id_classificacao = '${dadosFilme.id_classificacao}'
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

//Função para excluir um filme no Banco de Dados
const deleteFilme = async function (id) {

    try {
        const sql = `delete from tbl_filme where id = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }

}

//Função para listar todos os filmes do Banco de Dados
const selectAllFilmes = async function () {

    let sql = 'select * from tbl_filme'

    //$queryRawUnsafe(sql)
    //$queryRaw('select * from tbl_filme')
    let rsFilmes = await prisma.$queryRawUnsafe(sql)

    if (rsFilmes.length > 0)
        return rsFilmes
    else
        return false
}


//Função para buscar um filmes do Banco de Dados pelo ID
const selectByIdFilme = async function (id) {

    try {

        //ScriptSQL para buscar um filme pelo ID
        let sql = `select * from tbl_filme where id=${id}`

        //Encaminha o script SQL para o Banco de Dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)

        return rsFilme

    } catch (error) {

        return false
    }

}

const selectNomeFilme = async function (nome) {

    try {

        let sql = `select * from tbl_filme where nome like '%${nome}%'`

        let rsFilme = await prisma.$queryRawUnsafe(sql)

        return rsFilme


    } catch (error) {

        return false
    }

}

const filmeAtor = async function (id) {

    try {

        let sql = `SELECT a.nome AS nome_ator
        FROM tbl_filme_ator fa
        JOIN tbl_ator a ON fa.tbl_ator_id = a.id
        WHERE fa.tbl_filme_id = ${id}`

        let rsDiretor = await prisma.$queryRawUnsafe(sql)

        return rsDiretor


    } catch (error) {

        return false
    }

}

const IDFilme = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectNomeFilme,
    filmeAtor,
    IDFilme
}