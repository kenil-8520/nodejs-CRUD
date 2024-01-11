const express = require("express");
const employeeTable = require("./models").employee;

const router = express.Router();


router.get("/", (req, res) => {
    res.status(200).json({status: 200, message: "API working"})
})

router.post("/add-employee", (req, res) => {
  employeeTable.findOne({ where: { email: req.body.email }})
    .then((data) => {
      if (data) {
        return res.status(409).json({status: 409, message: "Email already exist"})
      } else {
        employeeTable
          .create({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            mobile: req.body.mobile,
          })
          .then((success) => {
            res.status(201).json({
              status: 201,
              message: "Employee added successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              status: 500,
              message: "Employee not added",
            });
          });
        }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Something went wrong",
      });
    });
});

router.get("/all-employee", (req, res) => {
 employeeTable.findAll()
 .then((data) => {
    if(data){
        return res.status(200).json({
            status:200,
            message: data
        })
    }
    else{
        return res.status(404).json({
            status: 404,
            message: "No employee found"
        });
    }
 })
 .catch((error) => {
    res.status(500).json({
        status : 500,
        message : 'Error in fetching data'
    })
 })
});

router.get("/get-employee/:id", (req, res) => {
    employeeTable.findOne({ where: { id: req.params.id }})
    .then((data) => {
        if(data){
            res.status(200).json({
                status: 200,
                message: data
            })
        }
        else{
            res.status(404).json({
                status:404,
                message:"Employee not found!"
            })
        }
    })
    .catch((error) => {
        res.status(500).json({
            status : 500,
            message: "Error in fetching data"
        })
    })
});

router.put("/update-employee/:id", (req, res) => {
    employeeTable.findOne({ where:{ id: req.params.id } })
    .then((data) => {
        if(data){
            employeeTable.update({
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                mobile: req.body.mobile
            },{
                where: {
                    id: req.params.id
                }
            }).then((data) => {
                if(data){
                    res.status(200).json({status:200, message: "Employee updated successfully"})
                }
            }).catch((error) => {
                res.status(500).json({status:500, message:"Error in updating data"})
            })
        }
        else{
            res.status(404).json({
                status: 404,
                message: "No employee found"
            })
        }
    })
    .catch((error) => {
        res.status(500).json({
            status: 500,
            message: "Something went wrong"
        })
    })
});

router.delete("/delete-employee/:id", (req, res) =>{
    employeeTable.findOne({ where:{ id: req.params.id }})
    .then((data) =>{
        if(data){
            employeeTable.destroy({
                where:{
                    id: req.params.id
                }
            }).then((data) =>{
                res.status(200).json({status:200, message:"employee deleted successfully"})
            })
            .catch((error) => {
                res.status(500).json({status:500, message:"employee not deleted"})
            })
        }
        else{
            res.status(404).json({status:404, message:"employee not found"})
        }
    })
    .catch((error) =>{
        res.status(500).json({status:500, message: "Something went wrong"})
    })
});

module.exports = router;
