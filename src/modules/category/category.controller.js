import slugify from 'slugify';
import {categoryModel} from '../../../models/category.model.js'


const createCategory = async (req,res) => {
    const {name} = req.body;
    let result = new categoryModel({name,slug:slugify(name)})
    await result.save()
    res.json({message:'success',result})
}


const getAllCategories = async (req,res) =>{
    let result = await categoryModel.find({})
    res.json({message:'success',result})
}

const getCategory = async (req,res) =>{
    const {id} = req.params;
    let result = await categoryModel.findById(id)
    res.json({message:'success',result})
}

const updateCategory = async(req,res) =>{
    const {id} = req.params;
    const {name} = req.body;
    let result = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)})
    res.json({message:'success',result})
}

const deleteCategory = async(req,res) =>{
    const { id } = req.params;
    let result = await categoryModel.findByIdAndDelete(id)
    res.json({message:'success',result})
}

export {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategory
}