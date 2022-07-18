const express = require('express');
const router = express.Router();
const userController = require("../controller/usercontroller")
const bookcontroller = require("../controller/bookcontroller")
const reviewController = require("../controller/reviewcontroller")
const userModel = require("../models/userModel")
const validator = require("../validator/validator")
const validauth = require("../validator/auth")


// User APIs
router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)

// aws.config.update({
//     accessKeyId: "AKIAY3L35MCRVFM24Q7U",
//     secretAccessKeyId: "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
//     region: "ap-south-1"
// })

// Books API
router.post('/books', validauth.Authentication, bookcontroller.createBook)

// router.post("/write-file-aws",bookcontroller.coverPage)

router.get('/books', validauth.Authentication, bookcontroller.getBook)

router.get('/books/:bookId', validauth.Authentication, bookcontroller.getBookByParams)

router.put('/books/:bookId', validauth.Authentication, bookcontroller.updateBookByParams)

router.delete('/books/:bookId', validauth.Authentication, bookcontroller.deleteBookByParams)



//Review APIs

router.post('/books/:bookId/review', reviewController.createReviewByParams)

router.put('/books/:bookId/review/:reviewId', reviewController.updateReviewByParams)

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteByparams)


router.all('/*/', async function(req, res) {
    res.status(404).send({ status: false, msg: "Page Not Found!!!" })
})



module.exports = router;