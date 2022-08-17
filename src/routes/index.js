const express = require('express')
const router = express.Router()

const routes = [
    {
        path: 'personas'
    },
    {
        path: 'usuarios'
    },
    {
        path: 'ingresos'
    },
    {
        path: 'egresos'
    },
    {
        path: 'recordatorios'
    }
    ,
    {
        path: 'recordatorio-tags'
    },
    {
        path: 'tags'
    },
    {
        path: 'proyectos'
    },
    {
        path: 'proyecto-tags'
    },
    {
        path: 'actividades'
    },
    {
        path: 'notas'
    },
    {
        path: 'consultas'
    }
]

routes.forEach(route => {
    return router.use(`/${route.path}`, require(`./${route.path}`))
    
})
//router.use(`/personas`, require(`./personas`))
module.exports = router;