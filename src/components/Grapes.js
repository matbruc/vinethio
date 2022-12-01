import React, { useEffect, useState } from "react";
import { Loader, Table } from "semantic-ui-react";

const Grapes = props => {
    const [grapes, setGrapes] = useState(null);
    const [producerAccount, setProducerAccount] = useState(null);
    
    const getGrapeState = grape => {
        let estado;
        switch (grape.estado) {
            case '0':
                estado = "Cosechadas";
                break;
            case '1':
                estado = "Prensadas";
                break;
            case '2':
                estado = "Fermentadas";
                break;
            default:
                estado = "No disponible";
                break;
        }
        return estado;
    }

    useEffect(() => {
        setProducerAccount(props.accounts[1]);
        const getGrapes = async () => {
            let grapes = await props.contract.methods.getAllUvas().call({ from: producerAccount });
            setGrapes(grapes);
        }
        getGrapes();
    }, []); 

    return (
        <div>
            {grapes ? 
            (<div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Finca</Table.HeaderCell>
                            <Table.HeaderCell>Varietal</Table.HeaderCell>
                            <Table.HeaderCell>Año</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {grapes.map(grape =>   
                            <Table.Row>
                                <Table.Cell>{grape.finca.nombreFinca}</Table.Cell>
                                <Table.Cell>{grape.varietal}</Table.Cell>
                                <Table.Cell>{grape.vintage}</Table.Cell>
                                <Table.Cell>{getGrapeState(grape)}</Table.Cell>
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

export default Grapes;