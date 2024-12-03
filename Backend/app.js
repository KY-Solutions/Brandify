//* import packages
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const UserRoutes = require('./features/users/routes/userRoutes');
const ProductRoutes = require('./features/products/routes/productRoutes');
const CategoryRoutes = require('./features/category/routes/categoryRoutes');
const ReviewRoutes = require('./features/reviews/routes/reviewRoutes');
const CartRoutes = require('./features/Cart/routes/cartRoutes');
const SubCategoryRoutes = require('./features/subcategory/routes/subCategoryRoutes');
const brand = require('./features/Brand/routes/brandRoutes');
const OrderRoutes = require('./features/order/routes/orderRoutes');
const DiscountRoutes = require('./features/discount/routes/discountRoutes');
const Notifications = require('./features/notifications/routes/notificationsRoutes');

const dotenv = require('dotenv');
const body_parser = require('body-parser');
const fs = require('fs');
const path = require('path');


dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(body_parser.json());

//? Serve images from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');

//? checks if the uploads folder exists if not it creates it automatically
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Uploads folder created!');
}

//* routes
app.use('/users', UserRoutes);
app.use('/products', ProductRoutes);
app.use('/Category', CategoryRoutes);
app.use('/reviews', ReviewRoutes);
app.use('/Cart', CartRoutes);
app.use('/subcategory', SubCategoryRoutes);
app.use('/brand', brand);
app.use('/order', OrderRoutes);
app.use('/discounts',DiscountRoutes);
app.use('/notifications',Notifications);

//* Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
});

//* Exporting app for use in index.js
module.exports = app;  
