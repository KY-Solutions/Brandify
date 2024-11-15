// screens/product_list.dart
import 'package:flutter/material.dart';
import 'package:e_commerce/Category/repositories/caregory_Repository.dart'; // Assume this service fetches products by category
import 'package:e_commerce/Category/repositories/product_Repository.dart'; // Assume this service fetches products by category

import 'package:e_commerce/Category/presentation/widgets/CategoryDropdown_Widget.dart';
import 'package:e_commerce/Category/model/product_model.dart';

class ProductListScreen extends StatefulWidget {
  @override
  _ProductListScreenState createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  List<Product> products = [];
  int? selectedCategoryId;

  void _fetchProducts(int? categoryId) async {
    var productService = ProductService();
    var fetchedProducts =
        await productService.fetchProducts(categoryId: categoryId);
    setState(() {
      products = fetchedProducts;
    });
  }

  @override
  void initState() {
    super.initState();
    _fetchProducts(null); // Load all products initially
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Products'),
      ),
      body: Column(
        children: [
          CategoryDropdown(
            onCategorySelected: (categoryId) {
              setState(() {
                selectedCategoryId = categoryId;
              });
              _fetchProducts(categoryId);
            },
          ),
          Expanded(
            child: ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(products[index].name),
                  subtitle: Text(products[index].description ?? ''),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
