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
  // post creates a new tag with the specified name
  Tag.create(req.body)
    .then(tag => {
      if(req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id
          }
        })
        return ProductTag.bulkCreate(productTagIdArr)
      }
      
      // if no tag tags, just respond
      res.status(200).json(tag)
    })
    .then(productTagIds => res.status(200).json(productTagIds))
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, 
    {
      where: {
        id: req.params.id
      }
    },
    {
      tag_name: req.body.tag_name
    }
    )
   .then(dbTagData => {
     if(!dbTagData) {
       res.status(404).json({ message: 'No product with that id found' })
       return
     }
     res.json(dbTagData)
   })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

module.exports = router;
