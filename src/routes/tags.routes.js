const { Router } = require('express')

const TagsController = require('../controllers/TagsController')

const tagRoutes = Router()

const tagsController = new TagsController()

tagRoutes.get("/:user_id", tagsController.index)


module.exports = tagRoutes
