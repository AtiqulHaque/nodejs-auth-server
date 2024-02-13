const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth managing API
 * /api/auth/signup:
 *   post:
 *     summary: Create a new User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth managing API
 * /api/auth/signin:
 *   post:
 *     summary: Create a login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth managing API
 * /api/auth/verify:
 *   post:
 *     summary: Verify user token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth managing API
 * /api/auth/refreshtoken:
 *   post:
 *     summary: Verify user token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - roles
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: User name of user
 *         password:
 *           type: string
 *           description: Password
 *         roles:
 *           type: boolean
 *           description: User assigned password
 *       example:
 *         id: 1
 *         username: atik007
 *         email: mailtoatiqul@gmail.com
 *         roles: ["user", "moderator"]
 */




module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);


    app.post("/api/auth/verify", controller.signin);

    app.post("/api/auth/refreshtoken", controller.refreshToken);
};