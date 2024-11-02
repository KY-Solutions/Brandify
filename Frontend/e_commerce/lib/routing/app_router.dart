import 'package:e_commerce/Authentication/presentation/views/Verify_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:e_commerce/providers/route_provider.dart';
import 'package:e_commerce/presentation/views/logIn_screen.dart';
import 'package:e_commerce/Authentication/presentation/views/register_screen.dart';

import 'package:e_commerce/Authentication/presentation/views/password_change_screen.dart';
import 'package:e_commerce/Authentication/presentation/views/password_reset_screen.dart';

import 'package:e_commerce/Authentication/presentation/views/loading_screen.dart';
import 'package:e_commerce/Authentication/presentation/views/home_screen.dart';

// configures Gorouter to handle routing based on the current route state managed by the routenotifier class
final goRouterProvider = Provider<GoRouter>((ref) {
  final route = ref.watch(routeNotifierProvider);

  return GoRouter(
    initialLocation: '/logIn',
    routes: [
      GoRoute(
        path: '/reset-password/:token',
        builder: (context, state) {
          final token = state.pathParameters['token']!;
          return PasswordChangeScreen(token: token);
        },
      ),
      GoRoute(
        path: '/request-reset-password',
        builder: (context, state) => PasswordResetScreen(),
      ),
      GoRoute(
        path: '/logIn',
        builder: (context, state) => logInScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => RegisterScreen(),
      ),
      GoRoute(
        path: '/loading',
        builder: (context, state) => LoadingScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => HomeScreen(),
      ),
      GoRoute(
        path: '/verify-code',
        builder: (context, state) => VerifyScreen(),
      ),
    ],
    debugLogDiagnostics: true,
    redirect: (context, state) {
      // Check if the password was changed; if so, redirect to login
      if (ref.read(routeNotifierProvider.notifier).passwordChanged) {
        // Reset the flag so that it doesn't keep redirecting to login
        ref.read(routeNotifierProvider.notifier).passwordChanged = false;
        return '/logIn';
      }
      // Check if the current path starts with '/reset-password' to avoid redirection
      if (state.uri.path.startsWith('/reset-password')) {
        return null; // Don't redirect, allow access to reset-password route
      }
      switch (route) {
        case AppRoute.passwordChange:
          final token =
              state.pathParameters['token'] ?? ''; // default if no token
          return '/reset-password/$token';
        case AppRoute.passwordReset:
          return '/request-reset-password';
        case AppRoute.register:
          return '/register';
        case AppRoute.logIn:
          return '/logIn';
        case AppRoute.home:
          return '/home';
        case AppRoute.loading:
          return '/loading';
        case AppRoute.VerifyCode:
          return '/verify-code';
        default:
          return '/logIn';
      }
    },
  );
});
