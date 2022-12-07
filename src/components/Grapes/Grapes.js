import React, { useEffect, useState } from "react";
import { Button, Loader, Table } from "semantic-ui-react";

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

    const getActionButton = grape => {
        let button;
        switch (grape.estado) {
            case '0':
                button = <Button secondary onClick={() => pressGrapes(grape)}>Prensar Uvas</Button>;
                break;
            case '1':
                button = <Button secondary onClick={() => fermentGrapes(grape)}>Fermentar Uvas</Button>;
                break;
            case '2':
                button = <Button secondary disabled>Listas para embotellar!</Button>;
                break;
            default:
                button = <Button secondary disabled>No disponible</Button>;
                break;
        }

        return button;
    }

    const pressGrapes = async grape => {
        await props.contract.methods.registrarPrensadoUvas(grape.uvasId).send({ from: producerAccount, gas: 600000 });
        const getGrapes = async () => {
            let grapes = await props.contract.methods.getAllUvas().call({ from: producerAccount });
            setGrapes(grapes);
        }
        getGrapes();
    }

    const fermentGrapes = async grape => {
        await props.contract.methods.registrarFermentadoUvas(grape.uvasId).send({ from: producerAccount, gas: 600000 });
        const getGrapes = async () => {
            let grapes = await props.contract.methods.getAllUvas().call({ from: producerAccount });
            setGrapes(grapes);
        }
        getGrapes();
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
                <Button basic color='purple' href={'grapes/create'}>
                    Registrar Cosecha Uva
                </Button>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Finca</Table.HeaderCell>
                            <Table.HeaderCell>Varietal</Table.HeaderCell>
                            <Table.HeaderCell>Año</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                            <Table.HeaderCell>Acción</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {grapes.map(grape =>   
                            <Table.Row>
                                <Table.Cell>{grape.finca.nombreFinca}</Table.Cell>
                                <Table.Cell>{grape.varietal}</Table.Cell>
                                <Table.Cell>{grape.vintage}</Table.Cell>
                                <Table.Cell>{getGrapeState(grape)}</Table.Cell>
                                <Table.Cell>{getActionButton(grape)}</Table.Cell>
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