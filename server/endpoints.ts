const API_SERVER = process.env.API_SERVER
export const API_ENDPOINTS = {
    USERNAME_CHECK: `${API_SERVER}/user/check/username`,
    USER_SIGNUP: `${API_SERVER}/user/register`,
    HOST_SIGNUP: `${API_SERVER}/host/register`,
    USER_OTP_VERIFY: `${API_SERVER}/user/register/otp/verify`,
    HOST_OTP_VERIFY: `${API_SERVER}/host/register/otp/verify`,
    USER_OTP_RESEND: `${API_SERVER}/user/register/otp/resend`,
    HOST_OTP_RESEND: `${API_SERVER}/host/register/otp/resend`,
};