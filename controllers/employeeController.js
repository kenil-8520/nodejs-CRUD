const db = require('../models')
const Yup = require('yup')

const Employee = db.employees

const addEmployee = async (req, res) => {
    try {
        const dataScheme = Yup.object({
        name: Yup.string().required("name is required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        email: Yup.string().email().required('email is required'),
        mobile: Yup.number().max(10,"number must be 10 digit number").required('Mobile is required')
        .typeError("That doesn't look like a phone number")
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point"),
        })

        const data = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        }
        const valdiatedData = await dataScheme.validate(data)

        if(!valdiatedData){
            return res.status(400).send({
                message:'data not valid'
            })
        }
        await Employee.create(data)
        return res.status(201).json({code : 201, message:"Employee added successfully", data})
    }
    catch (error) {
        const errors = error.errors[0]?.message || error.message?.errors || error.errors;
        return res.status(400).json({code: 400, message: errors})
    }
}

const listEmployee = async (req, res) => {
    try{
        const data = await Employee.findAll({})
        return res.status(200).json({code:200, data})
    }
    catch(error) {
        const errors = error.errors[0]?.message || error.message?.errors || error.errors;
        return res.status(404).json({code :404, message: "No data found", errors})
    }
}

const getEmployee = async (req, res) => {
    const id = req.params.id
    try{
        const data = await Employee.findOne({ where: {id: id} })
        return res.status(200).json({code:200, data})
    }
    catch(error){
        const errors = error.errors[0]?.message || error.message?.errors || error.errors;
        console.log(errors);
        return res.status(404).json({code:404, message: 'No data Found'});

    }
}

const updateEmployee = async (req, res) => {
    const id = req.params.id

    const dataScheme = Yup.object({
        name: Yup.string(),
        email: Yup.string().email(),
        mobile: Yup.number().min(10,'number should be 10').max(12, 'number should be 10')
        })

    const employee = await Employee.findOne({ where: {id: id} })
    if(!employee){
        res.status(404).json({code:404, message:"No employee with this id"})
    }
    const valdiatedData = await dataScheme.validate(data)
    if(!valdiatedData){
        return res.status(400).send({
            message:'data not valid'
        })
    }
    try{
        await Employee.update(req.body, { where: { id: id }})
        res.status(200).json({code: 200, message: "Employee updated successfully"})
    }
    catch(error) {
        const errors = error.errors[0]?.message || error.message?.errors || error.errors;
        res.status(500).json({code:500, message: errors})
    }
}

const deleteEmployee = async (req, res) => {
    const id = req.params.id;
    try{
        const data = await Employee.destroy({ where: { id: id }} )
        if(!data){
            res.status(404).json({code:404, message:"Employee not found"})
        }
        res.status(200).json({code:200, message: "Employee deleted successfully"})
    }
    catch(error) {
        const errors = error.errors[0]?.message || error.message?.errors || error.errors;
        res.status(500).json({code:500, message: errors})
    }
}

module.exports = {addEmployee,
                listEmployee,
                getEmployee,
                updateEmployee,
                deleteEmployee}
