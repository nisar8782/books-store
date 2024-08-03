const Product = require('../models/product-model')
const Cart = require('../models/cart');
const { where } = require('sequelize');
const CartItem = require('../models/cart-item');


exports.getProducts = (req, res, next) => {
    // console.log('shop', adminData.products)
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        })
    }).catch(err => {
        console.log(err)
    });

}
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/product'
        })
    }).catch(err => {
        console.log(err)
    })


}

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        })
    }).catch(err => {
        console.log(err)
    });

}

exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart => {
        return cart.getProducts().then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            })
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
}
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1
    req.user.getCart().then(cart => {
        fetchedCart = cart
        return cart.getProducts({ where: { id: prodId } })
    }).then(products => {
        let product;
        if (products.length > 0) {
            product = products[0]

        }

        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1
            console.log(newQuantity)
            return product
        }
        return Product.findByPk(prodId)
    }).then(product => {
        return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }
        })
    }).then(() => {
        res.redirect('/cart')
    }).catch(err => {
        console.log(err)
    })
    // Product.findByPk(prodId, (product) => {
    //     Cart.addProduct(prodId, product.price)
    // })
    // console.log(prodId)
    // res.redirect('/cart')
}

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    req.user.getCart().then(cart => {
        fetchedCart = cart
        return cart.getProducts({ where: { id: prodId } })
    }).then(products => {
        if (products.length > 0) {
            const product = products[0]
            return product.cartItem.destroy()

        }
    }).then(() => {
        res.redirect('/cart')
    }).catch(err => {
        console.log(err)
    })
    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price)
    //     res.redirect('/cart')
    // })

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}

exports.postOrder = (req, res, next) => {
    let cartProducts;
    let fetchedCart;
    req.user.getCart().then(cart => {
        fetchedCart = cart
        return cart.getProducts();
    }).then(products => {
        cartProducts = products
        return req.user.createOrder()
    }).then(order => {
        return order.addProducts(cartProducts.map(prod => {
            prod.orderItem = { quantity: prod.cartItem.quantity }
            return prod
        }))
    }).then(result => {
        return fetchedCart.setProducts(null)

    }).then(() => {
        res.redirect('/orders')
    }).catch(err => {
        console.log(err)
    })
}
exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] }).then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Orders',
            orders: orders
        })
    }).catch(err => {
        console.log(err)
    })

}