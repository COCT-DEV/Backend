import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi, { SwaggerOptions } from "swagger-ui-express"
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Church of Christ API",
            version: "1.0.1",
            description: "An express API for a project management system",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/docs/*"], // Ensure proper path
};


const specs = swaggerJsdoc(options)

export default{
    specs,
    swaggerUi
}