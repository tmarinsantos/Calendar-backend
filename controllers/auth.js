const { response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt')

const crearUsuario = async(req, res = response) => {
    
    const { email, password} = req.body;

  try {

        let usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

         //Generar JWT (json web token)
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

  } catch (error) {
    
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        })
  }
    
};

const loginUsuario = async(req, res = response) => {
    
    const { email, password} = req.body;

    try {

        const usuario = await Usuario.findOne({email});

        if(!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y contraseña no son correctos'
            });
        }

        //Confirmar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y contraseña no son correctos'
            }); 
        }

        //Generar JWT (json web token)
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        })
    }
}

const revalidarToken = async(req, res = response) => {
    
    const {uid, name} = req;

    //Generar nuevo JWT (json web token)
    const token = await generarJWT(uid, name);

    res.json({
        ok:true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
