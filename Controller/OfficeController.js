require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../DbConnection.js');

router.get('/',(req, res) => {
    db.query("select * from office", (err, result) => {
        res.json(result);
    })
})

router.post('/tambah', (req, res) => {
    var token = req.headers.token;
    var data = req.body;
    if (token == null || token===""){
        res.status(403).json({
            status: false,
            message: 'anda tidak memiliki akses'
        });
    } else {
        if (token === process.env.SECRET_KEY){
            if((data.office_name == null || data.office_name === "") || (data.alamat == null || data.alamat === "")){
                res.json({
                    status: false,
                    message: 'office name atau alamat kosong atau tidak ditemukan'
                })
            } else {
                db.query(
                    "insert into office(office_name, alamat) values(?,?)",
                    [data.office_name, data.alamat],
                    (err, result) => {
                        if(err){
                            res.json({
                                status: false,
                                message: err.message
                            })
                        } else {
                            if (result.affectedRows > 0){
                                res.json({
                                    status: true,
                                    message: 'berhasil menambahkan data'
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: 'gagal menambahkan data'
                                })
                            }
                        }
                    }
                )
            }
        } else {
            res.status(403).json({
                status: false,
                message: 'token user denied'
            })
        }
    }
})

router.put('/mengubah/:id',(req, res) => {
    var token = req.headers.token;
    var data = req.body;
    if (token == null || token===""){
        res.status(403).json({
            status: false,
            message: 'anda tidak memiliki akses'
        })
    } else {
        if (token === process.env.SECRET_KEY){
            if((data.office_name == null || data.office_name === "") || (data.alamat == null || data.alamat === "")){
                res.json({
                    status: false,
                    message: 'office name atau alamat kosong atau tidak ditemukan'
                })
            } else {
                db.query(
                    "update office set office_name=?, alamat=? where id=?",
                    [data.office_name, data.alamat, req.params.id],
                    (err, result) => {
                        if(err){
                            res.json({
                                status: false,
                                message: err.message
                            })
                        } else {
                            if (result.affectedRows > 0){
                                res.json({
                                    status: true,
                                    message: 'berhasil mengubah data'
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: 'gagal mengubah data'
                                })
                            }
                        }
                    }
                )
            }
        } else {
            res.status(403).json({
                status: false,
                message: 'token user denied'
            })
        }
    }
})

router.delete('/menghapus/:id',(req, res) => {
    var token = req.headers.token;
    var data = req.body;
    if (token == null || token===""){
        res.status(403).json({
            status: false,
            message: 'anda tidak memiliki akses'
        })
    } else {
        if (token === process.env.SECRET_KEY){
            db.query(
                "delete from office where id=?",
                [req.params.id],
                (err, result) => {
                    if(err){
                        res.send({
                            status: false,
                            message: err.message
                        })
                    }else {
                        if(result.affectedRows > 0){
                            res.send({
                                status: true,
                                message: 'berhasil menghapus data'
                            })
                        } else {
                            res.send({
                                status: true,
                                message: 'gagal menghapus data'
                            })
                        }
                    }
                }
            )
        } else {
            res.status(403).json({
                status: false,
                message: 'token user denied'
            })
        }
    }
})

module.exports = router;