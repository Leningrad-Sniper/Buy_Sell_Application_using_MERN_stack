export const validateEmail = (email) => {
    // Accept any email that ends with .iiit.ac.in
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.iiit\.ac\.in$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
}; 