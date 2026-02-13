import { getAllCustomers,  deleteCustomerById } from '../models/user.model.js';

export const getCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('GET CUSTOMERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteCustomerById(id);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('DELETE CUSTOMER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

