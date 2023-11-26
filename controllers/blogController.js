const controller = {};
const models = require("../models");
var Sequelize = require('sequelize');
controller.showList = async (req,res) => {
    res.locals.Tag = await models.Tag.findAll({
        attributes: ['id', 'name'],
    });
    res.locals.Category = await models.Category.findAll({
        attributes: ['id', 'name'],
            include: [
                {model: models.Blog},
            ],
    });

    let cat = req.query.category;
    let tag = req.query.tag;
    let id = isNaN(req.query.id) ? 0: parseInt(req.query.id); //category id or tag id
    let searchword = req.query.sname;

    if(cat){
        res.locals.blogs = await models.Blog.findAll({
                attributes: ['id', 'title', 'imagePath', "summary", "createdAt", "categoryId"],
                include: [
                    {model: models.Comment},
                ],
                where: {categoryId: id},
        });
    } 
    else if(searchword)
    {
        res.locals.blogs = await models.Blog.findAll({
            attributes: ['id', 'title', 'imagePath', "summary", "createdAt"],
            include: [
                {model: models.Comment},
            ],
            where: {title: {[Sequelize.Op.substring]: searchword}},
        });
        
    }
    else if(tag){
        let tags = await models.Tag.findOne({
            where: {name: tag},
            include: [{model: models.Blog}],
        });
        res.locals.blogs = tags.Blogs;
    } 
    else{
        console.log(cat, tag);
        res.locals.blogs = await models.Blog.findAll({
            attributes: ['id', 'title', 'imagePath', "summary", "createdAt"],
            include: [
                {model: models.Comment},
                {model: models.User},
                {model: models.Tag},
            ],
        });
    }
    res.render("index");
};
// const controller = {};
// controller.show = (req,res) => {
//     let {products, categories} = require("../data");
//     let productList = req.query.category ? products.filter((item) => item.category == req.query.category) : products;
//     res.render("task3", {products: productList, categories});
// };
// module.exports = controller;

controller.showDetails = async (req,res) => {
    res.locals.Tag = await models.Tag.findAll({
        attributes: ['id', 'name'],
    });
    res.locals.Category = await models.Category.findAll({
        attributes: ['id', 'name'],
            include: [
                {model: models.Blog},
            ],
    });

    let id = isNaN(req.params.id) ? 0: parseInt(req.params.id);
    res.locals.blog = await models.Blog.findOne({
        attributes: ['id', 'title', 'description', 'createdAt'],
        where: {id: id},
        include: [
            {model: models.Comment},
            {model: models.User},
            {model: models.Tag},
            {model: models.Category},
       ],
    });
    res.render("details");
};
module.exports = controller;