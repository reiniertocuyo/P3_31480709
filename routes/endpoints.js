var express = require('express');
var router = express.Router();


router.get('/ping', (req, res) => {
  res.status(200).send();//APARENTEMENTE 200 ES UN ESTANDAR EN LA INDUSTRIA O ALGO ASI
});


router.get('/about', (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nombreCompleto: "Reinier Tocuyo",
      cedula: "31480709",
      seccion: "Sección 1"
    }
  });
});

module.exports = router;