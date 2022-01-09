const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    attributes: ['id', 'category_name'],
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock']
    }
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock']
    }
  })
    .then(dbCategoryData => {
      if(!dbCategoryData) {
        res.status(404).json({ message: 'No category found with that id' })
        return
      }
      res.json(dbCategoryData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

router.post('/', (req, res) => {
  Category.create({
    id: req.body.id,
    category_name: req.body.category_name
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
});

// category update router
router.put('/:id', (req, res) => {
  Category.update(
    {
      category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(dbCategoryData => {
    if(!dbCategoryData) {
      res.status(404).json({ message: 'No category with that id found' })
      return
    }
    res.json(dbCategoryData)
  })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbCategoryData => {
    if(!dbCategoryData) {
      res.status(404).json({ message: 'No category with that id found' })
      return
    }
    res.json(dbCategoryData)
  })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

module.exports = router;
