let Web3 = require('web3');
let data = require('./data.js');
let fincas = data.fincas;
let uvas = data.uvas;
let vinos = data.vinos;
let accounts;
// Contract config
let web3 = new Web3();
web3.setProvider(
    new web3.providers.HttpProvider('http://127.0.0.1:7545')
);

(async () => {
    accounts = await web3.eth.getAccounts();

    let adminAddress = accounts[0];
    let producerAddress = accounts[1];
    let dstributorAddress = accounts[2];
    let retailerAddress = accounts[3];
    let consumerAddress = accounts[4];

    let wineSupplyChainContract = require("./build/contracts/WineSupplyChain");
    const networkId = await web3.eth.net.getId();
    // Retrieve the Network configuration from truffle-config.js file
    const deployedNetwork = wineSupplyChainContract.networks[networkId];
    // Initializing the contract
    const WineSupplyChain = new web3.eth.Contract(
      wineSupplyChainContract.abi,
      deployedNetwork.address
    );
    
    sendTransactions()
        .then(() => console.log("Done"))
        .catch(error => console.log(error));

    async function sendTransactions() {
        await registerFarms();
        await harvestGrapes();
        await pressGrapes();
        await fermentGrapes();
        await bottleWile();
        await distributeWine();
        await firstRetailerWine();
        await secondRetailerWine();
        await consumeWine();

        // let fincas = await WineSupplyChain.methods.getAllFincas().call({ from: producerAddress });
        // console.log(fincas);

    //    let events = await WineSupplyChain.getPastEvents("allEvents", {
    //     fromBlock: '0x0',
    //     toBlock: 'latest'
    //    });
    //    console.log(events);
        
    }

    async function registerFarms() {
        console.log("Registrando Viñedos");
        try {
            await Promise.all(fincas.map(async (finca) => {
                await WineSupplyChain.methods.registrarFinca(
                    finca.id,
                    finca.nombre,
                    finca.lat,
                    finca.long,
                    finca.direccion
                ).send({ from: producerAddress, gas: 600000 });
            }));

        } catch (e) {
            console.log(e);
        }

        console.log("Viñedos registrados");
        await Promise.all(fincas.map(async (finca) => {
            let _finca = await WineSupplyChain.methods.getFincaInfo(finca.id).call({ from: producerAddress });
            console.log(`Finca registrada: ${_finca.fincaId} - ${_finca.nombreFinca}`);
        }));
    }

    async function harvestGrapes() {
        console.log("Registrando cosecha de uvas");
        await Promise.all(uvas.map(async uva => {
            await WineSupplyChain.methods.registrarCosechaUvas(
                uva.id,
                uva.varietal,
                uva.vintage,
                uva.id // hardcodeo de id de uva = id de finca
            ).send({ from: producerAddress, gas: 600000 });
        }));

        console.log("Cosecha de Uvas registrada");
        await Promise.all(uvas.map(async uva => {
            let _uva = await WineSupplyChain.methods.getUvasInfo(uva.id).call({ from: producerAddress });
            console.log(`Cosecha registrada: ${_uva.idUvas} - ${_uva.varietal} - ${_uva.nombreFinca} - ${_uva.estado}`);
        }));

    }

    async function pressGrapes() {
        uvas.pop(); // remove last item to leave it in Harvested state
        console.log("Registrando prensado de uvas");
        await Promise.all(uvas.map(async uva => {
            await WineSupplyChain.methods.registrarPrensadoUvas(uva.id).send({ from: producerAddress, gas: 600000 });
        }));

        await Promise.all(uvas.map(async uva => {
            let _uva = await WineSupplyChain.methods.getUvasInfo(uva.id).call({ from: producerAddress });
            console.log(`Registrado el prensado de uva: ${_uva.idUvas} - ${_uva.varietal} - ${_uva.nombreFinca} - ${_uva.estado}`);
        }));
    }

    // TODO: send grapes ids
    async function fermentGrapes() {
        uvas.pop(); // remove last item to leave it in Pressed 
        console.log("Registrando fermentado de uvas");
        await Promise.all(uvas.map(async uva => {
            await WineSupplyChain.methods.registrarFermentadoUvas(uva.id).send({ from: producerAddress, gas: 600000 });
        }));

        await Promise.all(uvas.map(async uva => {
            let _uva = await WineSupplyChain.methods.getUvasInfo(uva.id).call({ from: producerAddress });
            console.log(`Registrado el fermentado de uva: ${_uva.idUvas} - ${_uva.varietal} - ${_uva.nombreFinca} - ${_uva.estado}`);
        }));
    }

    async function bottleWile() {
        console.log("Registrando embotellado de vino");
        await Promise.all(vinos.map(async vino => {
            await WineSupplyChain.methods.registrarEmbotelladoVino(
                vino.id, 
                vino.idUvas, 
                vino.precio, 
                vino.varietal
            ).send({ from: producerAddress, gas: 600000 });
        }));

        await Promise.all(vinos.map(async vino => {
            let _vino = await WineSupplyChain.methods.getVinoInfo(vino.id).call({ from: producerAddress });
            console.log(`Registrado el embotellado de vino: ${_vino.sku} - ${_vino.varietal} - ${_vino.uvasId} - ${_vino.estado}`);
        }))

    }

    async function distributeWine() {
        console.log("Registrando vino en distribuidor");
        vinos.pop(); // remove last item to leave it in Bottled
        await Promise.all(vinos.map(async vino => {
            await WineSupplyChain.methods.registrarVinoEnDistribucion(vino.id, vino.precio).send({ 
                    from: dstributorAddress, 
                    gas: 6000000,
                    value: vino.precio
                });
        }));

        await Promise.all(vinos.map(async vino => {
            let _vino = await WineSupplyChain.methods.getVinoInfo(vino.id).call({ from: dstributorAddress });
            console.log(`Registrado vino en distribuidor: ${_vino.sku} - ${_vino.varietal} - ${_vino.uvasId} - ${_vino.estado} - ${_vino.propietario}`);
        }));

    }

    async function firstRetailerWine() {
        console.log("Registrando vino en mayorista");
        vinos.pop(); // remove last item to leave it in Distribution
        await Promise.all(vinos.map(async vino => {
            await WineSupplyChain.methods.registrarVinoEnMayorista(vino.id, vino.precio).send({ 
                from: retailerAddress, 
                gas: 6000000,
                value: vino.precio
            });
        }))

        await Promise.all(vinos.map(async vino => {
            let _vino = await WineSupplyChain.methods.getVinoInfo(vino.id).call({ from: retailerAddress });
            console.log(`Registrado vino en mayorista: ${_vino.sku} - ${_vino.varietal} - ${_vino.uvasId} - ${_vino.estado} - ${_vino.propietario}`);
        }));
    }

    async function secondRetailerWine() {
        console.log("Registrando vino en minorista");
        vinos.pop(); // remove last item to leave it in Mayorista
        await Promise.all(vinos.map(async vino => {
            await WineSupplyChain.methods.registrarVinoEnMinorista(vino.id, vino.precio).send({ 
                from: retailerAddress, 
                gas: 6000000,
                value: vino.precio
            });
        }))

        await Promise.all(vinos.map(async vino => {
            let _vino = await WineSupplyChain.methods.getVinoInfo(vino.id).call({ from: retailerAddress });
            console.log(`Registrado vino en minorista: ${_vino.sku} - ${_vino.varietal} - ${_vino.uvasId} - ${_vino.estado} - ${_vino.propietario}`);
        }));
    }

    async function consumeWine() {
        console.log("Registrando vino en manos del consumidor");
        vinos.pop(); // remove last item to leave it in Minorista
        await Promise.all(vinos.map(async vino => {
            await WineSupplyChain.methods.registrarVinoConsumido(vino.id, vino.precio).send({ 
                from: consumerAddress, 
                gas: 6000000,
                value: vino.precio
            })
        }));

        await Promise.all(vinos.map(async vino => {
            let _vino = await WineSupplyChain.methods.getVinoInfo(vino.id).call({ from: consumerAddress });
            console.log(`Registrado vino en consumidor: ${_vino.sku} - ${_vino.varietal} - ${_vino.uvasId} - ${_vino.estado} - ${_vino.propietario}`);
        }));
    }

})();
