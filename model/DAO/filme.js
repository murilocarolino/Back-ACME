/***********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
*           aqui realizamos o CRUD (Create, Read, Update, Delete) utilizando a linguagem SQL.
* Data: 01/02/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

//Import da biblioteca do prisma client
const { PrismaClient} = require('@prisma/client')

//Instância da classe prisma client
const prisma = new PrismaClient()

//Função para inserir um novo filme no Banco de Dados
const insertFilme = async function(dadosFilme) {

    let sql

    try {

        if( dadosFilme.data_relancamento != ''      &&
            dadosFilme.data_relancamento != null    &&
            dadosFilme.data_relancamento != undefined
        ){

            sql = `insert into tbl_filme (  nome,
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario
            ) values (
                                            '${dadosFilme.nome}',
                                            '${dadosFilme.sinopse}',
                                            '${dadosFilme.duracao}',
                                            '${dadosFilme.data_lancamento}',
                                            '${dadosFilme.data_relancamento}',
                                            '${dadosFilme.foto_capa}',
                                            '${dadosFilme.valor_unitario}'
            )`

        } else {
            sql = `insert into tbl_filme (  nome,
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario
            ) values (
                                            '${dadosFilme.nome}',
                                            '${dadosFilme.sinopse}',
                                            '${dadosFilme.duracao}',
                                            '${dadosFilme.data_lancamento}',
                                            null,
                                            '${dadosFilme.foto_capa}',
                                            '${dadosFilme.valor_unitario}'
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

//Função para atualizar um filme no Banco de Dados
const updateFilme = async function(id, dadosFilme) {

    try {
        
        let sql

        if( dadosFilme.data_relancamento != ''      &&
            dadosFilme.data_relancamento != null    &&
            dadosFilme.data_relancamento != undefined
        ){

            sql = `update tbl_filme set nome =              '${dadosFilme.nome}',
                                        sinopse =           '${dadosFilme.sinopse}',
                                        duracao =           '${dadosFilme.duracao}',
                                        data_lancamento =   '${dadosFilme.data_lancamento}',
                                        data_relancamento = '${dadosFilme.data_relancamento}',
                                        foto_capa =         '${dadosFilme.foto_capa}',
                                        valor_unitario =    '${dadosFilme.valor_unitario}'
                                        where id =           ${id}`

        } else {
            sql = `update tbl_filme set nome =              '${dadosFilme.nome}',
                                        sinopse =           '${dadosFilme.sinopse}',
                                        duracao =           '${dadosFilme.duracao}',
                                        data_lancamento =   '${dadosFilme.data_lancamento}',
                                        data_relancamento = '${dadosFilme.data_relancamento}',
                                        foto_capa =         '${dadosFilme.foto_capa}',
                                        valor_unitario =    '${dadosFilme.valor_unitario}'
                                        where id =           ${id}`
        }

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false

        } catch (error) {
            return false
    }
}

//Função para excluir um filme no Banco de Dados
const deleteFilme = async function(id) {

    try {
        const sql = `delete from tbl_filme where id = ${id}`
        let rsFilme = await prisma.$executeRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }

}

//Função para listar todos os filmes do Banco de Dados
const selectAllFilmes = async function() {

    let sql = 'select * from tbl_filme'

    //$queryRawUnsafe(sql)
    //$queryRaw('select * from tbl_filme')
    let rsFilmes = await prisma.$queryRawUnsafe(sql)

    if(rsFilmes.length > 0)
        return rsFilmes
    else
        return false
}


//Função para buscar um filmes do Banco de Dados pelo ID
const selectByIdFilme = async function(id) {

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

const selectNomeFilme = async function(nome) {

    try {

        let sql = `select * from tbl_filme where nome like '%${nome}%'`

        let rsFilme = await prisma.$queryRawUnsafe(sql)

        return rsFilme


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
    selectNomeFilme
}