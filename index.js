const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();


app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/doctor',(req,res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("DoctorPortal").collection("doctor");
        collection.find().toArray((err,documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
})

app.get('/patientinfo',(req,res)=>{
    client = new MongoClient(uri, {useNewUrlParser: true });
    client.connect(e =>{
        const collection = client.db("DoctorPortal").collection("patientInfo");
        collection.find().toArray((err,documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
})

app.get('/patientInfo/:key', (req,res) => {
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("DoctorPortal").collection("patientInfo");
        collection.find({date:key}).toArray((err,documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
})

app.post('/doctorinfo',(req,res)=>{
    const doctorInfo = req.body;
    client = new MongoClient(uri, {useNewUrlParser: true });
    client.connect(e =>{
        const collection = client.db("DoctorPortal").collection("doctor");
        collection.insert(doctorInfo,(err,result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
    })
})

app.post('/patientinfo',(req,res)=>{
    const patientInfo = req.body;
    patientInfo.sendingTime = new Date();
    client = new MongoClient(uri, {useNewUrlParser: true });
    client.connect(e =>{
        const collection = client.db("DoctorPortal").collection("patientInfo");
        collection.insertOne(patientInfo,(err,result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
    })
})


const port = process.env.PORT || 4200 ;
app.listen(port, (err) => console.log('Listening to port', port));