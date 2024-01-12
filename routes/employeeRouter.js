const employeeController = require('../controllers/employeeController.js')

const router = require('express').Router()

router.post('/add-employee', employeeController.addEmployee)

router.get('/all-employee', employeeController.listEmployee)

router.get('/get-employee/:id', employeeController.getEmployee)

router.put('/update-employee/:id', employeeController.updateEmployee)

router.delete('/delete-employee/:id', employeeController.deleteEmployee)

module.exports = router
