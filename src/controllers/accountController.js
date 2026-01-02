require("dotenv").config();
const db = require('../utils/database_temp');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const bycrypt = require('bcryptjs');
const config = require('../utils/config');
const mail = require('../utils/mailing');
const {downloadingTemplate} = require("../utils/mail-templates/downloadingLink");
const jwt = require("jsonwebtoken");

exports.sendAlertMailToAllUsers = async (msg, userList) => {
    return new Promise((resolve, reject) => {
        try {
            const carbonCopyMails = [], loopLen = userList.length;
            for(let i=0; i<loopLen; i++) carbonCopyMails.push(userList[i]["Email"].toLowerCase());
        
            mail.SendEmail(
                userList[0]["Email"], //"jk38104@gmail.com",
                "NEW DATA UPDATE FROM CYPHER!", msg,
                carbonCopyMails.shift().toLocaleString() //""
            );
            return resolve(true);
        } catch (error) {
            return reject(false);
        }
    });
}

exports.sendDownloadingLinkMail = async(req, res) => {
    try {
        const {downloadingLinkIDs, userEmails} = req.body;
        const sqlQuery = `select "filePath", "workspacename" from "userdownloadtransaction" where "Id" in (${downloadingLinkIDs.toString()}) and "status"='Completed'`;

        const result = await db.query(sqlQuery);
        
        if(result.rows.length > 0) {
            const htmlBody = downloadingTemplate(result.rows);
            const emailRes = await mail.sendDownloadingLinkMail("Your Requested File Is Ready for Download", htmlBody, userEmails.length>0 ? userEmails: "");
            console.log(emailRes);
            
            return res.status(200).json(success("OK", "Links have been sent successfully", res.statusCode));
        }
    } catch (err) { return res.status(500).json(error(err, res.statusCode)); }
}

exports.createUser = async (req, res) => {
    ////db.connect();
    const { FullName, CompanyName, MobileNumber, Email, Password, country, ParentUserId, RoleId } = req.body;
    const errors = validationResult(req);
    const date = new Date();
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_email, [Email]);
    if (user.rows.length > 0) {
        return res.status(422).json(error("Email already registered !", res.statusCode));
    } else {
        bycrypt.hash(Password, 12).then(hashPassword => {
            db.query(query.add_user, [FullName, CompanyName, MobileNumber, Email, hashPassword, country, ParentUserId, '', '', '', '', RoleId], async (err, result) => {
                if (!err) {
                    if (ParentUserId == null || ParentUserId == '' || ParentUserId == undefined) {
                        const planDetails = await db.query(query.get_plan_by_name, [config.DefaultPlan]);
                        if (planDetails.rows.length > 0) {
                            db.query(query.add_Plan_Trasaction, [result.rows[0].UserId, planDetails.rows[0].PlanId, planDetails.rows[0].Downloads, planDetails.rows[0].Searches, date.toISOString()], (err, result) => {
                                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                            });
                        }
                    } else {
                        mail.SendEmail(Email, config.userRegisterationmailSubject, config.accountcreationmailBody);
                        return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                    }
                }
                else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
            })
        });
    }
    // //db.end;
}

