import * as fs from 'fs'
import * as path from 'path'

console.log(__dirname)
const estados = fs.readFileSync(path.join(__dirname, '../data/estados.txt'), { encoding: 'utf-8' }).split('\n')
const municipios = fs.readFileSync(path.join(__dirname, '../data/municipios.txt'), { encoding: 'utf-8' }).split('\n')
const cp = fs.readFileSync(path.join(__dirname, '../data/cp.txt'), { encoding: 'utf-8' }).split('\n')

interface Estado {
    clave: number
    nombre: string
    abreviacion: string
    cp_min: number
    cp_max: number
}

let dict_estados: { [clave: number]: Estado } = {}
for (let l of estados) {
    if (l === '' || ['INSERT', 'VALUES'].some(x => l.includes(x))) {
        //Ignorar
    } else {
        try {
            //Procesar
            const parts = l.split(',')
            if (parts.length === 5 || parts.length === 6) {
                const clave = parseInt(parts[0].replace(/(\(|'|\)|\;)/gi, '').trim())
                const nombre = parts[1].replace(/(\(|'|\)|\;)/gi, '').trim()
                const abreviacion = parts[2].replace(/(\(|'|\)|\;)/gi, '').trim()
                const cp_min = parseInt(parts[3].replace(/(\(|'|\)|\;)/gi, '').trim())
                const cp_max = parseInt(parts[4].replace(/(\(|'|\)|\;)/gi, '').trim())
                const entry: Estado = {
                    clave, nombre, abreviacion, cp_min, cp_max
                }
                dict_estados[entry.clave] = entry
            } else {
                //Ignorar
            }
        } catch (e) {
            console.log('error', e)
        }
    }
}

interface Municipio {
    id: number
    nombre: string
    estado: number
    cp_min: number
    cp_max: number
    huso_horario: string
}

let dict_municipios: { [id: number]: Municipio } = {}
for (let l of municipios) {
    if (l === '' || ['INSERT', 'VALUES'].some(x => l.includes(x))) {
        //Ignorar
    } else {
        try {
            //Procesar
            const parts = l.split(',')
            if (parts.length === 6 || parts.length === 7) {
                const id = parseInt(parts[0].replace(/(\(|'|\)|\;)/gi, '').trim())
                const nombre = parts[1].replace(/(\(|'|\)|\;)/gi, '').trim()
                const estado = parseInt(parts[2].replace(/(\(|'|\)|\;)/gi, '').trim())
                const cp_min = parseInt(parts[3].replace(/(\(|'|\)|\;)/gi, '').trim())
                const cp_max = parseInt(parts[4].replace(/(\(|'|\)|\;)/gi, '').trim())
                const huso_horario = parts[5].replace(/(\(|'|\)|\;)/gi, '').trim()
                const entry: Municipio = {
                    id, nombre, estado, cp_min, cp_max, huso_horario
                }
                dict_municipios[entry.id] = entry
            } else {
                //Ignorar
            }
        } catch (e) {
            console.log('error', e)
        }
    }
}

interface CP {
    id: number
    nombre: string
    municipio: number
    asentamiento: string
    codigo_postal: number
    latitud: string
    longitud: string
}

interface CP_Data {
    cp: number
    municipio: string
    estado_nombre: string
    estado_abreviacion: string
    lat: string
    lon: string
    colonias: string[]
}

let dict_cp: { [zip: string]: CP_Data } = {}
for (let l of cp) {
    if (l === '' || ['INSERT', 'VALUES'].some(x => l.includes(x))) {
        //Ignorar
    } else {
        //Procesar
        const parts = l.split(',')
        if (parts.length === 7 || parts.length === 8) {
            const id = parseInt(parts[0].replace(/(\(|'|\)|\;)/gi, '').trim())
            const nombre = parts[1].replace(/(\(|'|\)|\;)/gi, '').trim()
            const municipio = parseInt(parts[2].replace(/(\(|'|\)|\;)/gi, '').trim())
            const asentamiento = parts[2].replace(/(\(|'|\)|\;)/gi, '').trim()
            const codigo_postal = parseInt(parts[4].replace(/(\(|'|\)|\;)/gi, '').trim())
            const latitud = parts[5].replace(/(\(|'|\)|\;)/gi, '').trim()
            const longitud = parts[6].replace(/(\(|'|\)|\;)/gi, '').trim()
            const entry: CP = {
                id, nombre, municipio, asentamiento, codigo_postal, latitud, longitud
            }
            try {
                if (dict_cp[entry.codigo_postal] === undefined) {
                    dict_cp[entry.codigo_postal] = {
                        cp: entry.codigo_postal,
                        municipio: dict_municipios[entry.municipio].nombre,
                        estado_nombre: dict_estados[dict_municipios[entry.municipio].estado].nombre,
                        estado_abreviacion: dict_estados[dict_municipios[entry.municipio].estado].abreviacion,
                        lat: entry.latitud,
                        lon: entry.longitud,
                        colonias: [],
                    }
                }
                dict_cp[entry.codigo_postal].colonias.push(entry.nombre)
            } catch (e) {
                console.log('error', e)
                console.log('estado', dict_estados[dict_municipios[entry.municipio].estado])
                console.log('municipio', dict_municipios[entry.municipio])
            }
        } else {
            //Ignorar
        }
    }
}

fs.writeFileSync(path.join(__dirname, '../data/out.json'), JSON.stringify(dict_cp, null, 4), { encoding: 'utf-8' })