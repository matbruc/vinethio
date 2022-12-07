import React, { useEffect, useState } from "react";
import { Button, Loader, Table } from "semantic-ui-react";

const Wines = props => {
    const [wines, setWines] = useState(null);
    const [producerAccount, setProducerAccount] = useState(null);
    const [distributorAccount, setDistributorAccount] = useState(null);
    const [retailerAccount, setRetailerAccount] = useState(null);
    const [customerAccount, setCustomerAccount] = useState(null);
    
    const getWineState = wine => {
        let estado;
        switch (wine.estadoVino) {
            case '0':
                estado = "Embotellado";
                break;
            case '1':
                estado = "En Distribucion";
                break;
            case '2':
                estado = "En Mayorista";
                break;
            case '3':
                estado = "En Minorista";
                break;
            case '4':
                estado = "Consumido";
                break;
            default:
                estado = "Sin Información";
                break;
        }
        return estado;
    }

    const getActionButton = wine => {
        let button;
        switch (wine.estadoVino) {
            case '0':
                button = <Button secondary onClick={() => distributeWine(wine)}>Distribuir Vino</Button>;
                break;
            case '1':
                button = <Button secondary onClick={() => setToReseller(wine)}>Vender a Mayorista</Button>;
                break;
            case '2':
                button = <Button secondary onClick={() => setToCommerce(wine)}>Vender a Minorista</Button>;
                break;
            case '3':
                button = <Button secondary onClick={() => setToCustomer(wine)}>Vender a Consumidor</Button>;
                break;
            case '4':
                button = <Button secondary disabled>Sin Acciones, vino consumido</Button>;
                break;
            default:
                button = <Button secondary disabled>No disponible</Button>;
                break;
        }

        return button;
    }

    const distributeWine = async wine => {
        await props.contract.methods.registrarVinoEnDistribucion(wine.sku, parseInt(wine.precio))
            .send({ from: distributorAccount, gas: 6000000, value: wine.precio });
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
        }
        getWines();
    }

    const setToReseller = async wine => {
        await props.contract.methods.registrarVinoEnMayorista(wine.sku, wine.precio)
            .send({ from: retailerAccount, gas: 6000000, value: wine.precio });
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
        }
        getWines();
    }

    const setToCommerce = async wine => {
        await props.contract.methods.registrarVinoEnMinorista(wine.sku, wine.precio)
            .send({ from: retailerAccount, gas: 6000000, value: wine.precio });
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
        }
        getWines();
    }

    const setToCustomer = async wine => {
        await props.contract.methods.registrarVinoConsumido(wine.sku, wine.precio)
            .send({ from: customerAccount, gas: 6000000, value: wine.precio });
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
        }
        getWines();
    }

    useEffect(() => {
        setProducerAccount(props.accounts[1]);
        setDistributorAccount(props.accounts[2]);
        setRetailerAccount(props.accounts[3]);
        setCustomerAccount(props.accounts[4]);
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
        }
        getWines();
    }, []); 

    return (
        <div>
            {wines ? 
            (<div>
                <Button basic color='purple' href={'wines/create'}>
                    Registrar Embotellado Vino
                </Button>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Varietal</Table.HeaderCell>
                            <Table.HeaderCell>Propietario</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                            <Table.HeaderCell>Acción</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {wines.map(wine =>   
                            <Table.Row>
                                <Table.Cell>{wine.sku}</Table.Cell>
                                <Table.Cell>{wine.varietal}</Table.Cell>
                                <Table.Cell>{wine.propietario}</Table.Cell>
                                <Table.Cell>{getWineState(wine)}</Table.Cell>
                                <Table.Cell>{getActionButton(wine)}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>    
            </div>)
            :
            (<Loader active />)
        }
        </div>  
    )
}

export default Wines;