exports.postLogin = async (req, res) => {
    // //db.connect();
    const { Email, Password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }
    const Parentuser = await db.query(query.get_user_email, [Email]);
    const user = await db.query(Parentuser?.rows[0]?.ParentUserId != null ? query.get_user_by_parentuser : query.get_user_by_email, [Email]);
    if (user?.rows.length > 0) {
        bycrypt.compare(Password, user.rows[0].Password)
            .then(doMatch => {
                if (doMatch) {
                    // Create token
                    const token = jwt.sign(
                        { user_id: user.rows[0].UserId, Email },
                        config.TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );

                    user.rows[0].token = token;
                    return res.status(200).json(success("Login Successfully !", user.rows[0], res.statusCode));
                } else {
                    return res.status(200).json(error("Wrong password !", res.statusCode));
                }
            })
            .catch(err => {
                return res.status(500).json(error(err, res.statusCode));
            })
    } else {
        return res.status(200).json(error("Email not found !", res.statusCode));
    }
    ////db.end;
}
exports.changePassword = async (req, res) => {
    // //db.connect();
    const { Email, CurrentPassword, NewPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_by_email_forchangepassword, [Email]);
    if (user?.rows.length > 0) {
        bycrypt.compare(CurrentPassword, user.rows[0].Password)
            .then(doMatch => {
                if (doMatch) {
                    bycrypt.hash(NewPassword, 12).then(hashPassword => {
                        db.query(query.update_password, [hashPassword, user.rows[0].UserId], (err, results) => {
                            if (!err) {
                                return res.status(200).json(success("Password changed Successfully !", res.statusCode));
                            } else {
                                return res.status(500).json(error("Internal server Error", res.statusCode));
                            }
                        })
                    })

                } else {
                    return res.status(200).json(error("Incorrect Current password !", res.statusCode));
                }
            })
            .catch(err => {
                return res.status(500).json(error(err, res.statusCode));
            })
    } else {
        return res.status(200).json(error("Email not found !", res.statusCode));
    }
    ////db.end;
}

