import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Link } from 'react-router-dom';
import Title from '../../title.js';

export default function CreatePackage() {
    const navigate = useNavigate();
    useEffect(() => {
        let auth = require('.././authorization.js');
        //console.log(auth.checkAdmin())
        if (auth.checkAdmin() == false) {
            notification.msg("You must login first", "red", 2500)
            navigate('/admin')
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [idCodeUSD, setidCodeUSD] = useState(0);
    const [idPasswordUSD, setidPasswordUSD] = useState(0);

    useEffect(() => {
        axios.post('https://flash-shop-server.herokuapp.com/settings/all', {
            //parameters
        })
            .then((res) => {
                //console.log(response.data.result[0].takeNewOrder)
                setidCodeUSD(res.data.result[0].playerID_USD_Unit_per_hundredDiamond);
                setidPasswordUSD(res.data.result[0].gameLogin_USD_Unit_per_hundredDiamond);
            }, (error) => {
                console.log(error);
            });
    }, [])

    const notification = require('../../methods.js')
    const [Diamond, setDiamond] = useState(0)
    const [Discount, setDiscount] = useState(0)
    const [topUp_type, settopUp_type] = useState('id code')
    const [disabled, setDisabled] = useState(false)

    const [PackagePrice, setPackagePrice] = useState(0);


    const createPackageNow = (e) => {
        if (parseInt(Diamond) < 50) {
            notification.msg("Diamond amount should be greater than 50", "red", 2500);
        }
        else if (parseInt(Discount) > parseInt(Diamond)) {
            notification.msg("Discount can't be greater than Diamond amount", "red", 2500);
        }
        else if (PackagePrice == 0) {
            notification.msg("Invalid Information!", "red", 2500);
        }
        else {
            setDisabled(true)
            axios.post('https://flash-shop-server.herokuapp.com/package/create', {
                //parameters
                diamond: Diamond,
                topUp_type: topUp_type,
                discount: Discount
            })
                .then((response) => {
                    notification.msg("Package successfully added", "green", 2500);
                    navigate('/admin/package/view');
                }, (error) => {
                    setDisabled(false)
                    console.log(error);
                    notification.msg("Sorry, something went wrong", "red", 2500);
                });
        }

        e.preventDefault();
    }

    const calculatePrice = (dmnd, disc, tt) => {
        let price = 0;
        price = parseInt(dmnd) / 100;
        if (tt == 'id code') {
            price *= idCodeUSD;
        }
        else {
            price *= idPasswordUSD;
        }
        price = Math.floor(price);
        price -= disc;
        setPackagePrice(Math.max(price, 0))
    }

    const changeDiamond = (e) => {
        setDiamond(e.target.value);
        calculatePrice(e.target.value, Discount, topUp_type);
    }
    const changeDiscount = (e) => {
        setDiscount(e.target.value);
        calculatePrice(Diamond, e.target.value, topUp_type);
    }
    const changeType = (e) => {
        settopUp_type(e.target.value);
        calculatePrice(Diamond, Discount, e.target.value);
    }

    return (
        <>
            <Title title="Create Package" />
            <div className='container'>
                <div className='container col-5'>

                    <form onSubmit={createPackageNow}>
                        <TextField onChange={changeDiamond} id="filled-basic" label="Diamond Amount" variant="filled" type='number' fullWidth required />
                        <FormControl variant='filled' fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">Select Top Up Type</InputLabel>
                            <Select
                                value={topUp_type}
                                onChange={changeType}
                                label="TopUp Type"
                            >
                                <MenuItem value="id code">ID Code</MenuItem>
                                <MenuItem value="id password">ID Password</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField onChange={changeDiscount} id="filled-basic" label="Discount (in Taka)" variant="filled" type='number' value={Discount} fullWidth required />
                        <TextField id="filled-basic" label="Package Price" variant="filled" type='text' InputProps={{ readOnly: true }} value={PackagePrice + " BDT"} fullWidth required />

                        <Button type='submit' size="large" variant="contained" fullWidth disabled={disabled}>{disabled ? "PLEASE WAIT" : "CREATE"}</Button>
                    </form>
                    <div style={{ background: '#dedede', padding: '15px', marginTop: '20px' }}>
                        <font style={{ fontSize: '19px', fontWeight: 'bold' }}>Unit Price / 100 Diamonds</font><br />
                        <ul>
                            <li>ID Code : {idCodeUSD} BDT</li>
                            <li>ID Password : {idPasswordUSD} BDT</li>
                        </ul>
                        <Link to='/admin/settings'>Change Unit Price</Link>
                    </div>
                </div><br /><br />
            </div>
        </>
    )
}
