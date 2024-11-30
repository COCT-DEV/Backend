export const signUpTemplate = (code: string) => {
    return `
    <html>
    <style>
        body {
           background: #40376F;
            color: white;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            margin-top: 2rem;
        }
        div {
            width: 80%;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction:column;
        }
        h1{
            font-size: large;
            font-weight: bold;
        }
        p {
            font-size: large;
        }
        .code {
            background-color: blueviolet;
            font-size: 2.5rem;
            letter-spacing: 8px;
        }
    </style>
    <body>
        <div>
            <h1>Welcome to the Church Of Christ App </h1>
            <p>Thank you for signing up. We're excited to have you!</p>
            <h2>Complete registration</h2>
            <p>Please enter the confirmation code to complete your registration</p>
            <p class='code'>
                ${code}
            </p>
        </div>
    </body>
    </html>`
}



export const resetPasswordTemplate = (code: string) => {
    return `
    <html>
    <style>
        body {
           background: #40376F;
            color: white;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            margin-top: 2rem;
        }
        div {
            width: 80%;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction:column;
        }
        h1{
            font-size: large;
            font-weight: bold;
        }
        p {
            font-size: large;
        }
        .code {
            background-color: blueviolet;
            font-size: 2.5rem;
            letter-spacing: 8px;
        }
    </style>
    <body>
        <div>
            <h1>Confirm Reset Password</h1>
            <p>To reset your password, enter the code code below</p>
            <p class="code">
                ${code}
            </p>
        </div>
    </body>
    </html>`
}