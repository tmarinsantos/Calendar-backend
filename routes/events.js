const {Router} = require('express');

const router = Router();

const { validarJWT} = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');


//Para aplicar un middleware a todas las peticiones, pra no tener que duplicarlo en cada una:
//Es secuencial, osea que si ponemos alguna peticion antes que este use, esa peticion no disparará
// este middleware
router.use( validarJWT);

//Todas tienen que pasar por la validacion de JWT
//obtener eventos
router.get('/', getEventos);

//Crear un nuevo eventos
router.post(
        '/',
        [
            check('title', 'Titulo es obligaotrio').not().isEmpty(),
            check('start', 'Fecha de inicio es obligatoria').custom(isDate),
            check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
            validarCampos
        ],
        crearEvento);

//Actualizar evento
router.put(
        '/:id',[
            check('title', 'Titulo es obligaotrio').not().isEmpty(),
            check('start', 'Fecha de inicio es obligatoria').custom(isDate),
            check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
            validarCampos
        ],
        actualizarEvento);

//Borrar evento
router.delete('/:id', eliminarEvento);


module.exports = router;