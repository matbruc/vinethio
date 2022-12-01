// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ProducerRole.sol";
import "./DistributorRole.sol";
import "./CustomerRole.sol";
import "./RetailerRole.sol";
import "../node_modules/openzeppelin-contracts/access/Ownable.sol";

contract WineSupplyChain is ProducerRole, DistributorRole, RetailerRole, CustomerRole, Ownable {

    address payable deployer;
    address payable emptyAddress = payable(address(0));


    // structs

    struct Ubicacion {
        string latitud;
        string longitud;
        string direccion;
    }

    struct Finca {
        uint fincaId;
        string nombreFinca;
        Ubicacion ubicacion;
    }

    mapping (uint => Finca) fincas;
    uint fincasCount = 0;
    mapping (uint => Ubicacion) ubicacionFinca;
    event FincaRegistrada(uint fincaId);

    enum EstadoUvas {Cosechadas, Prensadas, Fermentadas}

    struct Uvas {
        uint uvasId;
        string varietal;
        uint vintage;
        address propietario;
        EstadoUvas estado;
        Finca finca;
    }

    mapping (uint => Uvas) uvas;
    uint uvasCount = 0;
    event UvasCosechadas(uint uvasId);
    event UvasPrensadas(uint uvasId);
    event UvasFermentadas(uint uvasId);

    enum EstadoVino {Embotellado, EnDistribucion, EnMayorista, EnMinorista, Consumido}

    struct Vino {
        uint sku;
        Uvas uvas;
        uint precio;
        EstadoVino estadoVino;
        address payable comprador;
        address payable propietario;
        string varietal;
    }

    mapping (uint => Vino) vinos;
    uint vinosCount = 0;
    // eventos

    event VinoEmbotellado(uint sku);
    event VinoEnDistribucion(uint sku);
    event VinoEnMayorista(uint sku);
    event VinoEnMinorista(uint sku);
    event VinoVendido(uint sku);
    event VinoConsumido(uint sku);


    // restricciones

    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "Caller cannot be verified!");
        _;
    }

    modifier uvasExisten(uint uvasId) {
        require(uvas[uvasId].uvasId > 0, "No existen las uvas");
        _;
    }

    modifier verificarEstadoUvas(uint _uvasId, EstadoUvas estado) {
        require(uvas[_uvasId].estado == estado, "No se puede verificar el estado de las uvas");
        _;
    }

    modifier vinoExiste(uint sku) {
        require(vinos[sku].sku > 0, "No existe el vino");
        _;
    }

    modifier verificarEstadoVino(uint sku, EstadoVino estadoVino) {
        require(vinos[sku].estadoVino == estadoVino, "No se puede verificar el estado del vino");
        _;
    }

    modifier isPaidEnough(uint price) {
        require(msg.value >= price, "Pago no suficiente");
        _;
    }

    modifier returnExcessChange(uint sku) {
        _;
        uint price = vinos[sku].precio;
        uint excessChange = msg.value - price;
        vinos[sku].comprador.transfer(excessChange);
    }

    constructor(address[] memory accounts) 
    ProducerRole(accounts[1])
    DistributorRole(accounts[2])
    RetailerRole(accounts[3])
    CustomerRole(accounts[4])  {
        deployer = payable(msg.sender);
    }

    
    function kill() public onlyOwner {
        if (msg.sender == deployer) {
            selfdestruct(deployer);
        }
    }

    // FUNCIONES

    // Registrar nueva Finca
    function registrarFinca(uint fincaID, string memory _nombreFinca, string memory _latitudFinca, string memory _longitudFinca, string memory _ubicacionDireccion) public {
        Ubicacion storage newLocation = ubicacionFinca[fincaID];
        newLocation.latitud = _latitudFinca;
        newLocation.longitud = _longitudFinca;
        newLocation.direccion = _ubicacionDireccion;

        Finca storage newFarm = fincas[fincaID];
        newFarm.fincaId = fincaID;
        newFarm.nombreFinca = _nombreFinca;
        newFarm.ubicacion = newLocation;

        emit FincaRegistrada(fincaID);
        fincasCount++;
        
    }

    // Obtener Finca por ID
    function getFincaInfo(uint _fincaId) public view 
    returns (uint fincaId, string memory nombreFinca, string memory latitud, string memory longitud, string memory direccion) {
        Finca storage returnFarm = fincas[_fincaId];
        fincaId = returnFarm.fincaId;
        nombreFinca = returnFarm.nombreFinca;
        latitud = returnFarm.ubicacion.latitud;
        longitud = returnFarm.ubicacion.longitud;
        direccion = returnFarm.ubicacion.direccion;
    }

    // Obtener todas las Fincas
    function getAllFincas() public view returns (Finca[] memory) {
        Finca[] memory ret = new Finca[](fincasCount);
        for (uint256 i = 0; i < fincasCount; i++) {
            ret[i] = fincas[i+1];
        }
        return ret;
    }

    // Registrar Cosecha de la Uva
    function registrarCosechaUvas(uint uvasId, string memory _varietal, uint _vintage, uint idFinca) public onlyProducer {

        Uvas storage newGrapes = uvas[uvasId];
        newGrapes.uvasId = uvasId;
        newGrapes.varietal = _varietal;
        newGrapes.vintage = _vintage;
        newGrapes.propietario = msg.sender;
        newGrapes.estado = EstadoUvas.Cosechadas;
        newGrapes.finca = fincas[idFinca];

        emit UvasCosechadas(uvasId);
        uvasCount++;
    }

    // Registrar Prensado de la Uva
    function registrarPrensadoUvas(uint uvasId) public 
    uvasExisten(uvasId) 
    verificarEstadoUvas(uvasId, EstadoUvas.Cosechadas) 
    verifyCaller(uvas[uvasId].propietario)
    onlyProducer {

        uvas[uvasId].estado = EstadoUvas.Prensadas;
        
        emit UvasPrensadas(uvasId);
    }

    // Registrar Fermentado de la Uva
    function registrarFermentadoUvas(uint uvasId) public 
    uvasExisten(uvasId) 
    verificarEstadoUvas(uvasId, EstadoUvas.Prensadas) 
    verifyCaller(uvas[uvasId].propietario)
    onlyProducer {

        uvas[uvasId].estado = EstadoUvas.Fermentadas;
        
        emit UvasFermentadas(uvasId);
    }

    // Obtener uvas por ID
    function getUvasInfo(uint uvasId) public view
    returns (uint idUvas, //0
             string memory varietal, //1
             uint vintage, //2
             string memory estado, //3
             uint fincaId, //4
             string memory nombreFinca, //5
             string memory latitud, //6
             string memory longitud, //7
             string memory direccion) {

        idUvas = uvasId;
        varietal = uvas[uvasId].varietal;
        vintage = uvas[uvasId].vintage;
        if (uint(uvas[uvasId].estado) == 0) {
            estado = "Uvas Cosechadas";
        } 
        if (uint(uvas[uvasId].estado) == 1) {
            estado = "Uvas Prensadas";
        } 
        if (uint(uvas[uvasId].estado) == 2) {
            estado = "Uvas Fermentadas";
        }
        fincaId = uvas[uvasId].finca.fincaId;
        nombreFinca = uvas[uvasId].finca.nombreFinca;
        latitud = uvas[uvasId].finca.ubicacion.latitud;
        longitud = uvas[uvasId].finca.ubicacion.longitud;
        direccion = uvas[uvasId].finca.ubicacion.direccion;
    }

    // Obtener todas las Uvas
    function getAllUvas() public view returns (Uvas[] memory) {
        Uvas[] memory ret = new Uvas[](uvasCount);
        for (uint256 i = 0; i < uvasCount; i++) {
            ret[i] = uvas[i+1];
        }
        return ret;
    }

    // Registrar embotellado del vino
    function registrarEmbotelladoVino(uint vinoId, uint uvasId, uint _precio, string memory varietal) public
    uvasExisten(uvasId)
    verificarEstadoUvas(uvasId, EstadoUvas.Fermentadas)
    verifyCaller(uvas[uvasId].propietario)
    onlyProducer {

        Vino storage nuevoVino = vinos[vinoId];
        nuevoVino.sku = vinoId;
        nuevoVino.uvas = uvas[uvasId];
        nuevoVino.precio = _precio;
        nuevoVino.estadoVino = EstadoVino.Embotellado;
        nuevoVino.comprador = emptyAddress;
        nuevoVino.propietario = payable(msg.sender);
        nuevoVino.varietal = varietal;

        emit VinoEmbotellado(vinos[vinoId].sku);
        vinosCount++;
    }

    // Registrar vino en distribución
    function registrarVinoEnDistribucion(uint sku, uint _precio) public payable
    vinoExiste(sku)
    verificarEstadoVino(sku, EstadoVino.Embotellado)
    isPaidEnough(_precio)
    returnExcessChange(sku)
    onlyDistributor {

        address payable distribuidor = payable(msg.sender);
        
        vinos[sku].comprador = distribuidor;
        vinos[sku].propietario.transfer(_precio);
        vinos[sku].propietario = distribuidor;
        vinos[sku].estadoVino = EstadoVino.EnDistribucion;

        emit VinoEnDistribucion(sku);
    }


    // Registrar vino en Mayorista
    function registrarVinoEnMayorista(uint sku, uint _precio) public payable
    vinoExiste(sku)
    verificarEstadoVino(sku, EstadoVino.EnDistribucion)
    isPaidEnough(_precio)
    returnExcessChange(sku)
    onlyRetailer {

        address payable mayorista = payable(msg.sender);

        vinos[sku].comprador = mayorista;
        vinos[sku].propietario.transfer(_precio);
        vinos[sku].propietario = mayorista;
        vinos[sku].estadoVino = EstadoVino.EnMayorista;

        emit VinoEnMayorista(sku);
    }


    // Registrar vino en Minorista
    function registrarVinoEnMinorista(uint sku, uint _precio) public payable
    vinoExiste(sku)
    verificarEstadoVino(sku, EstadoVino.EnMayorista)
    isPaidEnough(_precio)
    returnExcessChange(sku)
    onlyRetailer {

        address payable minorista = payable(msg.sender);

        vinos[sku].comprador = minorista;
        vinos[sku].propietario.transfer(_precio);
        vinos[sku].propietario = minorista;
        vinos[sku].estadoVino = EstadoVino.EnMinorista;

        emit VinoEnMinorista(sku);
    }

    // Registrar vino consumido (comprado por un consumidor)
    function registrarVinoConsumido(uint sku, uint _precio) public payable
    vinoExiste(sku)
    verificarEstadoVino(sku, EstadoVino.EnMinorista)
    isPaidEnough(_precio)
    returnExcessChange(sku)
    onlyCustomer {

        address payable consumidor = payable(msg.sender);

        vinos[sku].comprador = consumidor;
        vinos[sku].propietario.transfer(_precio);
        vinos[sku].propietario = consumidor;
        vinos[sku].estadoVino = EstadoVino.Consumido;

        emit VinoConsumido(sku);

    }
    
    // Obtener todos los vinos
    function getAllVinos() public view returns (Vino[] memory) {
        Vino[] memory res = new Vino[](vinosCount);
        for (uint256 i = 0; i < vinosCount; i++) {
            res[i] = vinos[i+1];
        }
        return res;
    }


    // Obtener vino por ID
    function getVinoInfo(uint _sku) public view 
    vinoExiste(_sku)
    returns (uint sku, uint precio, address propietario, address comprador, string memory estado, uint uvasId, string memory varietal) {
        sku = _sku;
        precio = vinos[_sku].precio;
        propietario = vinos[_sku].propietario;
        comprador = vinos[_sku].comprador;

        if(uint(vinos[_sku].estadoVino) == 0) {
            estado = "Vino Embotellado";
        }
        if(uint(vinos[_sku].estadoVino) == 1) {
            estado = "Vino en Distribucion";
        }
        if(uint(vinos[_sku].estadoVino) == 2) {
            estado = "Vino en Mayorista";
        }
        if(uint(vinos[_sku].estadoVino) == 3) {
            estado = "Vino en Minorista";
        }
        if(uint(vinos[_sku].estadoVino) == 4) {
            estado = "Vino Consumido";
        }

        uvasId = vinos[_sku].uvas.uvasId;
        varietal = vinos[_sku].varietal;
        
    }

}
