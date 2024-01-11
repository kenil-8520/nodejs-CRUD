const express = require("express");
const employeeTable = require("./models").employee;

const router = express.Router();


router.get("/", (req, res) => {
    res.json({status: true, message: "API working"})
})

router.post("/add-employee", (req, res) => {
  employeeTable.findOne({ where: { email: req.body.email }})
    .then((data) => {
      if (data) {
        return res.json({ status: false, message: "Email already exist" });
      } else {
        employeeTable
          .create({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            mobile: req.body.mobile,
          })
          .then((success) => {
            res.json({
              status: true,
              message: "Employee added successfully",
            });
          })
          .catch((error) => {
            res.json({
              status: false,
              message: "Employee not added",
            });
          });
        }
    })
    .catch((error) => {
      res.json({
        status: false,
        message: "Something went wrong",
      });
    });
});

router.get("/all-employee", (req, res) => {
 employeeTable.findAll()
 .then((data) => {
    if(data){
        return res.json({
            status:true,
            message: data
        })
    }
    else{
        return res.json({
            status: true,
            message: "No employee found"
        });
    }
 })
 .catch((error) => {
    res.json({
        status : false,
        message : 'Error in fetching data'
    })
 })
});

router.get("/get-employee/:id", (req, res) => {
    employeeTable.findOne({ where: { id: req.params.id }})
    .then((data) => {
        if(data){
            res.json({
                status: true,
                message: data
            })
        }
        else{
            res.json({
                status:false,
                message:"Employee not found!"
            })
        }
    })
    .catch((error) => {
        res.json({
            status : false,
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
                    res.json({status:true, message: "Employee updated successfully"})
                }
            }).catch((error) => {
                res.json({status:false, message:"Error in updating data"})
            })
        }
        else{
            res.json({
                status: false,
                message: "No employee found"
            })
        }
    })
    .catch((error) => {
        res.json({
            status: false,
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
                res.json({status:true, message:"employee deleted successfully"})
            })
            .catch((error) => {
                res.json({status:false, message:"employee not deleted"})
            })
        }
        else{
            res.json({status:false, message:"employee not found"})
        }
    })
    .catch((error) =>{
        res.json({status:false, message: "Something went wrong"})
    })
});

module.exports = router;
