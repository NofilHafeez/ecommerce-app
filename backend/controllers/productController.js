const productModel = require('../models/Product');
const reviewModel = require('../models/Review')

// Creating Products
module.exports.createProducts = async (req, res) => {
   try {
        let { name, description, price, category, stock } = req.body;

        if (!name || !description || !price || !category || !stock) 
            return res.status(400).send('All fields are required');
        
        let existedProduct = await productModel.findOne({name})
        if (existedProduct) return res.status(400).send('Product is already creadted with this name');

        let admin = req.user; // Assuming `authenticateUser` attaches the user to the request
        if (!admin.isAdmin) {
          return res.status(403).json({ error: 'Only admins can create products' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
          }
          
        let product = await productModel.create(
            {
                name,
                description,
                price,
                image: req.file.path,
                category,
                stock,
                createdBy: admin.name  
            }
        );     

        await product.save();

        
        res.status(201).json({ success: ["Product Creates Successful!"] });

    } catch (err) {
         res.status(500).json({ flash: ["Server error, please try again later"] });
    }
};

// Update Products
module.exports.updateProducts = async (req, res) => {
    try {
         let { name, description, price, category, stock } = req.body;
 
         let existedProduct = await productModel.findOne({name})
 
         if (existedProduct) return res.status(400).send('Product is already created with this name');
 
         if (!name || !description || !price || !category || !stock) 
             return res.status(400).send('All fields are required');
 
         let updatedProduct = await productModel.findOneAndUpdate({_id: req.params.id},
             {
                 name: name,
                 description: description,
                 price: price,
             // image,
                 category: category,
                 stock: stock,  
 
             }
         );     
         
        res.status(201).json({ success: ["Product Updates Successful!"] });
 
     } catch (err) {
        res.status(500).json({ flash: ["Server error, please try again later"] });

     }
 };

 // Delete Products
module.exports.deleteProducts = async (req, res) => {
    try {
         let deletedProduct = await productModel.findOneAndDelete({_id: req.params.id});     
         
        res.status(201).json({ success: ["Product Updates Successful!"] });

 
     } catch (err) {
        res.status(500).json({ flash: ["Server error, please try again later"] });

     }
 };


module.exports.createReview = async (req, res) => {
    try {
         let {rating, comment} = req.body;

         let loggedInUser = req.user;
         let productId = req.params.id;
         
        if (!loggedInUser) return res.status(400).send('User Not Found'); 
         
        let product = await productModel.findById(productId);

        if (!product) return res.status(400).send('product not found');

        if (!rating || !comment) return res.status(400).send('Please fill everything');

        let userReview = await reviewModel.create({
            product: product._id,
            user: loggedInUser._id,
            comment,
            rating
        });

        product.reviews.push({
            user: loggedInUser._id,
            rating,
            comment,
        });
        await product.save();
        
         res.status(201).json({
             message: 'review created successfully',
             userReview
         });
 
     } catch (err) {
         res.status(500).send(err.message);
     }
 };

module.exports.editReview = async (req, res) => {
    try {
        let { rating, comment } = req.body;
        let loggedInUser = req.user;
        let productId = req.params.id;

        if (!loggedInUser) return res.status(400).send("User Not Found");

        // Find the product
        let product = await productModel.findById(productId);
        if (!product) return res.status(400).send("Product not found");

        // Validate the rating and comment
        if (!rating || !comment) return res.status(400).send("Please fill everything");

        // Ensure rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).send("Rating must be between 1 and 5");
        }

        // Find the existing review by the user
        let userReview = await reviewModel.findOne({
            product: productId,
            user: loggedInUser._id,
        });

        if (!userReview) {
            return res.status(400).send("Review not found for this product");
        }

        // Update the review
        userReview.rating = rating;
        userReview.comment = comment;

        // Save the updated review
        await userReview.save();

        // Optionally, if you want to update the review directly in the product (this step is not mandatory)
        // Find the index of the existing review and update it in the product's reviews array
        const reviewIndex = product.reviews.findIndex(
            (review) => review.user.toString() === loggedInUser._id.toString()
        );

        if (reviewIndex !== -1) {
            product.reviews[reviewIndex].rating = rating;
            product.reviews[reviewIndex].comment = comment;
            await product.save();
        }

        res.status(200).json({
            message: "Review edited successfully",
            userReview,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
         let review = await reviewModel.findOneAndDelete({_id: req.params.id, user: req.user});     
         
         res.status(201).json({
             message: 'review Deleted successfully',
         });
 
     } catch (err) {
         res.status(500).send(err.message);
     }
 };

