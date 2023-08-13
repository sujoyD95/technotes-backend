const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//login
//route =>POST /auth
//access =>Public

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  const foundUser = await User.findOne({ username });

  if (!foundUser || !foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const match = bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "UnAuthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_KEY_SECRET,
    { expiresIn: "30s" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_KEY_SECRET,
    { expiresIn: "7d" }
  );

  //create cookie with refresh token

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

//Refresh
//GET /auth/refresh
//access =>public =>because access token ahs expired

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_KEY_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).josn({ message: "Forbidden" });

      const foundUser = await User.findOne({ username: decoded.username });
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_KEY_SECRET,
        { expiresIn: "30s" }
      );

      res.json(accessToken);
    })
  );
};

//logout
//POST /auth/logout
//public =>just to clear cookie if exists

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
