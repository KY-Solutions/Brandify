// lib/Category/data/models/category_model.dart
class Category {
  final String id;
  final String name;
  final String description;

  Category({
    required this.id,
    required this.name,
    required this.description,
  });

  // Factory constructor to create a Category instance from JSON
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['_id'] ??
          '', // Adjust key based on your backend's response format
      name: json['name'] ?? '',
      description: json['description'] ?? '',
    );
  }

  // Method to convert Category instance back to JSON (optional, for POST requests)
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'description': description,
    };
  }
}
