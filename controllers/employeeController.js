const db = require('../models')
const Yup = require('yup')

const Employee = db.employees

const addEmployee = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ code: 400, message: 'Request body is empty or contains no data' });
        }
        const requiredFields = ['name', 'email', 'mobile'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ code: 400, message: `${field} is required` });
            }
        }
        const dataScheme = Yup.object({
        name: Yup.string().required("name is required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in name field"),
        email: Yup.string().email().required('email is required'),
        mobile: Yup.number().required('mobile is required'),
        })

        const data = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        }
        if(data.mobile.length !== 10){
            return res.status(422).json({code: 422, message: "Please provide valid 10 digit number"})
        }
        const valdiatedData = await dataScheme.validate(data)
        console.log(valdiatedData);
        if(!valdiatedData){
            return res.status(400).send({
                message:'Data not valid'
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
    try{
        const id = req.params.id
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
    try{
        const id = req.params.id;
        const data = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        };

        const dataScheme = Yup.object({
            name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in the name field"),
            email: Yup.string().email(),
            mobile: Yup.number()
        });

        try {
            await dataScheme.validate(data);
        } catch (validationError) {
            return res.status(400).json({
                code: 400, message: validationError.errors[0]
            });
        }

        if (data.mobile.length !== 10) {
            return res.status(422).json({ code: 422, message: "Please provide a valid 10-digit number" });
        }

        const employee = await Employee.findOne({ where: { id: id } });

        if (!employee) {
            return res.status(404).json({ code: 404, message: "No employee with this id" });
        }

        try {
            await Employee.update(req.body, { where: { id: id } });
            res.status(200).json({ code: 200, message: "Employee updated successfully" });
        } catch (error) {
            const errors = error.errors[0]?.message || error.message || error.errors;
            res.status(500).json({ code: 500, message: errors });
        }
    }
    catch(error){
        res.status(500).json({ code: 500, message: "something went wrong" });
    }
};

const deleteEmployee = async (req, res) => {
    try{
        const id = req.params.id;
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
