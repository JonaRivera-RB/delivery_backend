const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');
const { create } = require('../models/category');
const { findByCategory } = require('../models/product');

module.exports = {
    
    async create(request, response, next) {
        let product = JSON.parse(request.body.product);

        const files = request.files;
        let inserts = 0;

        if(files.length === 0) {
            return response.status(501).json({
                message: 'Error al registrar el producto no tiene imagen',
                success: false
            });
        } else {
            try {

                const data = await Product.create(product);
                product.id = data.id;

                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);

                        if (url !== undefined &&  url !== null) {
                            if(inserts == 0) {
                                product.image1 = url;
                            } else if(inserts == 1) {
                                product.image2 = url;
                            } else {
                                product.image3 = url;
                            }
                        }

                        await Product.update(product);
                        inserts += 1;

                        if(inserts == files.length) {
                            return response.status(201).json({
                                success: true,
                                message: 'El producto se ha guardado exitosamente'
                            });
                        }
                    });
                }

                start();

            }catch (error) {
                console.log(`error: ${error}`);

                return response.status(501).json({
                    message: `Error al registrar el producto ${error}`,
                    success: false,
                    error: error
                });
            }
        }
    },

    async findByCategory(request, response, next) {
        try {

            const id_category = request.params.id_category;
            const data = await Product.findByCategory(id_category);
            return response.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return response.status(501).json({
                message: 'Error al listar los productos por categoria',
                success: false,
                error: error
            });
        }
    }
}