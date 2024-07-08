const { getAll } = require('../models/category');
const Category = require('../models/category');
const User = require('../models/user');
const { create } = require('../models/user');
const storage = require('../utils/cloud_storage');

module.exports = {
    async create(request, response, next) {
        try {
            const category = JSON.parse(request.body.category);
            console.log('Category', category);

            const files = request.files;
            if(files.length > 0) {
                const pathImage = `Image_${Date.now()}`;
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    category.image = url;
                }
            }

            const data = await Category.create(category);

            return response.status(201).json({
                success: true,
                message: 'La categoria se ha creado correctamente',
                data: {
                    'id': data.id
                }
            });

        } catch(error) {
            console.log('Error', error);

            return response.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error
            });
        }
    },

    async getAll(request, response, next) {
        try {
            const data = await Category.getAll();
            
            return response.status(201).json(data);
        } catch (error) {
            console.log('Error', error);

            return response.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error
            });
        }
    }
}