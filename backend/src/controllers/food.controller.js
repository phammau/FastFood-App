import { FoodModel } from '../models/food.model.js';


const API_URL = process.env.API_URL;
//User
export const getFoods = (req, res) => {
  FoodModel.getAll((err, results) => {
    if (err) {
      console.error('GET FOODS ERROR:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
};

export const getFoodById = (req, res) => {
  FoodModel.getById(req.params.id, (err, results) => {
    if (err) {
      console.error('GET FOOD BY ID ERROR:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(results[0]);
  });
};

//Admin
export const addFood = (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  const { name, price, description } = req.body;
  const image = req.file
    ? `${API_URL}/uploads/${req.file.filename}`
    : '';

  // validate
  if (!name || price === undefined) {
    return res.status(400).json({
      message: 'Name and price are required',
    });
  }

  FoodModel.create(
    {
      name,
      price,
      description: description || '',
      image,
    },
    (err, result) => {
      if (err) {
        console.error('CREATE FOOD ERROR:', err);
        return res.status(500).json({ message: 'DB error' });
      }

      res.status(201).json({
        message: 'Food created',
        id: result.insertId,
        image,
      });
    }
  );
};

export const updateFood = (req, res) => {
  const { name, price, description, oldImage } = req.body;

  //nếu có upload ảnh mới thì lấy filename, không thì giữ ảnh cũ
  const image = req.file
    ? `${API_URL}/uploads/${req.file.filename}`
    : oldImage || '';

  if (!name || price === undefined) {
    return res.status(400).json({
      message: 'Name and price are required',
    });
  }

  FoodModel.update(
    req.params.id,
    {
      name,
      price,
      description: description || '',
      image,
    },
    (err) => {
      if (err) {
        console.error('UPDATE FOOD ERROR:', err);
        return res.status(500).json({ message: 'DB error' });
      }

      res.json({ message: 'Food updated' });
    }
  );
};

export const deleteFood = (req, res) => {
  FoodModel.delete(req.params.id, (err) => {
    if (err) {
      console.error('DELETE FOOD ERROR:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    res.json({ message: 'Food deleted' });
  });
};
