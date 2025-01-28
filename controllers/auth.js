const { response } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {
    const { email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne({ email })
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya existe!!!'
            })
        }
        usuario = new Usuario( req.body );

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
    
}
const loginUsuario = async( req, res = response ) => {
    

    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Las credenciales no son crrectas!!'
            })
        }

        // Confirmnar password
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto.'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )
        console.log(token);
        

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
  
}
const revalidarToken = async( req, res = response ) => {
    /* const uid  = req.uid;
    const name  = req.name; */

    // Genera un nuevo token
    const token = await generarJWT( req.uid, req.name );
    

    res.json({
        ok: true,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}