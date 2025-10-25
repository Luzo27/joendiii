const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(__dirname)); // para servir HTML e imágenes
app.use(express.json({limit:'5mb'})); // <-- para recibir imágenes en base64

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'H9r$2vWq#K7sTz8Xb4PpLm3Yd!5uAq',
  database: 'verduleria'
});

db.connect(err => {
  if(err){
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// GET productos para cliente
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST para agregar producto desde empleado
app.post('/agregar-producto', (req, res) => {
  const {nombre, cat, precio, img} = req.body;
  if(!nombre || !cat || !precio || !img){
    return res.json({success:false, error:'Faltan datos'});
  }
  const sql = 'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, cat, precio, img], (err,result)=>{
    if(err) return res.json({success:false, error:err.message});
    res.json({success:true, id: result.insertId});
  });
});

// Servir HTML cliente
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente2.html');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
