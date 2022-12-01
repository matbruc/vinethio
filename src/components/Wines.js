import React, { useEffect, useState } from "react";
import { Loader, Table } from "semantic-ui-react";

const Wines = props => {
    const [wines, setWines] = useState(null);
    const [producerAccount, setProducerAccount] = useState(null);
    
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

    useEffect(() => {
        setProducerAccount(props.accounts[1]);
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
            console.log(wines);
        }
        getWines();
    }, []); 

    return (
        <div>
            {wines ? 
            (<div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Varietal</Table.HeaderCell>
                            <Table.HeaderCell>Propietario</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {wines.map(wine =>   
                            <Table.Row>
                                <Table.Cell>{wine.sku}</Table.Cell>
                                <Table.Cell>{wine.varietal}</Table.Cell>
                                <Table.Cell>{wine.propietario}</Table.Cell>
                                <Table.Cell>{getWineState(wine)}</Table.Cell>
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