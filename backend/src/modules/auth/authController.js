import authService from './authService.js';

export const registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = await authService.register(username, email, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }
};