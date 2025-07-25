import {useState} from 'react';
import {
  Link,
  useNavigate,
  ActionFunctionArgs,
  type MetaFunction,
  useActionData,
  Form as RemixForm,
  useNavigation,
} from 'react-router';

export const meta: MetaFunction = () => {
  return [{title: 'Login | Hydrogen Store'}];
};

export const action = async (args: ActionFunctionArgs) => {
  try {
    const {context, request} = args;
    const form = await request.formData();
    const _action = String(form.has('_action') ? form.get('_action') : '');
    const errors: any = {};
    if (_action === 'login') {
      const email = String(form.has('email') ? form.get('email') : '');
      const password = String(form.has('password') ? form.get('password') : '');

      // VALIDATION
      if (email.length === 0) {
        errors.email = 'Email is required';
      } else {
        if (!email.includes('@')) {
          errors.email = 'Invalid email address';
        }
      }
      if (!password) errors.password = 'Password is required';
      else if (password.length < 8)
        errors.password = 'Password should be at least 8 characters';
      else if (!/\d/.test(password))
        errors.password = 'Password should contain number';
      if (Object.keys(errors).length > 0) {
        return {errors};
      }
    } else if (_action === 'forgot_password') {
      return {message: 'hello'};
    }
    return {message: 'HELLO'};
  } catch (error) {
    return {error};
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const navigate = useNavigate();
  const {state} = useNavigation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="md:w-[500px] w-full p-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Sign In</h1>
          <p className="text-gray-600">Welcome back to your account</p>
        </div>

        {/* Login Form */}
        <RemixForm method="POST" action="/account/login" className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-2"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                  w-full px-4 py-3 border rounded-none text-black placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}
                `}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-2"
            >
              Password *
            </label>
            <div className="relative">
              <input
                name="password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                    w-full px-4 py-3 border rounded-none text-black placeholder-gray-500 pr-12
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                  `}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              {/* <input
                type="checkbox"
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span> */}
            </label>
            <Link
              to="/account/recover"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            name="_action"
            value="login"
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-none transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </RemixForm>

        {/* Divider */}
        {/* <div className="my-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </div> */}

        {/* Social Login Buttons */}
        {/* <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
            Continue with Twitter
          </button>
        </div> */}

        {/* Register Button */}
        <div className="mt-6">
          <div className="text-center text-sm text-gray-600 mb-4">
            Don&apos;t have an account?
          </div>
          <Link
            to="/account/register"
            className="w-full block text-center px-4 py-3 border border-gray-300 rounded-none text-black hover:bg-gray-50 transition-colors font-medium"
          >
            Create Account
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const CART_UPDATE_BUYER_IDENTITY = `#graphql
mutation CARTUPDATE($token: String!, $cartId: ID!) {
  cartBuyerIdentityUpdate(
    cartId: $cartId,
    buyerIdentity: {
      customerAccessToken: $token,
    }
  ) {
    cart {
      id
      checkoutUrl
    }
  }
}
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const M_LOGIN = `
mutation CUSTOMER_LOGIN($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      message
      code
      field
    }
  }
}
`;
