import {useState} from 'react';
import {ActionFunctionArgs} from 'react-router';
import {redirect} from '@shopify/remix-oxygen';
import {
  Link,
  useNavigate,
  type MetaFunction,
  Form as RemixForm,
} from 'react-router';
import {RegisterAttributes} from '~/lib/input-config';
import {
  M_FORGOT_PASSWORD_LIMIT_EXCEED,
  M_INTERNAL_SERVER_ERROR,
} from '~/lib/message';

export const meta: MetaFunction = () => {
  return [{title: 'Create Account | Hydrogen Store'}];
};

export const action = async ({request, context}: ActionFunctionArgs) => {
  try {
    if (request.method !== 'POST') {
      return {
        error: 'Method not allowed',
      };
    }
    const errors: any = {};
    const {storefront, session, cart} = context;
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = form.has('password') ? String(form.get('password')) : null;
    const firstName = form.has('firstName')
      ? String(form.get('firstName'))
      : null;

    const lastName = form.has('lastName') ? String(form.get('lastName')) : null;

    // const newsletter = form.has('newsletter')
    //   ? String(form.get('newsletter'))
    //   : null;

    // VALIDATIONS
    if (email.length === 0)
      errors[`${RegisterAttributes.email.name}`] = 'Email is required';
    else if (!email.includes('@'))
      errors[`${RegisterAttributes.email.name}`] = 'Invalid email address';

    if (!password)
      errors[`${RegisterAttributes.password.name}`] = 'Password is required';
    else if (!/\d/.test(password))
      errors[`${RegisterAttributes.password.name}`] =
        'Password should contain number';
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (Object.keys(errors).length > 0) {
      return {errors};
    }
    // VALIDATIONS

    const {customerCreate, errors: registerErrors} = await storefront.mutate(
      M_REGISTER,
      {
        variables: {
          email,
          password,
          firstName,
          lastName,
          // acceptsMarketing: newsletter === 'on' ? true : false,
        },
      },
    );

    if (registerErrors?.length > 0) {
      if (registerErrors[0]?.message.includes('Limit exceeded'))
        return {error: M_FORGOT_PASSWORD_LIMIT_EXCEED};
      return {error: M_INTERNAL_SERVER_ERROR};
    }
    if (customerCreate?.customerUserErrors.length > 0) {
      return {
        error:
          customerCreate.customerUserErrors[0].message ||
          M_INTERNAL_SERVER_ERROR,
      };
    }
    const responseLogin = await storefront.mutate(M_LOGIN, {
      variables: {
        input: {
          email,
          password,
        },
      },
    });
    if (!responseLogin?.customerAccessTokenCreate) {
      return {error: M_INTERNAL_SERVER_ERROR, loginError: true};
    }
    context.session.set(
      'customerAccessToken',
      responseLogin?.customerAccessTokenCreate?.customerAccessToken,
    );

    // UPDATE CART IDENTITY ================================================================= //
    const cartId = await context.cart.getCartId();

    if (cartId) {
      const values = await context.storefront.mutate(
        CART_UPDATE_BUYER_IDENTITY,
        {
          variables: {
            cartId,
            token:
              responseLogin?.customerAccessTokenCreate?.customerAccessToken
                .accessToken,
          },
        },
      );
      // Update cart id in cookie
      const headers = context.cart.setCartId(
        values?.cartBuyerIdentityUpdate?.cart?.id,
      );
      // Update session
      headers.append('Set-Cookie', await context.session.commit());
    }
    // UPDATE CART IDENTITY ================================================================= //
    return redirect('/account/orders', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    return {error: 'Internal server error'};
  }
};

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  // INPUT
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // if (!formData.confirmPassword) {
    //   newErrors.confirmPassword = 'Please confirm your password';
    // } else if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = 'Passwords do not match';
    // }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement actual registration logic here

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to account page after successful registration
      navigate('/account');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({email: 'Registration failed. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: ''}));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="md:w-[500px] w-full p-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        {/* Registration Form */}
        <RemixForm
          method="POST"
          action="/account/register"
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-black mb-2"
              >
                First Name *
              </label>
              <input
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-none text-black placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                  ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="First name"
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-black mb-2"
              >
                Last Name *
              </label>
              <input
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-none text-black placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                  ${errors.lastName ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Last name"
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-2"
            >
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // value={formData.email}
              // onChange={(e) => handleInputChange('email', e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-none text-black placeholder-gray-500 pr-12
                  focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Create a password"
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
          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-1"
              />
              <span className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <Link
                  to="/terms-conditions"
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!acceptTerms}
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
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </RemixForm>

        {/* Login Link */}
        <div className="mt-6">
          <div className="text-center text-sm text-gray-600 mb-4">
            Already have an account?
          </div>
          <Link
            to="/account/login"
            className="w-full block text-center px-4 py-3 border border-gray-300 rounded-none text-black hover:bg-gray-50 transition-colors font-medium"
          >
            Sign In
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

const M_REGISTER = `#graphql
  mutation REGISTER($email: String!, $password: String!, $firstName: String, $lastName: String, $phone: String) {
    customerCreate(input: {email: $email, password: $password, firstName: $firstName, lastName:$lastName, phone:$phone}) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
        field
      }
    }
  }
  `;

const M_LOGIN = `#graphql
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
