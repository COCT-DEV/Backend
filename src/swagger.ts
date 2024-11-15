import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Church of Christ API",
            version: "1.0.1",
            definition: "An express API for a project management system",
        }
    },
    apis: ["./src/docs/*.ts"],
}

const specs = swaggerJsdoc(options)

export default{
    specs,
    swaggerUi
}