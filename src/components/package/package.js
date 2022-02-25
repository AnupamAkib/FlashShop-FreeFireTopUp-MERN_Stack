import React from 'react'
import Card from './card.js'
import axios from 'axios';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import SpecialCard from './specialCard.js'

export default function Package(props) {
    let topUp_type = props.topUp_type;
    const [allPackage, setAllPackage] = useState([])
    const [allSpPackage, setAllSpPackage] = useState([])
    const [loadingSp, setLoadingSp] = useState(true)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get('https://flash-shop-server.herokuapp.com/package/allPackages', {
            //parameters
        })
            .then((response) => {
                setAllPackage(response.data.result)
                setLoading(false);
            }, (error) => {
                console.log(error);
            });
    }, [])
    useEffect(() => {
        axios.post('https://flash-shop-server.herokuapp.com/package/special/getAll', {
            //parameters
        })
            .then((response) => {
                //console.log(response.data.result)
                setAllSpPackage(response.data.result)
                setLoadingSp(false);
            }, (error) => {
                console.log(error);
            });
    }, [])
    //console.log(allPackage)
    let res = [];
    for (let i = 0; i < allSpPackage.length; i++) {
        if (allSpPackage[i].topUp_type == topUp_type || topUp_type == 'all') {
            res.push(<SpecialCard id={allSpPackage[i]._id} diamond={allSpPackage[i].diamond} regularPrice={allSpPackage[i].price} discountAmount={allSpPackage[i].discount_amount} topUp_type={allSpPackage[i].topUp_type} />)
        }
    }
    for (let i = 0; i < allPackage.length; i++) {
        if (allPackage[i].topUp_type == topUp_type || topUp_type == 'all') {
            res.push(<Card id={allPackage[i]._id} diamond={allPackage[i].diamond} regularPrice={allPackage[i].regularPrice} discountPrice={allPackage[i].discountPrice} discountAmount={allPackage[i].discountAmount} topUp_type={allPackage[i].topUp_type} />)
        }
    }
    if (loading || loadingSp) {
        return (
            <div align="center" style={{ paddingBottom: '40vh' }}>
                <br /><br /><br /><br />
                <CircularProgress /><br />
                অপেক্ষা করুন
            </div>
        )
    }
    return (
        <div>
            {res.length ? res : <div align='center'><br /><br /><h1>কিছু পাওয়া যায়নি</h1></div>}
        </div>
    )
}
