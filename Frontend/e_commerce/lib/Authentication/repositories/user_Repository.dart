import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:e_commerce/Authentication/model/register_model.dart';
import 'package:e_commerce/Authentication/model/signin_user_model.dart';

const url = 'http://localhost:5000/';
const registrationUrl = '${url}users/register';
const logInUrl = '${url}users/login';
const verificationUrl = '${url}users/check-verification';
const resendVerificationUrl = '${url}users/resend-verification';
const requestResetCodeUrl = '${url}users/request-password-reset';
const verifyResetCodeUrl = '${url}users/verify-reset-code';
const resetPasswordUrl = '${url}users/reset-password';
const verifyCodeUrl = '${url}users/verify-email';
const resendCodeUrl = '${url}users/resend-email-verification';

class UserRepository {
  final http.Client _client;

  UserRepository(this._client);

  // call the api from the backend using http post request
  // method for registration
  Future<RegistrationResponse> registerUser(RegUserModel user) async {
    final response = await _client.post(
      Uri.parse(registrationUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': user.name,
        'email': user.email,
        'password': user.password,
      }),
    );
    String value = response.body;
    print('response.body: $value');

    final body = jsonDecode(response.body);
    if (response.statusCode == 201) {
      return RegistrationResponse(success: true);
    } else if (response.statusCode == 400) {
      return RegistrationResponse(success: false, error: body['error']!);
    } else {
      return RegistrationResponse(
          success: false, error: body['error'] ?? 'Registration failed');
    }
  }

  // method for signing in
  Future<SignInResponse> signInUser(SignInUserModel signedUser) async {
    final response = await _client.post(
      Uri.parse(logInUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': signedUser.signInUserEmail,
        'password': signedUser.signInPass,
      }),
    );
    final body = jsonDecode(response.body);
    print(response.statusCode);
    print("test: " + body.toString());
    if (response.statusCode == 200) {
      return SignInResponse(success: true, name: body['name']);
    } else if (response.statusCode == 404) {
      return SignInResponse(success: false, error: body['error']);
    } else if (response.statusCode == 401) {
      return SignInResponse(success: false, error: body['error']);
    } else {
      return SignInResponse(
          success: false,
          error: body['error'] ?? 'Login failed... try again later');
    }
  }

  Future<bool> checkEmailVerification(String email) async {
    final response = await _client.post(
      Uri.parse(verificationUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
      }),
    );

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    return body['isVerified'];
  }

  Future<VerificationResponse> resendVerificationEmail(String email) async {
    final response = await _client.post(
      Uri.parse(resendVerificationUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
      }),
    );

    final body = jsonDecode(response.body);
    if (response.statusCode == 400) {
      return VerificationResponse(success: false, message: body['message']);
    }
    if (response.statusCode == 200) {
      return VerificationResponse(success: true, message: body['message']);
    }
    return VerificationResponse(
        success: false,
        message: 'An error has occured. Please try again later');
  }

  Future<VerificationResponse> requestPassResetCode(String email) async {
    final response = await _client.post(
      Uri.parse(requestResetCodeUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
      }),
    );
    final body = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return VerificationResponse(success: true, message: body['message']);
    } else {
      return VerificationResponse(success: false, message: body['message']);
    }
  }

  Future<VerificationResponse> verifyResetCode(
      String email, String resetCode) async {
    final response = await _client.post(
      Uri.parse(verifyResetCodeUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'resetCode': resetCode,
      }),
    );
    final body = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return VerificationResponse(success: true, message: body['message']);
    } else {
      return VerificationResponse(success: false, message: body['message']);
    }
  }

  Future<VerificationResponse> resetPassword(
      String email, String newPassword, String token) async {
    final response = await _client.post(
      Uri.parse(resetPasswordUrl + "/" + token),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'newPassword': newPassword,
      }),
    );
    final body = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return VerificationResponse(success: true, message: body['message']);
    } else {
      return VerificationResponse(success: false, message: body['message']);
    }
  }

  Future<VerificationResponse> verifyOTPCode(String email, String otp) async {
    print("r" + otp);
    final otpAsNumber = int.parse(otp);
    final response = await _client.post(
      Uri.parse(verifyCodeUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'OTP': otpAsNumber,
      }),
    );
    final body = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return VerificationResponse(success: true, message: body['message']);
    } else {
      print(body['message']);
      return VerificationResponse(success: false, message: body['message']);
    }
  }

  Future<VerificationResponse> resendOTPCode(String email) async {
    final response = await _client.post(
      Uri.parse(resendCodeUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
      }),
    );
    final body = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return VerificationResponse(success: true, message: body['message']);
    } else {
      return VerificationResponse(success: false, message: body['message']);
    }
  }
}

class VerificationResponse {
  final bool success;
  final String message;

  VerificationResponse({required this.success, required this.message});
}

class SignInResponse {
  final bool success;
  final String? error;
  final String? name;

  SignInResponse({required this.success, this.error, this.name});
}

class RegistrationResponse {
  final bool success;
  final String? error;

  RegistrationResponse({required this.success, this.error});
}
