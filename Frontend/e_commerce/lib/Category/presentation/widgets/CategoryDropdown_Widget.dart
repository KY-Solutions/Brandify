// widgets/category_dropdown.dart
import 'package:flutter/material.dart';
import 'package:e_commerce/Category/repositories/caregory_Repository.dart'; // Assume this service fetches products by category

class CategoryDropdown extends StatefulWidget {
  final Function(int?) onCategorySelected;

  const CategoryDropdown({Key? key, required this.onCategorySelected})
      : super(key: key);

  @override
  _CategoryDropdownState createState() => _CategoryDropdownState();
}

class _CategoryDropdownState extends State<CategoryDropdown> {
  List<Category> categories = [];
  int? selectedCategoryId;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  void _loadCategories() async {
    try {
      var categoryService = CategoryService();
      var fetchedCategories = await categoryService.fetchCategories();
      setState(() {
        categories = fetchedCategories;
      });
    } catch (e) {
      print('Error loading categories: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButton<int>(
      hint: Text('Select Category'),
      value: selectedCategoryId,
      onChanged: (int? value) {
        setState(() {
          selectedCategoryId = value;
          widget.onCategorySelected(value);
        });
      },
      items: categories.map((Category category) {
        return DropdownMenuItem<int>(
          value: category.id,
          child: Text(category.name),
        );
      }).toList(),
    );
  }
}
