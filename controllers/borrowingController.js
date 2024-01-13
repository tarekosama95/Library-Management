const { successResponse, errorResponse } = require("../apiResponse");
const { Op } = require("sequelize");
const { Book, Borrower, Borrowing } = require("../models");
const borrowing = require("../models/borrowing");
const ExcelJS = require("exceljs");

//Check out a book
const create = async (req, res) => {
  try {
    const borrower_id = req.params.borrower_id;
    const book_id = req.params.book_id;
    const borrower = await Borrower.findByPk(borrower_id);
    const book = await Book.findByPk(book_id);
    const { due_date } = req.body;
    if (!borrower) {
      res.status(404).json(errorResponse("Borrower Not Found"));
    }
    if (!book) {
      res.status(404).json(errorResponse("Book Not Found"));
    }
    if (book.quantity <= 0) {
      res.status(200).json(successResponse("Book Out of stock"));
    } else {
      added = await Borrowing.create({
        book_id: book.id,
        borrower_id: borrower.id,
        due_date: due_date,
        status: "Bought",
      });
      if (added) {
        updated = await book.update({
          quantity: book.quantity - 1,
        });
      }
      res.status(201).json(successResponse(added, "Book Checked out"));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
// Return book
const update = async (req, res) => {
  try {
    const borrower_id = req.params.borrower_id;
    const book_id = req.params.book_id;
    const borrowing_id = req.params.borrowing_id;
    const borrower = await Borrower.findByPk(borrower_id);
    const book = await Book.findByPk(book_id);
    const borrowing = await Borrowing.findByPk(borrowing_id);
    if (!borrower) {
      res.status(404).json(errorResponse("Borrower Not Found"));
    }
    if (!book) {
      res.status(404).json(errorResponse("Book Not Found"));
    }
    if (!borrowing) {
      res.status(404).json(errorResponse("Borrowing Not Found"));
    } else {
      updated = await borrowing.update({
        status: "Returned",
      });
      if (updated) {
        updateBook = await book.update({
          quantity: book.quantity + 1,
        });
      }
      res.status(200).json(successResponse(updated, "Book Returned"));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

const show = async (req, res) => {
  try {
    const id = req.params.id;
    const borrower = await Borrower.findByPk(id);
    if (!borrower) {
      res.status(404).json(errorResponse("Borrower Not Found"));
    } else {
      const borrowings = await Borrowing.findAll({
        where: { borrower_id: borrower.id },
      });
      res
        .status(200)
        .json(successResponse(borrowings, "User Borrowings History"));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

const index = async (req, res) => {
  try {
    const status = req.query.status;
    let borrowings;
    if (status) {
      if (status === "Bought") {
        borrowings = await Borrowing.findAll({
          where: { status: "Bought" },
        });
      } else if (status === "Returned") {
        borrowings = await Borrowing.findAll({
          where: { status: "Returned" },
        });
      } else if (status === "OverDue") {
        borrowings = await Borrowing.findAll({
          where: { status: "Bought", due_date: { [Op.lt]: new Date() } },
        });
      } else {
        res.status(404).json(errorResponse("Not Found"));
        return;
      }
    } else {
      borrowings = await Borrowing.findAll();
    }
    res.status(200).json(successResponse(borrowings, "Borrowings"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

const analytics = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (from && to) {
      // Get All Bought Books in that specific time
      const bought = await Borrowing.count({
        where: { status: "Bought", createdAt: { [Op.between]: [from, to] } },
      });
      // Get All Returned Books in that specific time
      const returned = await Borrowing.count({
        where: { status: "Returned", createdAt: { [Op.between]: [from, to] } },
      });
      // Get All OverDue Books in that specific time
      const overDue = await Borrowing.count({
        where: {
          status: "Bought",
          due_date: { [Op.lt]: new Date() },
          createdAt: { [Op.between]: [from, to] },
        },
      });
      res.status(200).json(
        successResponse(
          {
            "Total Bought : ": bought,
            "Total Returned : ": returned,
            "Total OverDue": overDue,
          },
          "Borrowings Report"
        )
      );
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};

const exportBought = async (req, res) => {
  try {
    let { from, to } = req.query;
    if (from && to) {
      let borrowings = await Borrowing.findAll({
        where: {
          status: "Bought",
          createdAt: { [Op.between]: [from, to] },
        },
        include: [
          { model: Book, as: "Book" },
          { model: Borrower, as: "Borrower" },
        ],
      });
      if (borrowings.length === 0) {
        res
          .status(200)
          .json(successResponse(null, "No Bought Files during this period"));
      } else {
        const data = borrowings.map((borrowing) => ({
          Title: borrowing.Book.title,
          User: borrowing.Borrower.name,
          Email: borrowing.Borrower.email,
          Id: borrowing.id,
          Status: borrowing.status,
          "Due Date": borrowing.due_date,
        }));
        // Init worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Borrowing Processed");
        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        // Add rows
        data.forEach((row) => {
          worksheet.addRow(Object.values(row));
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return await workbook.xlsx.write(res).then(() => {
          res.end();
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
const exportReturned = async (req, res) => {
  try {
    let { from, to } = req.query;
    if (from && to) {
      let borrowings = await Borrowing.findAll({
        where: {
          status: "Returned",
          createdAt: { [Op.between]: [from, to] },
        },
        include: [
          { model: Book, as: "Book" },
          { model: Borrower, as: "Borrower" },
        ],
      });
      if (borrowings.length === 0) {
        res
          .status(200)
          .json(successResponse(null, "No Bought Files during this period"));
      } else {
        const data = borrowings.map((borrowing) => ({
          Title: borrowing.Book.title,
          User: borrowing.Borrower.name,
          Email: borrowing.Borrower.email,
          Id: borrowing.id,
          Status: borrowing.status,
          "Due Date": borrowing.due_date,
        }));
        // Init worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Borrowing Returned");
        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        // Add rows
        data.forEach((row) => {
          worksheet.addRow(Object.values(row));
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return await workbook.xlsx.write(res).then(() => {
          res.end();
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
const exportOverDue = async (req, res) => {
  try {
    let { from, to } = req.query;
    if (from && to) {
      let borrowings = await Borrowing.findAll({
        where: {
          status: "Bought",
          due_date: { [Op.lt]: new Date() },
          createdAt: { [Op.between]: [from, to] },
        },
        include: [
          { model: Book, as: "Book" },
          { model: Borrower, as: "Borrower" },
        ],
      });
      if (borrowings.length === 0) {
        res
          .status(200)
          .json(successResponse(null, "No Bought Files during this period"));
      } else {
        const data = borrowings.map((borrowing) => ({
          Title: borrowing.Book.title,
          User: borrowing.Borrower.name,
          Email: borrowing.Borrower.email,
          Id: borrowing.id,
          Status: borrowing.status,
          "Due Date": borrowing.due_date,
        }));
        // Init worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Borrowing overDues");
        const path = "./files";
        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        // Add rows
        data.forEach((row) => {
          worksheet.addRow(Object.values(row));
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition");

        return await workbook.xlsx.write(res).then(() => {
          res.end();
        });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(errorResponse("Something Went wrong, please try again later"));
  }
};
module.exports = {
  create,
  update,
  show,
  index,
  analytics,
  exportBought,
  exportReturned,
  exportOverDue,
};
