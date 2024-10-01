// const API_SERVER = process.env.API_SERVER;
const API_SERVER = process.env.API_SERVER
export const API_ENDPOINTS = {
    USERNAME_CHECK: `${API_SERVER}/api/v1/user/check/username`,
    USER_SIGNUP: `${API_SERVER}/api/v1/user/register`,
    HOST_SIGNUP: `${API_SERVER}/api/v1/host/register`,
    USER_OTP_VERIFY: `${API_SERVER}/api/v1/user/register/otp/verify`,
    HOST_OTP_VERIFY: `${API_SERVER}/api/v1/host/register/otp/verify`,
    USER_OTP_RESEND: `${API_SERVER}/api/v1/user/register/otp/resend`,
    HOST_OTP_RESEND: `${API_SERVER}/api/v1/host/register/otp/resend`,
};