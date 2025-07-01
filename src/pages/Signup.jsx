import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, Phone, Users, MapPin } from "lucide-react";
import { registerUser } from "../lib/api";

// Validation schema với Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[A-Z]/, "First name must start with a capital letter")
    .trim(),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[A-Z]/, "Last name must start with a capital letter")
    .trim(),
  email: Yup.string()
    .email("Email format is invalid")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords do not match")
    .required("Please confirm your password"),
  location: Yup.string(),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
  role: Yup.string()
    .oneOf(["user", "employer"], "Invalid role")
});

const publicDomains = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "zoho.com", "protonmail.com", "mail.com", "gmx.com"
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm viết hoa chữ cái đầu
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Initial values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    agreeToTerms: false,
    role: "user"
  };

  // Handle submit
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);
    setMessage("");
    try {
      const { firstName, lastName, email, password, role, phone, location } = values;
      
      // Gửi dữ liệu trực tiếp theo format frontend
      const userData = {
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
        location
      };
      
      await registerUser(userData);
      setMessage("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setFieldError("general", err.response?.data?.message || "Đăng ký thất bại");
      setMessage("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Civic Connect</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">Create Account</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Fill in your information to create a new account
            </p>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Field name="firstName">
                          {({ field }) => (
                            <Input
                              {...field}
                              id="firstName"
                              type="text"
                              placeholder="First name (e.g., John)"
                              className="pl-10"
                              onChange={(e) => {
                                const capitalizedValue = capitalizeFirstLetter(e.target.value);
                                setFieldValue("firstName", capitalizedValue);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <ErrorMessage name="firstName" component="p" className="text-xs text-red-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Field name="lastName">
                          {({ field }) => (
                            <Input
                              {...field}
                              id="lastName"
                              type="text"
                              placeholder="Last name (e.g., Doe)"
                              className="pl-10"
                              onChange={(e) => {
                                const capitalizedValue = capitalizeFirstLetter(e.target.value);
                                setFieldValue("lastName", capitalizedValue);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <ErrorMessage name="lastName" component="p" className="text-xs text-red-600" />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field name="email">
                        {({ field, form }) => (
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={field.value}
                            onChange={e => {
                              form.setFieldValue('email', e.target.value);
                              // Kiểm tra domain email nếu role là employer
                              const role = form.values.role;
                              const email = e.target.value;
                              if (role === 'employer' && email.includes('@')) {
                                const domain = email.split('@')[1].toLowerCase();
                                if (publicDomains.includes(domain)) {
                                  setEmailError('Nhà tuyển dụng phải dùng email công ty, không dùng email công cộng.');
                                } else {
                                  setEmailError('');
                                }
                              } else {
                                setEmailError('');
                              }
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    {emailError && <div className="text-xs text-red-600">{emailError}</div>}
                    <ErrorMessage name="email" component="p" className="text-xs text-red-600" />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="phone" component="p" className="text-xs text-red-600" />
                  </div>

                  {/* Location Field */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="location"
                        name="location"
                        type="text"
                        placeholder="City, State"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-xs text-red-600" />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="p" className="text-xs text-red-600" />
                  </div>

                  {/* Role Field */}
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium text-gray-700">
                      I am a:
                    </label>
                    <Field name="role">
                      {({ field, form }) => (
                        <select
                          {...field}
                          id="role"
                          className="pl-10"
                          value={field.value}
                          onChange={e => {
                            form.setFieldValue('role', e.target.value);
                            // Kiểm tra lại email khi đổi role
                            const email = form.values.email;
                            const role = e.target.value;
                            if (role === 'employer' && email.includes('@')) {
                              const domain = email.split('@')[1].toLowerCase();
                              if (publicDomains.includes(domain)) {
                                setEmailError('Nhà tuyển dụng phải dùng email công ty, không dùng email công cộng.');
                              } else {
                                setEmailError('');
                              }
                            } else {
                              setEmailError('');
                            }
                          }}
                        >
                          <option value="user">Job Seeker</option>
                          <option value="employer">Employer</option>
                        </select>
                      )}
                    </Field>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-2">
                    <Field
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  <ErrorMessage name="agreeToTerms" component="p" className="text-xs text-red-600" />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !!emailError || loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* General Error */}
                  <ErrorMessage name="general" component="p" className="text-xs text-red-600 text-center" />

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Signup Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Login link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>

            {/* Message */}
            {message && <div className="mt-6 text-center text-sm text-green-600">{message}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}