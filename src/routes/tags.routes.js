const { Router } = require('express')

const TagsController = require('../controllers/TagsController')
const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const tagRoutes = Router()

const tagsController = new TagsController()

tagRoutes.get("/", ensureAuthenticated, tagsController.index)


module.exports = tagRoutes
