import React, { useEffect, useState } from "react";
import { Form, Dropdown } from "semantic-ui-react";

const WinesForm = props => {

    const [grape, setGrape] = useState(null);
    const [price, setPrice] = useState(null);
    const [type, setType] = useState(null);
    const [farm, setFarm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [grapes, setGrapes] = useState(null);
    const [wines, setWines] = useState(null);

    const [producerAccount, setProducerAccount] = useState(null);
    const [grapeOptions, setGrapeOptions] = useState(null);
    const grapeOptionsArray = [];
    
    useEffect(() => {
        setProducerAccount(props.accounts[1]);
        const getGrapes = async () => {
            let grapes = await props.contract.methods.getAllUvas().call({ from: producerAccount });
            setGrapes(grapes);
            grapes.map(it => {
                let el = {};
                el.key = it.uvasId;
                el.text = it.varietal;
                el.value = it.uvasId;
                grapeOptionsArray.push(el);
            });
            setGrapeOptions(grapeOptionsArray);
        }
        const getWines = async () => {
            let wines = await props.contract.methods.getAllVinos().call({ from: producerAccount });
            setWines(wines);
        }
        getGrapes();
        getWines();
    }, []);

    const onChangeType= e => {
        const type = e.target.value;
        setType(type);
    }

    const onChangePrice= e => {
        const cost = e.target.value;
        setPrice(cost);
    }

    const onChangeGrape = (e, { value }) => {
        setGrape(value);
    }

    const registerWineBottled = async () => {
        await props.contract.methods.registrarEmbotelladoVino(
            wines.length + 1,
            grape,
            price,
            type
        ).send({ from: producerAccount, gas: 600000 });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await registerWineBottled();
        window.location = '/wines'
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group widths='equal'>
                <Dropdown placeholder='Seleccionar Uva' fluid selection options={grapeOptions} onChange={onChangeGrape}/>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Varietal' placeholder='Varietal Vino' onChange={onChangeType} />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Precio' placeholder='Precio' onChange={onChangePrice} />
            </Form.Group>
            <Form.Button primary loading={loading}>Submit</Form.Button>
        </Form>
    )

}

export default WinesForm;
