// pages/category_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:e_commerce/Category/presentation/views/AddCategory_Screen.dart'; // Import the AddCategoryPage
import 'package:e_commerce/Category/model/category_model.dart'; // Adjust the import path to your Category model
import 'package:e_commerce/Category/providers/category_provider.dart'; // Adjust to your provider

class CategoryPage extends ConsumerWidget {
  const CategoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsyncValue = ref.watch(categoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Categories'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Navigate to the AddCategoryPage when the button is pressed
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AddCategoryPage(),
                ),
              );
            },
          ),
        ],
      ),
      body: categoriesAsyncValue.when(
        data: (categories) {
          if (categories.isEmpty) {
            return const Center(child: Text("No categories available"));
          }
          return ListView.builder(
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return ListTile(
                title: Text(category.name),
                subtitle: Text(category.description),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text("Error: $error")),
      ),
    );
  }
}
