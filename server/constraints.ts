const API_SERVER = process.env.API_SERVER || 'http://localhost:3000';

export const API_ENDPOINTS = {
    USERNAME_CHECK: `${API_SERVER}/api/v1/user/check/username`,
    USER_SIGNUP: `${API_SERVER}/api/v1/user/signup/user`,
    HOST_SIGNUP: `${API_SERVER}/api/v1/user/signup/host`
};