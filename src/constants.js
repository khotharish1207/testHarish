// Define App-wide constants here.
import __ from './utils/i18n';


export const MAX_SCHEDULES_PER_LOCATION = 4;
export const BASE_URL = 'https://3k78zcrgc0.execute-api.us-east-1.amazonaws.com/dev';

// Validation errors
export const EMAIL_REQ_VALIDATION = __('Email is required');
export const INVALID_EMAIL = __('Invalid Email');
export const PASSWORD_REQUIRED_VALIDATION = __('Password is required');
export const DISPLAY_NAME_REQUIRED = __('Full Name is required');
export const PASSWORD_LENGTH_VALIDATION = __('Password must be at least 6 characters');
export const SETUPCODE_VALIDATION = __('SetUp code must be 6 characters long');
export const PASSWORDS_DO_NOT_MATCH = __('Passwords do not match');
export const CONFIRM_PASS_REQ = __('Confirm Password is required');
export const TIMEZONE_REQ = __('Timezone is required');
export const INVALID_LOCATION = __('Invalid location');

// Location error constants
export const PERMISSION_DENIED = __('User denied the request for Geolocation.');
export const POSITION_UNAVAILABLE = __('Location information is unavailable.');
export const TIMEOUT = __('The request to get user location timed out.');
export const UNKNOWN_ERROR = __('An unknown error occurred.');
export const NO_RESULTS = __('No result found.');
export const UNABLE_TO_FETCH = __('Unable to fetch address. Kindly check your internet connection.');
