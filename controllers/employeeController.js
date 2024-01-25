const db = require("../models");
const Yup = require("yup");

const Employee = db.employees;

const addEmployee = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({success: false, message: "Request body is empty provide name, email and mobile",});
    }
    const requiredFields = ["name", "email"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }
    const dataScheme = Yup.object({
      name: Yup.string().required("Name is required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in name field"),
      email: Yup.string().matches(/^[^\d\s@][^\s@]*@[^\s@]+\.[^\s@]+$/).required("Email is required"),
      mobile: Yup.number().integer("A phone number can't include a decimal point").positive("A phone number can't be negative")
    });

    const data = {};
    Object.entries(req.body).forEach(([key, value]) => {
        data[key] = value.trim();
    });

    if (data.mobile && data.mobile.length !== 10) {
      return res.status(422).json({ success: false, message: "Please provide valid 10 digit number"});
    }
    const valdiatedData = await dataScheme.validate(data);
    if (!valdiatedData) {
      return res.status(400).send({message: "Data not valid",});
    }
    await Employee.create(data);
    return res.status(201).json({ success: true, data: data, message: "Employee added successfully"});
  } catch (error) {
    const errors = error.errors[0]?.message || error.message?.errors || error.errors || "Something went wrong";
    return res.status(400).json({ success: false, message: errors });
  }
};

const listEmployee = async (req, res) => {
  try {
    const data = await Employee.findAll({});
    if (!data) {
      return res.status(404).json({ success: true, message: "No employee found" });
    }
    return res.status(200).json({ success: true, data: data, message: "Retrived all employees" });
  } catch (error) {
    const errors =
      error.errors[0]?.message || error.message?.errors || error.errors || "Something went wrong";
    return res.status(400).json({ success: false, message: errors });
  }
};

const getEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Employee.findOne({ where: { id: id } });
    if (!data) {
      return res.status(404).json({ success: true, message: "No employee found" });
    }
    return res.status(200).json({ success: true, data: data, message: "Retrieved employee data" });
  } catch (error) {
    const errors = error.message || error.errors[0]?.message || error.message?.errors || error.errors || "Something went wrong";
    if (error.message && error.message.includes("Truncated incorrect DOUBLE value")) {
        return res.status(500).json({ success:false, error: 'Invalid employee ID' });
      }
    return res.status(400).json({ success: false, message: errors });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;

    const dataScheme = Yup.object({
      name: Yup.string().matches(/^[aA-zZ\s]+$/,"Only alphabets are allowed in the name field"),
    //   email: Yup.string().matches(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/),
      email: Yup.string().matches(/^[^\d\s@][^\s@]*@[^\s@]+\.[^\s@]+$/),
      mobile: Yup.number().integer("A phone number can't include a decimal point").positive("A phone number can't be negative"),
    });

    const data = {};
    Object.entries(req.body).forEach(([key, value]) => {
        data[key] = value.trim();
    });
    try {
      await dataScheme.validate(data);
    } catch (validationError) {
        if (validationError && validationError.errors.includes("email must match the following: \"/^[^\\d\\s@][^\\s@]*@[^\\s@]+\\.[^\\s@]+$/\"")) {
            return res.status(400).json({ success:false, message: 'Invalid email format' });
          }
      return res.status(400).json({ success: false, message: validationError.errors[0] });
    }

    if (data.mobile && data.mobile.length !== 10) {
      return res.status(422).json({
        success: false,
        message: "Please provide a valid 10-digit number",
      });
    }

    const employee = await Employee.findOne({ where: { id: id } });

    if (!employee) {
      return res.status(404).json({ success: true, message: "No employee with this id" });
    }

    try {
      await Employee.update(data, { where: { id: id } });
      const employee = await Employee.findOne({ where: { id: id } });
      return res.status(200).json({ success: true, data: employee, message: "Employee updated successfully",});
    } catch (error) {
      const errors = error.message || error.errors[0]?.message || error.message || error.errors || error;
      if (error.message && error.message.includes("Truncated incorrect DOUBLE value")) {
        return res.status(500).json({ success:false, error: 'Invalid employee ID' });
      }
      else if (error.message && error.message.includes("Validation error")) {
        return res.status(500).json({ success:false, error: 'Email already exists' });
      }
      return res.status(500).json({ success: false, message: errors });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Employee.destroy({ where: { id: id } });
    if (!data) {
      return res.status(404).json({ success: true, message: "Employee not found" });
    }
    else{
        return res.status(200).json({ success: true, message: "Employee deleted successfully" });
    }
  } catch (error) {
    const errors = error.message || error.errors[0]?.message ||  error.message?.errors || error.errors || "Something went wrong";
    if (error.message && error.message.includes("Truncated incorrect DOUBLE value")) {
        return res.status(400).json({ success:false, error: 'Invalid employee ID' });
      }
    return res.status(500).json({ success: false, message: errors });
  }
};

module.exports = {
  addEmployee,
  listEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
