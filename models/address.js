const db = require('../config/config');

const Address = {};

Address.create = (address) => {
    const sql = `
    INSERT INTO
        address(
            id_user,
            address,
            neighborhood,
            lat,
            lng,
            created_at,
            updated_at
        )

        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;

    return db.oneOrNone(sql, [
        address.id_user,
        address.address,
        address.neighborhood,
        address.lat,
        address.lng,
        new Date(),
        new Date()
    ]);
},

Address.findByUser = (id_user) => {
    const sql = `
    select 
        id,
        id_user,
        address,
        neighborhood,
        lat,
        lng
    from 
        address 
    where
    id_user = $1
    `;

    return db.manyOrNone(sql, id_user)
}

module.exports = Address;