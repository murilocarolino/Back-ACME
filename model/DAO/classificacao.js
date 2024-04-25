/***********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação de dados no Banco de Dados MySQL,
*           aqui realizamos o CRUD (Create, Read, Update, Delete) utilizando a linguagem SQL.
* Data: 18/04/2024
* Autor: Murilo C.
* Versão: 1.0
***********************************************************************************************************/

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertClassificacao = async function (dadosClassificacao) {

    

    try { 

        let sql

        sql = `insert into tbl_classificacao (
                                            faixa_etaria,
                                            classificacao,
                                            caracteristica,
                                            icone
            ) values (
                                            '${dadosClassificacao.faixa_etaria}',
                                            '${dadosClassificacao.classificacao}',
                                            '${dadosClassificacao.caracteristica}',
                                            '${dadosClassificacao.icone}'
            );`

            console.log(sql);
            
        let result = await prisma.$executeRawUnsafe(sql)

        

        if (result)
            return true
          
        else
            return false

    
    } catch (error) {
        return false
    }

   
}

const updateClassificacao = async function (id, dadoAtualizado) {
    let sql

    sql = `update tbl_classificacao set 
                                        faixa_etaria = "${dadoAtualizado.faixa_etaria}",
                                        classificacao = "${dadoAtualizado.classificacao}",
                                        caracteristica = "${dadoAtualizado.caracteristica}",
                                        icone = "${dadoAtualizado.icone}"
        where
                                        id = ${id}`

    let result = await prisma.$executeRawUnsafe(sql)

    if (result) {
        return true
    } else {
        return false
    }

}

const deleteClassificacao = async function (id) {

    try {
        const sql = `delete from tbl_classificacao where id = ${id}`
        let rsClassificacao = await prisma.$executeRawUnsafe(sql)
        return rsClassificacao
    } catch (error) {
        return false
    }

}

const selectAllClassificacoes = async function () {

    let sql = 'select * from tbl_classificacao'

    let rsClassificacoes = await prisma.$queryRawUnsafe(sql)

    if (rsClassificacoes.length > 0)
        return rsClassificacoes
    else
        return false
}


const selectByIdClassificacao = async function (id) {

    try {

        let sql = `select * from tbl_classificacao where id=${id}`

        let rsClassificacao = await prisma.$queryRawUnsafe(sql)

        return rsClassificacao

    } catch (error) {

        return false
    }

}

const selectNomeClassificacao = async function (nome) {

    try {

        let sql = `select * from tbl_classificacao where nome like '%${nome}%'`

        let rsClassificacao = await prisma.$queryRawUnsafe(sql)

        return rsClassificacao


    } catch (error) {

        return false
    }

}

module.exports = {
    insertClassificacao,
    updateClassificacao,
    deleteClassificacao,
    selectAllClassificacoes,
    selectByIdClassificacao,
    selectNomeClassificacao
}