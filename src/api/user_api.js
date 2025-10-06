import axiosClient from '../api/axiosClient';

export const getSlider = () => axiosClient.get('/sliders');
export const getCommunitiesMemberListing = () => axiosClient.get('/communities');
export const getMembersListing = () => axiosClient.get('/members');
export const getVillagesListing = () => axiosClient.get('/villages');
export const getNewsListing = () => axiosClient.get('/news');
export const getAboutUsDataListing = () => axiosClient.get('/about');
export const getBusinesListing = () => axiosClient.get('/businesses');
export const getFAQsListing = () => axiosClient.get('/faqs ');
export const postOrderCreate = (payload) => axiosClient.post('/create-order', payload);
export const registerUser = (payload) => axiosClient.post('/createMember', payload);
export const verifyPayment = (payload) => axiosClient.post('/verify-payment', payload);
export const loginMember = (payload) => axiosClient.post('/loginMember', payload);
export const checkExitMember = (payload) => axiosClient.post('/checkExitMember', payload);
export const resetPassword = (payload) => axiosClient.post('/reset-password', payload);
export const verifyOtp = (payload) => axiosClient.post('/verifyOtp', payload);
export const changePassword = (payload) => axiosClient.post('/change-password', payload);