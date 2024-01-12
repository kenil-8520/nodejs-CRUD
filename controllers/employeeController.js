const db = require('../models')

const Employee = db.employees


const addEmployee = async (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    if (!mobileRegex.test(req.body.mobile)) {
        return res.status(400).json({ message: "Invalid mobile number" });
    }

    const data = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    }

    const employee = await Employee.create(data)
    .then((data) => {
        return res.status(201).json({message:"Employee added successfully", data})
    })
    .catch((err) => {
        return res.status(500).json({message: "Employee not added ", err})
    })
}

const listEmployee = async (req, res) => {
    const data = await Employee.findAll({})
    .then((data) => {
        return res.status(200).json({data})
    })
    .catch((err) => {
        return res.status(404).json({message: "No data found", err})
    })
}

const getEmployee = async (req, res) => {
    const id = req.params.id
    const data = await Employee.findOne({ where: {id: id} })
    .then((data) => {
        return res.status(200).json({data})
    })
    .catch((err) => {
        console.log(err);
        return res.status(404).json({message: 'No data Found'});
    })
}

const updateEmployee = async (req, res) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    if (!mobileRegex.test(req.body.mobile)) {
        return res.status(400).json({ message: "Invalid mobile number" });
    }

    const id = req.params.id
    const data = await Employee.update(req.body, { where: { id: id }})
    .then((data) => {
        res.status(200).json({message: "Employee updated successfully", data})
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({message: "Employee not updated"})
    })
}

const deleteEmployee = async (req, res) => {
    const id = req.params.id;
    await Employee.destroy({ where: { id: id }} )
    .then((data) => {
        res.status(200).json({message: "Employee deleted successfully"})
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({message: "Employee not deleted"})
    })
}

module.exports = {addEmployee,
                listEmployee,
                getEmployee,
                updateEmployee,
                deleteEmployee}
