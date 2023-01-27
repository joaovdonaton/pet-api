import axios from "axios"
import { ServerError } from '../security/errors.mjs'

export async function getCEPData(cep){
    if(!validateCEP(cep)) return null
    const url = process.env.CEP_INFO_URL.replace('<CEP>', cep)

    const res = await axios.get(url)

    if(res.status !== 200) throw new ServerError("Failed to fetch CEP data", 500)

    return res.data
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