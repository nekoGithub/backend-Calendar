/* 
    Rutas de Eventos / events
    host + /api/events 
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { route } = require('./auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use( validarJWT );

// obtener eventos
router.get('/', getEventos);

// Crear nuevo evento
router.post(
        '/', 
        [
            check('title','El titulo es oblogatorio').not().isEmpty(),
            check('start','La fecha es oblogatorio').custom( isDate ),
            check('end','La de finalizacion es oblogatorio').custom( isDate ),
            validarCampos
        ],  
        crearEvento
    );

//Actualizar evento
router.put('/:id', actualizarEvento);

//Eliminar evento
router.delete('/:id', eliminarEvento);

module.exports = router;