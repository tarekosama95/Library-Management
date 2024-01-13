const express = require("express");
const router = express.Router();
// Book
const bookController = require("../controllers/bookController");
const {
  validateCreateBook,
} = require("../middlewares/validators/Book/validateCreateBook");
const {
  validateUpdateBook,
} = require("../middlewares/validators/Book/validateUpdateBook");

// Borrower
const borrowerController = require("../controllers/borrowerController");
const {
  validateCreateBorrower,
} = require("../middlewares/validators/Borrower/validateCreateBorrower");
const {
  validateUpdateBorrower,
} = require("../middlewares/validators/Borrower/validateUpdateBorrower");

// Borrowing
const borrowingController = require("../controllers/borrowingController");
const {
  validateCreateBorrowing,
} = require("../middlewares/validators/Borrowing/validateCreateBorrowing");
const {
  validateDate,
} = require("../middlewares/validators/Borrowing/validateDateFilter");

// Book Routes
router.get("/books", bookController.index);
router.post("/books", validateCreateBook, bookController.create);
router.get("/books/:id", bookController.show);
router.put("/books/:id", validateUpdateBook, bookController.update);
router.delete("/books/:id", bookController.remove);

// Borrower Routes
router.post("/borrowers", validateCreateBorrower, borrowerController.create);
router.get("/borrowers", borrowerController.index);
router.put("/borrowers/:id", validateUpdateBorrower, borrowerController.update);
router.delete("/borrowers/:id", borrowerController.remove);

// Borrowing Process Routes
router.get("/borrowings", borrowingController.index);
router.get(
  "/borrowings/bought/export",
  validateDate,
  borrowingController.exportBought
);
router.get(
  "/borrowings/returned/export",
  validateDate,
  borrowingController.exportReturned
);

router.get(
  "/borrowings/overdue/export",
  validateDate,
  borrowingController.exportOverDue
);
router.get(
  "/borrowings/analytics",
  validateDate,
  borrowingController.analytics
);
router.post(
  "/borrower/:borrower_id/book/:book_id/checkout",
  validateCreateBorrowing,
  borrowingController.create
);
router.put(
  "/borrowings/:borrowing_id/borrower/:borrower_id/book/:book_id/return",
  borrowingController.update
);

router.get("/borrower/:id/borrowings", borrowingController.show);
module.exports = router;
