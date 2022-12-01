import React, { useEffect, useState } from "react";
import { Loader, Table } from "semantic-ui-react";

const Farms = props => {
    const [farms, setFarms] = useState(null);
    const [producerAccount, setProducerAccount] = useState(null);

    useEffect(() => {
        setProducerAccount(props.accounts[1]);
        const getFarms = async () => {
            let farms = await props.contract.methods.getAllFincas().call({ from: producerAccount });
            setFarms(farms);
        }
        getFarms();
    }, []); 

    return (
        <div>
            {farms ? 
            (<div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Nombre Viña</Table.HeaderCell>
                            <Table.HeaderCell>Ubicación</Table.HeaderCell>
                            <Table.HeaderCell>Dirección</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {farms.map(farm =>   
                            <Table.Row>
                                <Table.Cell>{farm.nombreFinca}</Table.Cell>
                                <Table.Cell>{farm.ubicacion.latitud} {farm.ubicacion.longitud} </Table.Cell>
                                <Table.Cell>{farm.ubicacion.direccion}</Table.Cell>
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

export default Farms;