import axios from "axios"
import { ServerError } from '../security/errors.mjs'
import NodeGeocoder from 'node-geocoder'
import geodesic from "geographiclib-geodesic"

export const geocoder = NodeGeocoder({
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY
})

export const geod = geodesic.Geodesic.WGS84

export async function getCEPData(cep){
    if(!validateCEP(cep)) return null
    const url = process.env.CEP_INFO_URL.replace('<CEP>', cep)

    const res = await axios.get(url)

    if(res.status !== 200) throw new ServerError("Failed to fetch CEP data", 500)

    const newData = {}
    newData.street = res.data.logradouro
    newData.city = res.data.localidade
    newData.district = res.data.bairro
    newData.state = res.data.uf
    newData.cep = res.data.cep

    return newData
}

export async function validateCEP(cep){
    if(cep.length === 9){
        return cep.replace('-', '')
    }
    else if(cep.length === 8){
        return cep
    }
    return null
}

export async function getLongLat({city='', state='', district='', street=''}){
    const res = (await geocoder.geocode(`${street}, ${district}, ${city}, ${state}`))[0]
    if(!res) throw new ServerError("Failed to fetch google api data", 500)

    const {latitude, longitude} = res

    return {latitude, longitude}
}

export async function getGeoDistance(lat1, long1, lat2, long2){
    return geod.Inverse(lat1,long1,lat2,long2)
}