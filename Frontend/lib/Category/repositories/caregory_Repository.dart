// services/category_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:e_commerce/config.dart';

const url = 'http://localhost:$webPort/';

class CategoryService {
  final String apiUrl = '${url}';

  Future<List<Category>> fetchCategories() async {
    final response = await http.get(Uri.parse(apiUrl));
    if (response.statusCode == 200) {
      List data = jsonDecode(response.body);
      return data.map((json) => Category.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load categories');
    }
  }
}

class Category {
  final int id;
  final String name;
  final String description;

  Category({required this.id, required this.name, this.description = ''});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      description: json['description'] ?? '',
    );
  }
}
