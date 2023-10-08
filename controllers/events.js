const { response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');
const Evento = require('../models/Evento')

const getEventos = async(req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');
    
    res.status(201).json({
        ok:true,
        eventos
    });
    
};

const crearEvento = async(req, res = response) => {
    
    const evento = new Evento( req.body);

    try {

        evento.user = req.uid;
        
        await evento.save();

        res.status(201).json({
            ok:true,
            evento
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }    

    
    
};

const actualizarEvento = async(req, res = response) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este evento'
            })
        }
        
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new:true});

        res.status(201).json({
            ok:true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    } 
};

const eliminarEvento = async(req, res = response) => {
    
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios borrar este evento'
            })
        }

       await Evento.findByIdAndDelete(eventoId);

        res.status(201).json({
            ok:true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    } 
    
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}