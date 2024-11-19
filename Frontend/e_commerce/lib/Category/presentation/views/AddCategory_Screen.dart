// pages/add_category_page.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:e_commerce/config.dart';

const url = 'http://localhost:$webPort/';
final String apiUrl = '${url}';

class AddCategoryPage extends StatefulWidget {
  const AddCategoryPage({super.key});

  @override
  _AddCategoryPageState createState() => _AddCategoryPageState();
}

class _AddCategoryPageState extends State<AddCategoryPage> {
  final _formKey = GlobalKey<FormState>();
  String? _name;
  String? _description;

  Future<void> _addCategory() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      final response = await http.post(
        Uri.parse(apiUrl), // Replace with your API URL
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': _name,
          'description': _description,
        }),
      );
      if (response.statusCode == 201) {
        // Successfully created category
        Navigator.pop(context);
      } else {
        // Handle error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add category')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Category'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Category Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a category name';
                  }
                  return null;
                },
                onSaved: (value) {
                  _name = value;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Description'),
                onSaved: (value) {
                  _description = value;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _addCategory,
                child: const Text('Add Category'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
