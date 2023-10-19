const { responseReturn } = require("../utiles/response");
const formidable = require('formidable');
const validator = require('validator');
const userModel = require('../models/userModel');
const profileModel = require('../models/profileModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrpty = require('bcrypt');
const { createToken } = require("../utiles/tokenCreate");
const { profleImgMoveFunc, profileDeleteFunction } = require("../utiles/imageFile");
const cloudinary = require('cloudinary').v2



const transporter = nodemailer.createTransport({
    host: 'smtp',
    port: 3002,
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
        user: 'biswassanto0011@gmail.com',
        pass: 'muvavoatjqkovrbe'
    }
});



class authController {


    // user register
    register = async (req, res) => {
        const form = formidable()
        form.parse(req, async (err, fields, fiels) => {
            if (err) {
                responseReturn(res, 404, { error: "Something error" })
            } else {
                const { name, email, password } = fields;
                const errorData = {}

                if (!name) {
                    errorData.name = "Please provide your name"
                }
                if (!email) {
                    errorData.email = "Please provide your email"
                }
                if (email && !validator.isEmail(email)) {
                    errorData.email = "Please provide your valid email"
                }
                if (!password) {
                    errorData.password = "Please provide your password"
                }
                if (Object.keys(fiels).length === 0) {
                    errorData.image = 'Please provide your image'
                }

                if (Object.keys(errorData).length === 0) {
                    try {
                        const getuser = await userModel.findOne({ email });
                        if (getuser) {
                            responseReturn(res, 404, { error: "Email alreay register" })
                        } else {

                            // generate otp
                            const otpLength = 6;
                            const digits = '0123456789';
                            let otp = '';

                            for (let i = 0; i < otpLength; i++) {
                                const randomIndex = Math.floor(Math.random() * digits.length);
                                otp += digits.charAt(randomIndex);
                            }

                            // console.log("otp", otp)

                            let mailOptions = {
                                from: 'biswassanto0011@gmail.com',
                                to: email,
                                subject: ' Sending email mern blog',
                                html: `<div style={padding:"10px"}>
                                    <h3>Your otp code ${otp}</h3>
                                </div>`
                            };

                            transporter.sendMail(mailOptions, async (error, info) => {
                                if (error) {
                                    responseReturn(res, 404, { error: "Somethings else please try again" })
                                } else {

                                    const verifyEmailToken = await createToken({
                                        email,
                                        name,
                                        password: await bcrpty.hash(password, 10),
                                        imageInfo: fiels,
                                        otpCode: otp
                                    })

                                    res.cookie('emailVerifyToken', verifyEmailToken, {
                                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                    })
                                    responseReturn(res, 201, { message: 'Check your email and submit otp', verifyEmailToken })
                                }
                            });

                        }

                    } catch (error) {
                        responseReturn(res, 500, { error: "Internal server error" })
                    }
                } else {
                    responseReturn(res, 400, { error: errorData })
                }

            }
        })
    }


    // verify_email
    verify_email = async (req, res) => {
        const { otp } = req.body;
        const { emailVerifyToken } = req.cookies;

        if (!otp) {
            responseReturn(res, 404, { error: "Please provide your otp" })
        } else {
            const { email, name, password, imageInfo, otpCode } = await jwt.verify(emailVerifyToken, process.env.SECRET);

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                if (parseInt(otp) !== parseInt(otpCode)) {
                    responseReturn(res, 404, { error: "Please provide valid otp" })

                } else {
                    const result = await cloudinary.uploader.upload(imageInfo.image.filepath, { folder: 'pos_app_img' });

                    if (result) {
                        const createUser = await userModel.create({
                            userName: name,
                            email: email,
                            loginMethod: "manually",
                            password: password,
                            image: result.url
                        });

                        const token = await createToken({
                            id: createUser._id,
                            email: createUser.email,
                            name: createUser.userName,
                            image: createUser.image,
                            role: createUser.role,
                            loginMethod: createUser.loginMethod,
                            accessStatus: createUser.accessStatus,
                            createdAt: createUser.createdAt
                        });

                        res.clearCookie("emailVerifyToken")
                        res.cookie('pos_token', token, {
                            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        })
                        responseReturn(res, 201, { message: 'Your register successfull', token })

                    } else {
                        responseReturn(res, 404, { error: "Image upload failed" })
                    }

                }

            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        }

    }



    // user_login
    user_login = async (req, res) => {
        const { email, password } = req.body;

        const error = {

        }

        if (email && !validator.isEmail(email)) {
            error.email = "Please provide your valid email"
        }
        if (!email) {
            error.email = "Please provide your email";
        }
        if (!password) {
            error.password = "Please provide your password"
        }

        if (Object.keys(error).length > 0) {
            return res.status(400).json({ error: error.message })
        } else {
            try {
                const getUser = await userModel.findOne({ email }).select("+password");

                if (getUser) {
                    const matchPassword = await bcrpty.compare(password, getUser.password);

                    if (matchPassword) {

                        const token = await createToken({
                            id: getUser._id,
                            email: getUser.email,
                            name: getUser.userName,
                            image: getUser.image,
                            role: getUser.role,
                            loginMethod: getUser.loginMethod,
                            accessStatus: getUser.accessStatus,
                            createdAt: getUser.createdAt
                        });

                        res.cookie('pos_token', token, {
                            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        })
                        responseReturn(res, 201, { message: 'Your Login successfull', token })

                    } else {
                        responseReturn(res, 400, { error: "Password does not match" })
                    }

                } else {
                    responseReturn(res, 400, { error: "Email does not exists" })
                }

            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        }

    }



    // add_customer_profile
    add_customer_profile = async (req, res) => {
        const { adminId } = req;
        const profileImage = req.file.filename;
        const { shopName, address, mobile } = req.body;

        try {

            if (!shopName || !address || !mobile || !profileImage || !adminId) {
                responseReturn(res, 200, { error: "All field is rquired !" })
            } else {

                const profile = await profileModel.create({
                    adminId,
                    shopName,
                    address,
                    mobile,
                    profileImage
                });

                if (profile) {
                    await userModel.findByIdAndUpdate(adminId, {
                        profileStatus: true
                    });

                    profleImgMoveFunc();
                }

                responseReturn(res, 200, { message: "Create your profile" })

            }

        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }



    // get_customer_profile
    get_customer_profile = async (req, res) => {
        const { adminId } = req;
        try {
            const profile = await profileModel.findOne({ adminId });
            responseReturn(res, 200, { profile })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }



    // update_customer_profile
    update_customer_profile = async (req, res) => {
        const { adminId } = req;
        const { shopName, address, mobile, oldImage } = req.body;
        const profileImage = req.file ? req.file.filename : oldImage;

        try {

            await profileModel.findOneAndUpdate({ adminId: adminId }, {
                shopName,
                address,
                mobile,
                profileImage
            }, { new: true })

            profleImgMoveFunc();
            if (req.file) {
                profileDeleteFunction(oldImage)
            }

            responseReturn(res, 200, { message: "Profile update successfully" });

        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }

    }

}


module.exports = new authController();