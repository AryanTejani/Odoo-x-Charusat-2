import express from "express"
import { getAllitems, getSearchitems, getSingleitem } from "../controllers/item.controller.js"

const router = express.Router()

router.get("/all-items",getAllitems)
router.get("/items",getSearchitems)
router.get("/items/:id",getSingleitem)
export default router