exports.resetPassword = async (req, res) => {
    try {
        const { Email } = req.body;

        const user = await db.query(query.get_user_by_email_forchangepassword, [Email]);
        const Password = 'Cypher@123';
        if (user?.rows.length > 0) {
            bycrypt.hash(Password, 12).then(hashPassword => {
                db.query(query.reset_password, [hashPassword, Email], (err, results) => {
                    if (!err) {
                        return res.status(200).json(success("Ok", results.rows, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            });
        } else {
            return res.status(200).json(error("Email not found !", res.statusCode));
        }
    } catch (ex) {
        return res.status(500).json(error(ex, res.statusCode));
    }
}
exports.getAccountDetails = async (req, res) => {
    try {
        let { UserId } = req.query;
        let id;
        const user = await db.query(query.get_cypher_userby_id, [UserId]);
        if (user.rows[0].ParentUserId != null) {
            id = parseInt(user.rows[0].ParentUserId);
        } else {
            id = UserId;
        }
        db.query(query.get_Searches_By_UserId, [id], (err, results) => {
            if (!err) {
                results.rows[0].UserId = UserId;
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", err.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getuserlistbyParentId = async (req, res) => {
    try {
        const { ParentUserId } = req.query;
        db.query(query.get_user_by_ParentId, [ParentUserId], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.enabledisableuser = async (req, res) => {
    const { enable, UserId } = req.body;
    try {
        db.query(query.enable_disable_user, [enable, UserId], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addUserByAdmin = async (req, res) => {
    const { FullName, CompanyName, MobileNumber, Email, Password, country, ParentUserId, Designation = null, Location = null, GST = null, IEC = null, RoleId
        , PlanId, Downloads, Searches, StartDate, EndDate, Validity, DataAccess, CountryAccess, CommodityAccess, UpdateCompanyNamePoint,
        TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User,
        AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, Share } = req.body;

    const errors = validationResult(req);
    const date = new Date();
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_by_email, [Email]);
    if (user.rows.length > 0) {
        return res.status(422).json(error("Email already registered !", res.statusCode));
    } else {
        bycrypt.hash(Password, 12).then(hashPassword => {
            db.query(query.add_user, [FullName, CompanyName, MobileNumber, Email, hashPassword, country, ParentUserId, Designation, Location, GST, IEC, RoleId], async (err, result) => {
                if (!err) {
                    db.query(query.add_Plan_Trasaction_by_admin, [result.rows[0].UserId, PlanId, Downloads, Searches, StartDate, EndDate,
                        Validity, DataAccess, CountryAccess, CommodityAccess, TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility,
                        Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User, UpdateCompanyNamePoint], async(err, reslt) => {
                            if (!err) {
                                await db.query(query.add_user_Access, [AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, result.rows[0].UserId, Share]);
                                await mail.SendEmail(Email, config.userRegisterationmailSubject, config.accountcreationmailBody);
                                return res.status(201).json(success("Ok", reslt.command + " Successful.", res.statusCode));
                            } else {
                                return res.status(201).json(success("Ok", err.message + " Successful.", res.statusCode));
                            }
                        });
                }
                else { return res.status(500).json(error(err.message, res.statusCode)); }
            })
        });
    }
}

exports.updateUserByAdmin = async (req, res) => {
    const { FullName, CompanyName, MobileNumber, Email, country, UserId, Designation = null, Location = null, GST = null, IEC = null, RoleId
        , PlanId, Downloads, Searches, StartDate, EndDate, Validity, DataAccess, CountryAccess, CommodityAccess, UpdateCompanyNamePoint,
        TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User,
        AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, Share } = req.body;

    const errors = validationResult(req);
    const date = new Date();
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_by_email, [Email]);
    if (user.rows.length > 0) {
        //bycrypt.hash(Password, 12).then(hashPassword => {
        db.query(query.update_user, [FullName, CompanyName, MobileNumber, Email, country, Designation, Location, GST, IEC, RoleId, UserId], async (err, result) => {
            if (!err) {
                db.query(query.update_Plan_Trasaction_by_admin, [PlanId, Downloads, Searches, StartDate, EndDate,
                    Validity, DataAccess, CountryAccess, CommodityAccess, TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility,
                    Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User, UpdateCompanyNamePoint, UserId], (err, result) => {
                        if (!err) {
                            db.query(query.update_user_Access, [UserId, AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, Share], (error, result) => {

                            })
                            mail.SendEmail(Email, config.userUpdatemailSubject, config.accountcreationmailBody);
                            return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                        } else {
                            return res.status(201).json(success("Ok", err.message, res.statusCode));
                        }
                    });
            }
            else { return res.status(500).json(error(err.message, res.statusCode)); }
        })
        //});
    } else { return res.status(500).json(error("User not found", res.statusCode)); }
}

exports.getAllUserlist = async (req, res) => {
    try {
        db.query(query.get_userlist, (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getAllUserByCols = async(req, res) => {
    try {        
        const tableColStr = (req?.query?.cols)?.split(",")?.map(col => `"${col}"`)?.toString();
        const sqlQuery = `SELECT cypher."UserId", ${tableColStr} FROM public."Cypher" as cypher inner join public.userplantransaction as plan 
                          on cypher."UserId" = plan."UserId" OR cypher."ParentUserId" = plan."UserId" where cypher."Enable"=true and 
                          plan."EndDate" >= $1 ORDER BY cypher."Email"`;

        const response = await db.query(sqlQuery, [req?.query?.date]);
        res?.status(200).json(success("OK", response?.rows, res?.statusCode));
    } catch (err) { return res.status(500).json(error(err, res.statusCode)); }    
}


exports.userController = {
    getUserDetailsByEmail: (req, res) => {
        try {
            const sqlQuery = `select "UserId", "MobileNumber" from "Cypher" where "Email"='${req.query.email}'`;

            db.query(sqlQuery, (err, result) => {
                if(err) {return res.status(500).json(error(err.message, res.statusCode));}
                else {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                }
            });
        } catch (error) {
            return res.status(500).json(error(error, res.statusCode));
        }
    },

    updateUserPassword: async(req, res) => {
        try {
            const { userId, email, password } = req.body;
            const sqlQuery = `update "Cypher" set "Password"=$1 where "UserId"=$2 and "Email"=$3`;

            const cryptedPassword = await bycrypt.hash(password, 12);

            db.query(sqlQuery, [cryptedPassword, userId, email], (err, result) => {
                if(err) {return res.status(500).json(error(err.message, res.statusCode));}
                else {
                    const mailMsg = `Dear User, \n\nYour password has been reset successfully. Your new password will be "${password}". Please feel free to contact us for further queries. \n\nRegards,\nCypher Team`;
                    res.status(200).json(success("PASSWORD CHANGED", res.statusCode));
                    mail.SendEmail(email, "User password has been reset", mailMsg);
                    return;
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(500).json(error(err, res.statusCode));
        }
    }
}

// exports.getUserById = async (req, res) => {
//     try {
//         const {UserId} = req.query;
//         db.query(query.get_user_By_Userid,[UserId], (error, results) => {
//             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//         })
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }