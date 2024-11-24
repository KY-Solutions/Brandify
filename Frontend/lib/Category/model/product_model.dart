// models/product.dart
class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String categoryId; // Reference to the category

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.categoryId,
  });

  // Factory method to create a Product from JSON
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['_id'], // Adjust according to your API response
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      categoryId: json['categoryId'], // Reference to the category
    );
  }

  // Method to convert Product instance to JSON
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'description': description,
      'price': price,
      'categoryId': categoryId,
    };
  }
}
