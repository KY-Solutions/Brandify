const request = require('supertest');
const app = require('../../../app');
const Product = require('../models/product');
const User = require('../../users/models/user');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const tokenUtil = require('../../../utils/tokenUtil');

dotenv.config();

let mongoServer;
let adminToken;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    
    await mongoose.connect(process.env.MONGO_URL);

    const adminUser = await User.create({
        name: 'adminUser',
        email: 'admin@admin.com',
        password: 'admin123',
        role: 'admin',
    });

    await adminUser.save();

    adminToken = tokenUtil.generateToken(adminUser._id);
});

afterEach(async () => {
    await Product.deleteMany();
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

//? sample product
const productData = {
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 50,
    images: ['/uploads/test-image.jpg']
};

describe('Product API', () => {
    it('should create a product', async () => {
        const res = await request(app).post('/products/').set('Authorization', `Bearer ${adminToken}`)
            .send(productData);
        
         if (res.statusCode !== 201) {
        console.log(res.body);  // Log response body for debugging
    }
        expect(res.statusCode).toEqual(201);
    });
});
