
const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //fetch the previous products
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            let updatedProduct;
            if (!err) {
                cart = JSON.parse(fileContent);

                // analyze the cart => find existing product
                const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
                const existingProduct = cart.products[existingProductIndex]
                // add new product/increase quantity

                if (existingProduct) {
                    updatedProduct = { ...existingProduct }
                    updatedProduct.qty = updatedProduct.qty + 1
                    cart.products = [...cart.products]
                    cart.products[existingProductIndex] = updatedProduct
                } else {
                    updatedProduct = { id: id, qty: 1 }
                    cart.products = [...cart.products, updatedProduct];
                }
                cart.totalPrice = cart.totalPrice + +productPrice

            } else {
                updatedProduct = { id: id, qty: 1 }
                cart.products = [...cart.products, updatedProduct];
                cart.totalPrice = +productPrice
            }
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    console.log(err)
                }
            }

            )
        })


    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart }
            const product = updatedCart.products.find(prod => prod.id = id)
            if (!product) {
                return
            }
            const productQty = product.qty
            updatedCart.products = updatedCart.products.filter(p => p.id !== id)
            updatedCart.totalPrice = cart.totalPrice - productPrice * productQty
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                if (err) {
                    console.log(err)
                }
            })
        })
    }
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null)
            } else {
                const cart = JSON.parse(fileContent)
                cb(cart)
            }

        })
    }
}