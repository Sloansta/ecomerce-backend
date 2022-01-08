const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    attributes: ['id', 'tag_name'],
    include: {
      model: Product,
      through: ProductTag,
      as: 'products',
      attributes: ['id', 'product_name']
    }
  }).then(dbTagData => res.json(dbTagData))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'tag_name'],
    include: {
      model: Product,
      through: ProductTag,
      as: 'products',
      attributes: ['id', 'product_name']
    }
  }).then(dbTagData => {
    if(!dbTagData) {
      res.status(404).json({ message: 'No tag with this id found' })
      return
    }
    res.json(dbTagData)
  })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
