import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:e_commerce/Authentication/presentation/widgets/home_Widget.dart';

/*
every number for the ui should be used as a final variable and in a seperate file
so when we modify the ui we modify from these numbers directly

*/

class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
      ),
      body: HomeWidget(),
    );
  }
}
