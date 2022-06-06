require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../DbConnection.js');
var hash = require('../hashing.js');

router.post('/tambah', (req, res) => {
    var token = req.headers.token;
    var data = req.body;

    if(token == null || token === ""){
        res.status(403).json({
            status: false,
            message: 'anda tidak memiliki akses'
        })
    } else {
        if(token === process.env.SECRET_KEY){
            var validateInputan = checkInput(
                Object.entries(data),
                ['full_name','nik','tanggal_lahir','alamat','no_hp','username','password','office']
            );
            if(validateInputan.status){
                db.query(
                    "insert into Pegawai values (?)",
                    [[data.full_name, data.nik, data.tanggal_lahir, data.alamat, data.no_hp, data.username, hash.encrypt(data.password), data.office]],
                    (err, result) => {
                        if(err){
                            res.json({
                                status: false,
                                message: err
                            })
                        } else {
                            if(result.affectedRows > 0){
                                res.json({
                                    status: true,
                                    message: "berhasil menambahkan pegawai"
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: "gagal menambahkan pegawai"
                                })
                            }
                        }
                    }
                );
            } else {
                res.json(validateInputan);
            }
        } else {
            res.status(403).json({
                status: false,
                message: 'token user denied'
            });
        }
    }
})

router.put('/mengubah/:nik',(req, res) => {
    var token = req.headers.token;
    var data = req.body;

    if(token == null || token === ""){
        res.status(403).json({
            status: false,
            message: 'anda tidak memiliki akses'
        });
    } else {
        if(token === process.env.SECRET_KEY){
            var validateInputan = checkInput(
                Object.entries(data),
                ['full_name','tanggal_lahir','alamat', 'no_hp', 'password', 'office']
            );
            if(validateInputan.status){
                edit(req.params.nik, data, res);
            }else {
                res.json(validateInputan)
            }
        } else {
            var username = hash.decrypt(token);
            db.query(
                "select * from pegawai where nik=? and username=?",
                [req.params.nik, username],
                (err, result) => {
                    if(err){
                        res.json({
                            status: false,
                            message: err
                        })
                    } else {
                        if(result.length > 0){
                            var validateInputan = checkInput(
                                Object.entries(data),
                                ['full_name','tanggal_lahir','alamat', 'no_hp', 'password', 'office']
                            );
                            if(validateInputan.status){
                                edit(result[0].nik, data, res);
                            }else {
                                res.json(validateInputan)
                            }
                        } else {
                            res.status(403).json({
                                status: false,
                                message: 'anda tidak memiliki akses'
                            });
                        }
                    }
                }
            )
        }
    }
})

router.post('/login', (req, res) => {
    var data = req.body;
    var inputValidate = checkInput(Object.entries(data),['username', 'password']);
    if(inputValidate.status){
        db.query(
            "select * from pegawai where binary username=? and password=?",
            [data.username, hash.encrypt(data.password)],
            (err, result) => {
                if(err){
                    res.json({
                        status: false,
                        message: err
                    })
                }else {
                    if(result.length > 0){
                        res.json({
                            status: true,
                            message: 'berhasil login',
                            data: {
                                token: hash.encrypt(data.username),
                                user: result[0]
                            }
                        })
                    }else {
                        res.json({
                            status: false,
                            message: 'username atau password salah'
                        })
                    }
                }
            }
        )
    } else {
        res.json(inputValidate);
    }
})

function checkInput(inputan, roles){
    var isFound = true;
    var listNone = [];
    for(var i = 0; i < roles.length; i++){
        var found = false;
        for(var j = 0; j < inputan.length; j++){
            if(inputan[j][0] === roles[i] && inputan[j][1] !== ""){
                found = true;
                break;
            }
        }
        if(!found){
            isFound = false;
            listNone.push(roles[i])
        }
    }
    if(isFound){
        var object = {
            status: isFound,
            message: 'data ditemukan'
        }
        return object;
    }else {
        var object = {
            status: isFound,
            message: listNone.toString()+' tidak ditemukan atau kosong'
        }
        return object;
    }
}

function edit(nik, data, res){
    db.query(
        "update pegawai set nama_lengkap=?, tanggal_lahir=?, alamat=?, no_hp=?, password=?, office=? where nik=?",
        [data.full_name, data.tanggal_lahir, data.alamat, data.no_hp, hash.encrypt(data.password), data.office, nik],
        (err, result) => {
            if(err){
                res.json({
                    status: false,
                    message: err
                })
            } else {
                if(result.affectedRows > 0){
                    res.json({
                        status: true,
                        message: "berhasil mengubah data pegawai"
                    })
                } else {
                    res.json({
                        status: false,
                        message: "gagal mengubah data"
                    })
                }
            }
        }
    )
}

module.exports = router;