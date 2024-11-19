import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:e_commerce/Category/model/category_model.dart';
import 'package:e_commerce/config.dart';

const url = 'http://localhost:$webPort/';

final categoryProvider = FutureProvider<List<Category>>((ref) async {
  final response = await http.get(Uri.parse('${url}'));

  if (response.statusCode == 200) {
    List<dynamic> data = jsonDecode(response.body);
    return data.map((json) => Category.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load categories');
  }
});
