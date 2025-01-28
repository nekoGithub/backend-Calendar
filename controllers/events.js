const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    });
}
const crearEvento = async( req, res = response ) => {
    
    const evento = new Evento( req.body );

    try {
        evento.user = req.uid; 

        const eventoSave = await evento.save();

        res.json({
            ok: true,
            evento: eventoSave,
        })


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
    
}
const actualizarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no econtrado',
            })
        }

        if ( evento.user.toString() !== req.uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento',
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid,
        }

        const eventoUpdate = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoUpdate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }

}
const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no econtrado',
            })
        }

        if ( evento.user.toString() !== req.uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento',
            })
        }

    

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
            msg: "Eliminado correctamente!"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }


 
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}