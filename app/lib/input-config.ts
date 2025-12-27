/**
 * Fragment Attributes
 */
const emailFragmentAtt = {
  label: 'Email',
  name: 'email',
  placeholder: 'Enter email',
  type: 'email',
};

const passwordFragmentAtt = {
  label: 'Password',
  name: 'password',
  placeholder: 'Enter password',
  type: 'password',
};

const firstNameFragmentAtt = {
  label: 'First Name',
  name: 'firstName',
  placeholder: 'Enter first name',
  type: 'text',
};

const lastNameFragmentAtt = {
  label: 'Last Name',
  name: 'lastName',
  placeholder: 'Enter last name',
  type: 'text',
};

/**
 * id = <pagename>-<element>-<elementname>
 * example = "accont_login-input-email"
 */

export const UpdatePasswordAttributes = {
  password: {
    ...passwordFragmentAtt,
    id: 'account_profile-input-password',
    label: 'New Password',
    placeholder: 'Enter new password',
  },
  passwordConfirm: {
    ...passwordFragmentAtt,
    id: 'account_profile-input-passwordConfirm',
    name: 'passwordConfirm',
    label: 'Confirm New Password',
    placeholder: 'Confirm New Password',
  },
};

export const ResetPasswordAttributes = {
  password: {
    ...passwordFragmentAtt,
    id: 'account_reset-input-password',
    label: 'New Password',
    placeholder: 'Enter new password',
  },
  passwordConfirm: {
    ...passwordFragmentAtt,
    id: 'account_reset-input-passwordConfirm',
    name: 'passwordConfirm',
    label: 'Confirm New Password',
    placeholder: 'Confirm New Password',
  },
};

export const ProfileAttributes = {
  firstName: {
    id: 'account_profile-input-firstName',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
    type: 'text',
  },
  lastName: {
    id: 'account_profile-input-lastName',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter Last name',
    type: 'text',
  },
  phone: {
    id: 'account_profile-input-phone',
    name: 'phone',
    label: 'Mobile Number',
    placeholder: 'Enter Mobile Number',
    type: 'tel',
  },
};

export const LoginAttributes = {
  email: {
    ...emailFragmentAtt,
    id: 'account_login-input-email',
  },
  password: {
    ...passwordFragmentAtt,
    id: 'account_login-input-password',
  },
  button: {
    id: 'account_login-button',
  },
};

export const RegisterAttributes = {
  firstName: {
    id: 'account_register-input-firstname',
    ...firstNameFragmentAtt,
  },
  lastName: {
    id: 'account_register-input-lastname',
    ...lastNameFragmentAtt,
  },
  email: {
    id: 'account_register-input-email',
    ...emailFragmentAtt,
  },
  password: {
    id: 'accont_register-input-password',
    ...passwordFragmentAtt,
  },
  checkbox: {
    id: 'account_register-checkbox-newsletter',
    name: 'newsletter',
  },
  button: {
    id: 'account_register-button',
  },
};

export const ForgotPasswordAttributes = {
  email: {
    ...emailFragmentAtt,
    id: 'account_login-input-forgotpassword',
    name: 'forgotEmail',
  },
};

export const CheckoutLoginAttributes = {
  email: {
    ...emailFragmentAtt,
    id: 'checkout_login-input-email',
  },
  password: {
    ...passwordFragmentAtt,
    id: 'checkout_login-input-password',
  },
};

export const CheckoutRegisterAttributes = {
  firstName: {
    id: 'checkout_register-input-firstname',
    ...firstNameFragmentAtt,
  },
  lastName: {
    id: 'checkout_register-input-lastname',
    ...lastNameFragmentAtt,
  },
  email: {
    id: 'checkout_register-input-email',
    ...emailFragmentAtt,
  },
  password: {
    id: 'checkout_register-input-password',
    ...passwordFragmentAtt,
  },
};

export const M_FORGOT_PASSWORD_INVALID_EMAIL = 'Email not found.';
export const M_FORGOT_PASSWORD_SUCCESS = (email: string) => {
  return `Reset link has been sent to ${email}.`;
};
export const M_FORGOT_PASSWORD_LIMIT_EXCEED =
  'Too many request. Try again later.';
export const M_LOGIN_INVALID_EMAIL_OR_PASSWORD = 'Invalid email / password.';
export const M_INTERNAL_SERVER_ERROR = 'Something is wrong, please try again.';
export const M_NOT_MATCH_PASSWORD = 'Password does not match.';

export const BRAND_NAME = 'Anticommerce';

export const COOKIE_NAME = {
  cart: 'rem_cart',
};
