const { v4: uuidv4 } = require('uuid');
const fs = require ('fs');
const path = './src/data/cart.json';
const Cart = require('../models/Cart');

const addCart = async(req, res) => {
    const newCartData = req.body;
    const newCart = new Cart(
        uuidv4(),
        newCartData.products
    );
    if (Object.keys(newCartData).length === 0) {
        res.status(400).json({message: 'Debe proporcionar los datos solicitados'});
    } else {
        try{
            fs.access(path,fs.constants.F_OK, (err) => {
                if (err){
                    fs.writeFileSync(path, `[${JSON.stringify(newCart)}]`);
                    res.status(201).json({message:'Carrito agregado correctamente'});
                }else{
                    let contenidoJson = fs.readFileSync(path, 'utf-8');
                    let objetoJson = JSON.parse(contenidoJson);
                    objetoJson.push(newCart);
                    contenidoJson = JSON.stringify(objetoJson);
                    fs.writeFileSync(path, contenidoJson);
                    res.status(201).json({message:'Carrito agregado correctamente'});
                }
            } );
        }catch(error){
            console.log(error);
            res.status(500).json({message: 'Error al agregar el carrito'});
        };
    };
};

const getCartById = async(req, res) => {
    try {
        const cid = req.params.cid;
        console.log("cid de carrito: ", cid);
        fs.access(path,fs.constants.F_OK, (err) => {
            if (err)resolve([]);
            let contenido = fs.readFileSync(path, 'utf-8');
            let contenidoJson = JSON.parse(contenido);
            console.log("listado de carritos: ", contenidoJson);
            const cartSearched = contenidoJson.find(cart => cart.cid === cid);
            console.log("carrito: ", cartSearched);
            cartSearched?res.status(200).json(cartSearched.products):res.status(404).json({message: 'Carrito no encontrado'});
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al obtener el carrito'});
    }
};

const addProductToCart = async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try{
        fs.access(path,fs.constants.F_OK, (err) => {
            let contenidoJson = fs.readFileSync(path, 'utf-8');
            let objetoJson = JSON.parse(contenidoJson);
            const cartIndex = objetoJson.findIndex(cart => cart.cid === cid)
            if(cartIndex !== -1){
                const indexProduct = objetoJson[cartIndex].products.findIndex(product => product.productId === pid);
                if(indexProduct !== -1){
                    objetoJson[cartIndex].products[indexProduct].quantity++;
                    res.status(201).json({message: 'producto agregado correctamente al carro'});
                }else{
                    const newCartProduct = {
                        productId: pid,
                        quantity: 1
                    }
                    objetoJson[cartIndex].products.push(newCartProduct);
                    res.status(201).json({message: 'producto agregado correctamente al carro'});
                }
                fs.writeFileSync(path, JSON.stringify(objetoJson));
            }else{
                res.status(404).json({message: 'el carrito no existe'});
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al agregar producto en el carro'});
    }
};


module.exports = {
    addCart,
    getCartById,
    addProductToCart
}