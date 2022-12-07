import React, { useEffect, useState } from "react";
import { Form } from "semantic-ui-react";

const FarmsForm = props => {

    const [name, setName] = useState(null);
    const [address, setAddress] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [loading, setLoading] = useState(false);
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

    const onChangeName = e => {
        const name = e.target.value;
        setName(name);
    }

    const onChangeAddress = e => {
        const add = e.target.value;
        setAddress(add);
    }

    const onChangeLat = e => {
        const lat = e.target.value;
        setLat(lat);
    }

    const onChangeLong = e => {
        const long = e.target.value;
        setLong(long);
    }

    const registerFarm = async () => {
        await props.contract.methods.registrarFinca(
            farms.length + 1,
            name,
            lat,
            long,
            address
        ).send({ from: producerAccount, gas: 600000 });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await registerFarm()
        window.location = '/farms'
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Nombre' placeholder='Nombre finca' onChange={onChangeName} />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Dirección' placeholder='Dirección finca' onChange={onChangeAddress} />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Latitud' placeholder='Latitud finca' onChange={onChangeLat} />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Longitud' placeholder='Longitud finca' onChange={onChangeLong} />
            </Form.Group>
            <Form.Button primary loading={loading}>Submit</Form.Button>
        </Form>
    )

}

export default FarmsForm;
