/***********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
*           aqui realizamos o CRUD (Create, Read, Update, Delete) utilizando a linguagem SQL.
* Data: 11/04/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertGenero = async function (dadosGenero) {

    let sql

    try { 

        sql = `insert into tbl_genero (nome) values ('${dadosGenero.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const updateGenero = async function (id, dadoAtualizado) {
    let sql

    sql = `update tbl_genero set 
        nome = "${dadoAtualizado.nome}"
        where
        id = ${id}`

    console.log(sql)
    let result = await prisma.$executeRawUnsafe(sql)

    if (result) {
        return true
    } else {
        return false
    }

}

const deleteGenero = async function (id) {

    try {
        const sql = `delete from tbl_genero where id = ${id}`
        let rsGenero = await prisma.$executeRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }

}

const selectAllGeneros = async function () {

    let sql = 'select * from tbl_genero'

    let rsGeneros = await prisma.$queryRawUnsafe(sql)

    if (rsGeneros.length > 0)
        return rsGeneros
    else
        return false
}

const selectByIdGenero = async function (id) {

    try {

        let sql = `select * from tbl_genero where id=${id}`

        let rsGenero = await prisma.$queryRawUnsafe(sql)

        return rsGenero

    } catch (error) {

        return false
    }

}

const selectNomeGenero = async function (nome) {

    try {

        let sql = `select * from tbl_genero where nome like '%${nome}%'`

        let rsGenero = await prisma.$queryRawUnsafe(sql)

        return rsGenero


    } catch (error) {

        return false
    }

}

const generoFilme = async function(id){
    try {
        let sql = `SELECT tbl_genero.nome
        FROM tbl_filme_genero
        JOIN tbl_genero ON tbl_filme_genero.tbl_genero_id = tbl_genero.id
        WHERE tbl_filme_genero.tbl_filme_id = ${id}`

        console.log(sql)
        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}

module.exports = {
    insertGenero,
    updateGenero,
    deleteGenero,
    selectAllGeneros,
    selectByIdGenero,
    selectNomeGenero,
    generoFilme
}