users:

user: basicUser, password: basicUser
user: adminUser, password: adminUser



/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      properties:
 *        userName:
 *          type: string
 *        role:
 *          type: string
 *          enum: [admin, user]
 *        password:
 *          type: string
 *      required:
 *        - userName
 *        - password
 *      example:
 *        username: basicUser
 *        password: basicUser
 *        
 */