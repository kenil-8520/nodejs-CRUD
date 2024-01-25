const express = require('express')
const cors = require('cors')

const app = express()
var corOptions = {
    origin: 'https://localhost:8081'
}

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) =>{
    res.json({message : "API working"})
})


const employeerouter = require('./routes/employeeRouter.js')
const authrouter = require('./routes/authRoute.js')

app.use('/api', employeerouter)
app.use('/api', authrouter)

const PORT = 8080


app.listen(PORT, () => {
    console.log("server running on http://localhost:8080");
})
