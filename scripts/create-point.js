function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => { return res.json() } ) //a palavra return e as chaves são opcionais quando o retorno é simples
    .then( states => {
        for(const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    } )                                   //não é necessário parentesis em funções anônimas com apenas um parâmetro
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]") //select e input são optativos
    const stateInput = document.querySelector("input[name=state]")
    const ufValue = event.target.value
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    fetch(url)
    .then( (res) => { return res.json() } )
    .then( cities => {
        for(const city of cities){
            citySelect.innerHTML += `<option value="${city.id}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)