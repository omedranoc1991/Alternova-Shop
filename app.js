/* Selecciono el id de la etiqueta donde van a estar alojados mis productos
y el id de la etiqueta que contiene el template */

const products = document.getElementById("products")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCart = document.getElementById("template-cart").content
const fragment = document.createDocumentFragment()

//Llamar informacion del archivo JSON
let allProducts  
let initialProducts
fetch('data.json')
  .then(response => response.json())
  .then(data => {	
      allProducts = data.products
      initialProducts = data.products  
  	printCards(allProducts)
  });

const data =  fetch('data.json')
.then(response => response.json())



const printCards = (data) => {
    
    data.forEach(product => {
        templateCard.querySelector("h5").textContent = product.name
        templateCard.querySelector("span").textContent = product.unit_price
        templateCard.querySelectorAll("p")[1].textContent = product.stock 
        templateCard.querySelectorAll("p")[1].id = product.id+"_"+"stock id"
        templateCard.querySelector("img").setAttribute("src", product.img)
        templateCard.querySelector(".btn-primary").dataset.id = product.id
        templateCard.querySelector(".btn-primary").id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    products.appendChild(fragment)
}

let cart = {}

products.addEventListener("click", e =>{
    addToCart(e, allProducts)
})

const addToCart = (e, data) =>{
    
    if(e.target.classList.contains("btn-primary") && e.target.parentElement.querySelectorAll('p')[1].textContent > 0  ){
        setCart(e.target.parentElement)
        console.log("this is the data")
        console.log(data)
        console.log( e.srcElement.id)
        console.log(data.filter(product =>  product.id == e.srcElement.id))
        const stockValue = --data.filter(product => product.id == e.srcElement.id)[0].stock         
        e.target.parentElement.querySelectorAll('p')[1].textContent = stockValue
        
    }
    else{e.target.classList.contains("btn-primary") && alert("No units available")}
    e.stopPropagation()
}

const setCart = object =>{
    
    const productSelected = {
        id : object.querySelector(".btn-primary").dataset.id,
        name: object.querySelector("h5").textContent,
        price: object.querySelector("span").textContent,
        stock: object.querySelectorAll("p")[1].textContent ,
        amount: 1
    }
    if(cart.hasOwnProperty(productSelected.id) ){
        productSelected.amount =cart[productSelected.id].amount + 1
        
    }
    cart[productSelected.id] = {...productSelected}
    printCart()
}

const printCart = () =>{

    items.innerHTML= ""
    Object.values(cart).forEach(product => {
        templateCart.querySelector("th").textContent = product.id
        templateCart.querySelectorAll("td")[0].textContent = product.name
        templateCart.querySelectorAll("td")[1].textContent = product.stock
        templateCart.querySelectorAll("td")[2].textContent = product.amount
        templateCart.querySelectorAll("td")[3].textContent = product.price
        templateCart.querySelector(".btn-info").dataset.id = product.id
        templateCart.querySelector(".btn-danger").dataset.id = product.id
        templateCart.querySelector("span").textContent = product.amount * product.price 

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    printFooter()
}

const printFooter = () =>{
    footer.innerHTML = ""
    if(Object.keys(cart).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Empty cart, lets to buy !</th>`
        return
    }
    const xAmount = Object.values(cart).reduce((acc, {amount}) => acc + amount, 0)
    const xPrice = Object.values(cart).reduce((acc, {amount,price}) => acc + amount * price, 0)

    templateFooter.querySelectorAll('td')[1].textContent = xAmount
    templateFooter.querySelector("span").textContent = xPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btEmpty = document.getElementById("empty-cart")
    btEmpty.addEventListener("click", ()=>{
        console.log("Objecto Json con la order: ")
        console.log(JSON.stringify({totalPrice: xPrice, products : cart } ))
        })
    }
 

items.addEventListener("click", e =>{
    btnAction(e, allProducts)
})

const btnAction = (e, data) =>{
    
    if(e.target.classList.contains("btn-info") ){
        
        const product = cart[e.target.dataset.id]
        if(cart[e.target.dataset.id].amount +1 <= cart[e.target.dataset.id].stock){
            product.amount++
            const stockValue = --data.filter(product => product.id == e.target.dataset.id)[0].stock 
            document.getElementById(e.target.dataset.id+"_"+"stock id").textContent = stockValue  
        }
         
             
        cart[e.target.dataset.id] = {...product}
        printCart()
    }
    if(e.target.classList.contains("btn-danger")){
        const product = cart[e.target.dataset.id]
        product.amount--  
        console.log("take product out")
        console.log(data)
        const stockValue = ++data.filter(product => product.id == e.target.dataset.id)[0].stock
        console.log(stockValue )
        console.log(e.target.dataset.id)
        document.getElementById(e.target.dataset.id+"_"+"stock id").textContent = stockValue 
        console.log(data)      
        console.log(cart)      
        if(product.amount === 0){
            delete cart[e.target.dataset.id]
            console.log(cart) 
        }
        
        printCart()
    }
    e.stopPropagation()
}

