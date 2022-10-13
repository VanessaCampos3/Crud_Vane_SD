import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
    PORT,
  } from './config.js'
  
  
  
  
  import mysql from 'mysql2'
  import express from 'express'
  import bodyParser from 'body-parser'
  
  var app = express()
  
  var con = mysql.createConnection({
  
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  
  })
  
  app.use(express.static('public'))
  
  con.connect()
  
  app.use(bodyParser.json())
  
  app.use(bodyParser.urlencoded({
      extended:true
  }))
  app.get('/inicio',(req,res)=>{
    return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ranking 5IV8(:</title>
        <link rel="icon" href="css/icono.png">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <h2 align="left">Ranking de Alumnos Favoritos del 5IV8 de la Profesora Almita.</h2>
        <center><div class="main-container1">
            <br>
            <br> 
            <form action="/agregarAlumno" method="post">
            <h4>Ingrese el Nombre del Alumno:</h4>
            <input type="text" name="nombre" placeholder="Nombre">
            <br>
            <h4>Seleccione la Calificación:</h4>
            <select name="calificacion">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            <br>
            <h4>Justifique su Calificación:</h4>
            <input type="text" name="descripcion" placeholder="Descripción, queja, cumplido">
            <br>
            <br>
            <input type="submit" value="Registrar Calificación">
        </form>
        <br>
        <br>
    </div>
    </center>
        <br>
        <br>
        <br>
        <br>
        <center><div class="main-container2">
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            
            
    
        <form action="/borrarAlumno" method="post">
            <h4>Ingrese el Nombre del Alumno a Eliminar:</h4>
            <input type="text" name="nombreAlumno" placeholder="Alumno a Eliminar">
            <br>
            <br>
            <input type="submit" value="Eliminar Alumno">
            <br>
            <br>
        </div></center>
        </form>
        <br>
        <br>
        <br>
        <br>
        <center><div class="main-container3">
        <form action="/updAlumno" method="post">
            <h4>Ingrese el Nombre del Alumno a Actualizar:</h4>
            <input type="text" name="nombreA" placeholder="Nombre a Editar">
            <br>
            <h4>Ingrese el Nombre Actualizado:</h4>
            <input type="text" name="nombreUpd" placeholder="Nombre Actualizado">
            <br>
            <h4>Seleccione la Calificación Actualizada:</h4>
            <select name="calificacionUpd">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            <br>
            <h4>Ingrese la justificación Actualizada de su Calificación:</h4>
            <input type="text" name="descripcionUpd" placeholder="Justificación a Editar">
            <br>
            <br>
            <input type="submit" value="Actualizar Cambios">
        </form>
        <br>
        <br>
        <br>
    </div></center>
        <a href="/getAlumnos">Consultar Ranking</a>
    </body>
    </html>`)


    })
  

app.post('/agregarAlumno',(req,res)=>{
    let nombre=req.body.nombre
    let calificacion=req.body.calificacion
    let descripcion=req.body.descripcion


    con.query('insert into tabladeposiciones(nombre, calificacion, descripcion) values("'+nombre+'", "'+calificacion+'", "'+descripcion+'")',(err,respuesta,fields)=>{

        if (err)return console.log("Error",err)

        return res.send(`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        <h1>Calificacion Registrada</h1>`)


    })

})


app.post('/borrarAlumno',(req,res)=>{
    let nombreAlumno=req.body.nombreAlumno;

    con.query('DELETE FROM tabladeposiciones where nombre=("'+nombreAlumno+'")',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        return res.send(`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        <h1>Usuario ${nombreAlumno} eliminado</h1>`)
    })
})

app.get('/getAlumnos',(req,res)=>{
    
    con.query('select nombre, calificacion, descripcion from tabladeposiciones order by calificacion desc',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        var userHTML=``
        var i=0
        console.log(respuesta)
        userHTML+=`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        `
        respuesta.forEach(user=>{
            i++
            userHTML+=`
            <tr><td>${i}</td><td>${user.nombre}</td><td>${user.calificacion}</td><td>${user.descripcion}</td></tr>
            `
        })

        var j=1
        j++
        return res.send(`<center><table>
            <tr>
                <th>Posición</h1>
                <th>Nombre </th>
                <th>Calificación </th>
                <th>Descripción </th>
            </tr>
            ${userHTML}
            </table></center>`)
    })
})

app.post('/updAlumno',(req,res)=>{
    let nombreA=req.body.nombreA;
    let nombreUpd=req.body.nombreUpd
    let calificacionUpd=req.body.calificacionUpd
    let descripcionUpd=req.body.descripcionUpd

    con.query('UPDATE tabladeposiciones SET nombre=("'+nombreUpd+'"), calificacion=("'+calificacionUpd+'"), descripcion=("'+descripcionUpd+'") WHERE nombre=("'+nombreA+'")',(err,respuesta,field)=>{
        if(err) return console.log('ERROR:',err)

        return res.send(`
        <a href="index.html"><link rel="stylesheet" href="css/style.css">Inicio</a></a>
        <h1>Usuario ${nombreA} editado exitosamente.</h1>
        `)
    })
})



app.listen(PORT,()=>{
    console.log("Servidor escuchando en el puerto ", PORT)
})