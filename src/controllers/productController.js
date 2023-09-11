const { v4: uuidv4 } = require('uuid');
const fs = require ('fs');
const path = './src/data/products.json';
const Product = require('../models/Product');
const getAllProducts = async(req, res) => {
    try {
        const limit = req.query.limit;
        let finalLimit;
        if(!limit || isNaN(limit) ){
            finalLimit = null
        }else{
            finalLimit = parseInt(limit);
        }
        fs.access(path,fs.constants.F_OK, (err) => {
            if (err)resolve([]);
            try{
                let contenido =fs.readFileSync(path, 'utf-8');
                let products = JSON.parse(contenido);
                if (!finalLimit){
                    res.status(200).json(products);
                }else if (typeof finalLimit === 'number' && finalLimit >= 0){
                    const productListSlice = products.slice(0, finalLimit);
                    res.status(200).json(productListSlice);
                }else{
                    res.status(400).json({message: 'El valor de "limit" no es válido'});
                }
            }catch(error){
                console.error(error);
                res.status(500).json({message: "Error al obtener la lista de productos"});
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error al obtener la lista de productos"});
    }
};

const getProductById = async(req, res) => {
    try {
        const pid = req.params.pid;
        fs.access(path,fs.constants.F_OK, (err) => {
            if (err)resolve([]);
            let contenido = fs.readFileSync(path, 'utf-8');
            let contenidoJson = JSON.parse(contenido);
            const objectSearched = contenidoJson.find(product => product.id === parseInt(pid));
            objectSearched?res.status(200).json(objectSearched):res.status(404).json({message: 'Producto no encontrado'});
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al obtener el producto'});
    }
};

const addProduct = async (req, res) => {
    const newProductData = req.body;
    const newProduct = new Product(
        uuidv4(),
        newProductData.code,
        newProductData.title,
        newProductData.thumbnail,
        newProductData.description,
        newProductData.price,
        newProductData.stock
    );

    if (!newProductData) {
        res.status(400).json({ message: 'Debe proporcionar los datos solicitados' });
    } else {
        try {
            fs.access(path, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.writeFileSync(path, `[${JSON.stringify(newProduct)}]`);
                    res.status(201).json({ message: 'Producto agregado correctamente' });
                } else {
                    let contenidoJson = fs.readFileSync(path, 'utf-8');
                    let objetoJson = JSON.parse(contenidoJson);
                    const codeExist = objetoJson.find(product => product.code === newProduct.code);
                    if (!codeExist) {
                        objetoJson.push(newProduct);
                        contenidoJson = JSON.stringify(objetoJson);
                        fs.writeFileSync(path, contenidoJson);
                        res.status(201).json({ message: 'Producto agregado correctamente' });
                    } else {
                        res.status(400).json({ message: 'Código de producto ya existe' });
                    };
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al agregar el producto' });
        };
    };
};

const updateProduct = async(req,res) => {
    try{
        const productUpdate = req.body;
        const pid = req.params.pid;
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                reject("El archivo no existe");
                return;
            }
            let contenido = fs.readFileSync(path, 'utf-8');
            let contenidoJson = JSON.parse(contenido);
            const indexToUpdate = contenidoJson.findIndex(product => product.id === pid);
            if (indexToUpdate !== -1) {
                Object.keys(productUpdate).forEach(key => {
                    if (key !== 'pid') {
                        contenidoJson[indexToUpdate][key] = productUpdate[key];
                    }
                });
                let updateProducts = JSON.stringify(contenidoJson);
                fs.writeFileSync(path, updateProducts);
                res.status(201).json({message:'Producto actualizado correctamente'});
            } else {
                res.status(404).json({message: 'Producto a actualizar no existe'});
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el producto'});
    };
};

const deleteProduct = async(req, res) => {
    try{
        const pid = req.params.pid;
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err)resolve([]);
            let contenido = fs.readFileSync(path, 'utf-8');
            let contenidoJson = JSON.parse(contenido);
            const indexToDelete = contenidoJson.findIndex(product => product.id === pid);
            if (indexToDelete !== -1){
                contenidoJson.splice(indexToDelete, 1);
                fs.writeFileSync(path,JSON.stringify(contenidoJson));
                res.status(204).json({message: 'Producto eliminado'});
            }else{
                res.status(404).json({message: 'Producto no encontrado'});
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el producto'});
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}