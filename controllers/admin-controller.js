

const { request } = require('express')
const Product = require('../models/product-model')
const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle: "Add Product",
        path: '/admin/add-product',
        formCss: true,
        productCSS: true,
        activeAddProduct: true,
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product(null, title, imageUrl, description, price)
    product.save()
    // console.log(products)
    res.redirect('/')
}
exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/')
    }
    const propId = req.params.productId
    Product.findById(propId, product => {
        if (!product) {
            return res.render('/')
        }
        res.render('admin/edit-product', {
            pageTitle: "Add Product",
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        })
    })

}
exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title
    const updatedImageUrl = req.body.imageUrl
    const updatedPrice = req.body.price
    const updatedDescription = req.body.description
    const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice)
    updatedProduct.save()
    res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        })
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteById(prodId)
    res.redirect('/admin/products')
}
