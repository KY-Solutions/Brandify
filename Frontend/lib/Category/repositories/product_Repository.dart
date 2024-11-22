// services/product_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:e_commerce/Category/model/product_model.dart';

import 'package:e_commerce/config.dart';

const url = 'http://localhost:$webPort/';

class ProductService {
  final String apiUrl = '${url}';

  Future<List<Product>> fetchProducts({int? categoryId}) async {
    final response = await http.get(
      Uri.parse(
          '$apiUrl${categoryId != null ? '?categoryId=$categoryId' : ''}'),
    );

    if (response.statusCode == 200) {
      List data = jsonDecode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }
}
