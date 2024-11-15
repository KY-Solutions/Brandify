import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:e_commerce/Authentication/notifiers/sign_in_notifier.dart';

class HomeWidget extends ConsumerWidget {
  const HomeWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Access signInState to get the user information
    final signInState = ref.watch(signInNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            // Display a welcome message with the username if available
            Text(
              'Welcome, ${signInState.name ?? 'Guest'}',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      body: Center(
        child: Text(
          'Home Screen Content',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
