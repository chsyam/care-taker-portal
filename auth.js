const bcrypt = require('bcrypt');

const {Caretaker} = require('./database');


const login_caretaker = async (req, res) => {
    const {email, password} = req.body;
    try {
        const caretaker = await Caretaker.findOne({ where: { email }});
        if (caretaker) {
            const isMatch = await bcrypt.compare(password, caretaker.password);
            if (isMatch) {
                req.session.user = caretaker.id;
                return res.redirect('profile');
            }
        }
        return res.render('login', {message: "Invalid Credentials"});
    }
    catch (err) {
        console.error(err);
        return res.render('login', {message: "An error occurred"});
    }
};

// TODO caretaker registration should be sent to an administrator for confirmation/permission
const register_caretaker = async (req, res) => {
    const {first_name, last_name, email, password, _} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Caretaker.create({
            email,
            password: hashedPassword,
            first_name,
            last_name
        });
        return res.redirect('login');
    } catch (err) {
        console.error(err);
        return res.render('register', {message: "An error occurred"});
    }
}

const logout_caretaker = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            return res.redirect('login');
        }
    });
}

module.exports = {
    login_caretaker,
    register_caretaker,
    logout_caretaker
}