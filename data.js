module.exports = {
     fincas: [
        {
            id: 001,
            nombre: "Viña Alta",
            lat: "-33.666267",
            long: "-69.196064",
            direccion: "Clodomiro Silva s/n, M5565, Mendoza"
        },
        {
            id: 002,
            nombre: "Los Viñedos",
            lat: "-33.552640466593786",
            long: "-69.20817146212644",
            direccion: "Ruta provincial 92, M5515 Vista Flores, Mendoza"
        },
        {
            id: 003,
            nombre: "Viña Baja",
            lat: "-33.666267",
            long: "-69.196064",
            direccion: "Lencinas, Clodomiro Silva y, Vista Flores, Mendoza"
        },
        {
            id: 004,
            nombre: "Mezzonine",
            lat: "-33.666267",
            long: "-69.196064",
            direccion: "Carril Los Sauces Vista flores, M5565 Los Sauces, Mendoza"
        },
        {
            id: 005,
            nombre: "Ground Vines",
            lat: "-33.666267",
            long: "-69.196064",
            direccion: "Ruta 94 km 11, M5560 Los Sauces, Mendoza"
        }
    ],
    uvas: [
        {
            id: 001,
            varietal: "Malbec",
            vintage: 2019
        },
        {
            id: 002,
            varietal: "Cabernet",
            vintage: 2018
        },
        {
            id: 003,
            varietal: "Merlot",
            vintage: 2020
        },
        {
            id: 004,
            varietal: "Tannat",
            vintage: 2021
        },
        {
            id: 005,
            varietal: "Bonarda",
            vintage: 2016
        }
    ],
    vinos: [
        {
            id: 001,
            precio: 350,
            idUvas: 001,
            varietal: "Malbec"
        },
        {
            id: 002,
            precio: 300,
            idUvas: 002,
            varietal: "Cabernet"
        },
        {
            id: 003,
            precio: 250,
            idUvas: 003,
            varietal: "Merlot"
        },
        {
            id: 004,
            precio: 150,
            idUvas: 003,
            varietal: "Merlot"
        },
        {
            id: 005,
            precio: 550,
            idUvas: 001,
            varietal: "Malbec"
        }
    ]
}
