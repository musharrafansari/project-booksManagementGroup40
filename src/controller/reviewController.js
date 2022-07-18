const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const validator = require("../validator/validator")

const reviewModel = require("../models/reviewModel")

const { isValidObjectId, isValidRequestBody, isValid } = require('../validator/validator')

const createReviewByParams = async function (req, res) {
    try{
    //===============================first check params===========================>
    let bookId = req.params.bookId
    // console.log(bookId)
    if (!isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "Book id number is not valid" })

    const checkbookId = await bookModel.findById({ _id:bookId})
    // console.log(checkbookId)
    if (!checkbookId)
        return res.status(404).send({ status: false, message: "book Id is not found." })

    if (checkbookId.isDeleted == true)
        return res.status(404).send({ status: false, message: "bookId is not found or might be deleted" })


    //============================= form req.body======================================>

    let body = req.body
    //===================destructuring==============================================>
    const { rating, review } = body
    //========================check valid body======================================>
    if (isValidRequestBody.body)
        return res.status(400).send({ satus: false, message: "please provide data" })
    if (!review)
        return res.status(400).send({ status: false, message: "please provide review" })
    // //==========================check alphabetic character for review=============>



    if (!rating)
        return res.status(400).send({ status: false, message: "please provide rating" })
    if (!(rating < 6) && (rating > 0))
        return res.status(400).send({ status: false, message: "please type 1 to 5 number only" })

    body.bookId = bookId

    await reviewModel.create(body)
    // console.log(reviewData)
    //=======================================================================================>
    let getReviewdata = await reviewModel.find({ bookId: bookId, isDeleted: false })
    // console.log(getReviewdata)
    if (!getReviewdata) { return res.status(404).send({ status: false, msg: "Review data not present for this bookId." }) }
    //==============================reviewsData check=====================================================>
    Object.assign(checkbookId._doc,{ reviewData:getReviewdata});


    await bookModel.updateOne({ _id: bookId }, { $inc: { reviews: 1 } })
    // res.status(201).send({ status: true, message: "Success", data: reviewData })
    res.status(200).send({ status: true, message: "Book List", data: checkbookId });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    }
       
}

 
     


const updateReviewByParams = async function (req, res) {
    try{
    const bookReviewId = req.params
    // console.log(bookReviewId);
    const { bookId, reviewId } = bookReviewId
    //=============================bookId check=======================================>
    if (!isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "bookId is not valid" })
    const checkBookId = await bookModel.findById({ _id: bookId })
    // console.log(checkBookId);
    if (!checkBookId)
        return res.status(404).send({ status: false, message: "book Id is not found" })
    //===========================================================================================>

    //=================================isdeleted check============================>
    if (checkBookId.isDeleted === true)
        return res.status(404).send({ status: false, message: "Data is not found or might be deleted" })
    //============================review id check ==============================================>
    if (!isValidObjectId(reviewId))
        return res.status(400).send({ status: false, message: "reviewId is not valid" })
    const checkReviewId = await reviewModel.findById({ _id: reviewId })
    console.log(checkReviewId);
    if (!checkReviewId) 
        return res.status(404).send({ status: false, message: "review Id is not found" })
    //=============================== body ========================================>
    if (bookId != checkReviewId.bookId)
        return res.status(400).send({ status: false, message: "book and review id is did't match" })
    //==================================================================================>
    const body = req.body
    // console.log(body);
    const { review, rating, reviewedBy } = body
    if (!(rating < 6) && (rating > 0))
        return res.status(400).send({ status: false, message: "please give rating between 1 to 5" })

    await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { review, rating, reviewedBy } }, { new: true })
    // console.log(updateData);
    //======================================fetch reviews detail=================================================>
    let getReviewdata = await reviewModel.find({ _id: reviewId, isDeleted: false })
    if (!getReviewdata) { return res.status(404).send({ status: false, msg: "Review data not present for this bookId." }) }
    //==============================reviewsData check=====================================================>
    Object.assign(checkBookId._doc, { reviewsData: getReviewdata });
    res.status(200).send({ status: true, message: "Book List", data: checkBookId });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    }
}




const deleteByparams = async function (req, res) {
    try{
    const bookReviewId = req.params
    const { bookId, reviewId } = bookReviewId
    //=============================bookId check=======================================>
    if (!isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "BookId is not valid" })
    const checkBookId = await bookModel.findById(bookId)
    // console.log(checkBookId)
    if (!checkBookId)
        return res.status(404).send({ status: false, message: "Book Id is not found" })
    //=================================================================================>
    //const checkBookName = await bookModel.findById(bookId) 
    if (!checkBookId)
        return res.status(404).send({ status: false, message: "Book name is not present" })

    //============================review id check ==============================================>
    if (!isValidObjectId(reviewId))
        return res.status(400).send({ status: false, message: "reviewId is not valid" })
    const checkReviewId = await reviewModel.findById(reviewId)
    if (!checkReviewId)
        return res.status(404).send({ status: false, message: "Review Id is not found" })
    //const checkReviewName = await reviewModel.findById(reviewId)
    if (!checkReviewId.review)
        return res.status(404).send({ status: false, message: "Review name is not present" })
    //=======================================isDeleted======================================>
    if (checkReviewId.isDeleted === true)
        return res.status(404).send({ status: false, message: "Review might be deleted" })

    if (bookId != checkReviewId.bookId)
        return res.status(400).send({ status: false, message: "book and review id is did't match" })

    const updateDelete = await reviewModel.updateMany({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true })
    await bookModel.updateOne({ _id: bookId }, { $inc: { reviews: -1 } })
    res.status(200).send({ status: true, mesaage: "Successfully deleted", data: `deleted data count = ${updateDelete.modifiedCount}` })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    
}
}




module.exports = { createReviewByParams, updateReviewByParams, deleteByparams }

