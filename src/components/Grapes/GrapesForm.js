import React, { useEffect, useState } from "react";
import { Form, Dropdown } from "semantic-ui-react";
import SemanticDatepicker from 'react-semantic-ui-datepickers';

const GrapesForm = props => {

    const [type, setType] = useState(null);
    const [vintage, setVintage] = useState(null);
    const [farm, setFarm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [farms, setFarms] = useState(null);
    const [grapes, setGrapes] = useState(null);
    const [producerAccount, setProducerAccount] = useState(null);
    const [farmOptions, setFarmOptions] = useState(null);
    const farmOptionsArray = [];
    useEffect(() => {
        setProducerAccount(props.accounts[1]);
        const getFarms = async () => {
            let farms = await props.contract.methods.getAllFincas().call({ from: producerAccount });
            setFarms(farms);
            farms.map(it => {
                let el = {};
                el.key = it.nombreFinca;
                el.text = it.nombreFinca;
                el.value = it.fincaId;
                farmOptionsArray.push(el);
            });
            setFarmOptions(farmOptionsArray);
        }
        const getGrapes = async () => {
            let grapes = await props.contract.methods.getAllUvas().call({ from: producerAccount });
            setGrapes(grapes);
        }
        getFarms();
        getGrapes();
    }, []);

    const onChangeType= e => {
        const type = e.target.value;
        setType(type);
    }

    const onChangeVintage = (e, { value }) => {
        setVintage(value.getFullYear());
    }

    const onChangeFarm = (e, { value }) => {
        setFarm(value);
    }

    const registerGrapesHarvested = async () => {
        await props.contract.methods.registrarCosechaUvas(
            grapes.length + 1,
            type,
            vintage,
            farm
        ).send({ from: producerAccount, gas: 600000 });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await registerGrapesHarvested()
        window.location = '/grapes'
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group widths='equal'>
                <Form.Input fluid label='Varietal' placeholder='Varietal Uva' onChange={onChangeType} />
            </Form.Group>
            <Form.Group widths='equal'>
                <SemanticDatepicker label="Fecha Cosecha" locale="es-ES" onChange={onChangeVintage} clearable format="YYYY" />
            </Form.Group>
            <Form.Group widths='equal'>
            <Dropdown placeholder='Seleccionar Finca' fluid selection options={farmOptions} onChange={onChangeFarm}/>
            </Form.Group>
            <Form.Button primary loading={loading}>Submit</Form.Button>
        </Form>
    )

}

export default GrapesForm;
