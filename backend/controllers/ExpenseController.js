import Expense from "../models/ExpenseModel.js";


export const createExpense = async (req, res) => {
  try {
    const { paidTo, amount, category, subCategory, paymentMethod, transactionId, expenseDate, notes, userName } = req.body;

    if (!paidTo || !amount || !paymentMethod || !userName || !expenseDate || !category) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const expense = await Expense.create({
      paidTo,
      amount,
      category,
      subCategory,
      paymentMethod,
      transactionId,
      expenseDate,
      notes,
      userName
    });

    res.status(201).json({ success: true, expense });
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ success: false, message: "Server Error while creating expense", error: err.message });
  }
};

export const listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    return res.status(200).json({ success: true, expenses });
  } catch (err) {
    console.error("Error listing expenses:", err);
    res.status(500).json({ success: false, message: "Server Error while listing expenses", error: err.message });
  }
};

export const listExpenseProfile = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expenseDetails = await Expense.findById(expenseId);
    if (!expenseDetails) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    return res.status(200).json({ success: true, expenseDetails });
  } catch (err) {
    console.error("Error listing expense profile:", err);
    res.status(500).json({ success: false, message: "Server Error while listing expense profile", error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updateData = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updateData, { new: true, runValidators: true });

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, expense: updatedExpense });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ success: false, message: "Server Error while updating expense", error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully", expense: deletedExpense });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ success: false, message: "Server Error while deleting expense", error: err.message });
  }
};