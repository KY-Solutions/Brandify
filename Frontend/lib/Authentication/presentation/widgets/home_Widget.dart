import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:e_commerce/Authentication/notifiers/sign_in_notifier.dart';
import 'package:e_commerce/Category/presentation/views/CategoryList_Screen.dart'; // Import the category page

class HomeWidget extends ConsumerWidget {
  const HomeWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final signInState = ref.watch(signInNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Text(
              'Welcome, ${signInState.name ?? 'Guest'}',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Home Screen Content',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20), // Space between text and button
            ElevatedButton(
              onPressed: () {
                // Navigate to the CategoryPage when the button is pressed
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CategoryPage()),
                );
              },
              child: const Text('Go to Categories'),
            ),
          ],
        ),
      ),
    );
  }
}
