const express = require("express")
const server = express()

//pegar o bacno de dados
const db = require("./database/db.js")

//configurar pasta pública
server.use(express.static("public")) // .use serve para fazer alterações no express

//habilitar o uso do req body na aplicação
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da minha aplicação
//página inicial
//req: requisição
//res: reposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    
    //req.query : Query Strings da url

    return res.render("create-point.html")
})

// verbo HTML post: envio de informações sem permitir o acesso do usuário
server.post("/savepoint", (req, res) => {

    //req.body: O corpo do formulário
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.render("point-error.html", { error: true })
        }

        console.log("Cadastrado com sucesso!")
        console.log(this) //para funções this não se usa arrow functions!
       
        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)

})

server.get("/search-results", (req, res) => {
    
    const search = req.query.search
    /* if(search == "") {
        //pesquisa vazia não retorna resultados
        return res.render("search-results.html", { total: 0 })
    } */

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }
        console.log("Aqui estão seus registros: ")
        console.log(rows)

        const total = rows.length

    //mostrar a página html com os dados do banco de dados
    return res.render("search-results.html", { places: rows, total: total })
    })
})

//ligar o servidor
server.listen(3000)