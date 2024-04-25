var acmeFilmes = require ('../modulo/filmes.js')

const listarFilmes = () => {
    let todosFilmes = acmeFilmes.listaDeFilmes.filmes
    let status = false
    let filmesArray = []
    let filmeJson = {}

    todosFilmes.forEach((filme) => {
        let filmeInfo = {
            id: filme.id,
            nome: filme.nome,
            sinopse: filme.sinopse,
            duracao: filme.duracao,
            dataLancamento: filme.data_lancamento,
            dataRelancamento: filme.data_relancamento,
            fotoCapa: filme.foto_capa,
            valor: filme.valor_unitario
        }

        status = true
        filmesArray.push(filmeInfo)
    })

    filmeJson.filmes = filmesArray

    if (status) {
        return filmeJson
    } else {
        return false
    }
}

const buscarFilmesId = (id) => {
    let todosFilmes = acmeFilmes.listaDeFilmes.filmes
    let status = false
    let filmesArray = []
    let filmeJson = {}   
    let infoFilmes = {}
    let filmesId = id

    todosFilmes.forEach((filme) =>{
        if (filme.id == filmesId){
            infoFilmes = {
                id: filme.id,
                nome: filme.nome,
                sinopse: filme.sinopse,
                duracao: filme.duracao,
                dataLancamento: filme.data_lancamento,
                dataRelancamento: filme.data_relancamento,
                fotoCapa: filme.foto_capa,
                valor: filme.valor_unitario
            }
            status = true
            filmesArray.push(infoFilmes)
        }
        
    })

        filmeJson.filmes = filmesArray

if (status){
    return filmeJson
} else {
    return false
}
}

//console.log(listarFilmes())
console.log(buscarFilmesId(2))