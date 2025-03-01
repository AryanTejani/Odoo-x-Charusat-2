import { categorySch } from "../models/category.model.js";
import { Item } from "../models/item.model.js";

export const getCategory = async (req, res) => {
    const { category } = req.params;

    try {
        // Debug Category Search
        const categoryData = await categorySch.findOne({ name: category});

        if (!categoryData) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Debug Item Search
        const items = await Item.find({ menuId: categoryData.menuId });

        res.json(items);
    } catch (error) {
        console.error("🔥 Server Error:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};
