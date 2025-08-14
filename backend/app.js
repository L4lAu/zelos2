import express from 'express';

const port = 3000;


app.get('/',  (req, res)=> {
    res.status(200).send('pg inicial')
});




app.listen(port, ()=> {
    console.log('Servidor web rodando em http://localhost:3000');
});