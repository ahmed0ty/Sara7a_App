import express from "express";
import bootstrap from "./app.controller.js";
import dotenv from "dotenv"
import "./Utils/event.utils.js"

import dns from "dns"
dns.setServers(['1.1.1.1','8.8.8.8'])


const app = express();
dotenv.config({path:"./src/config/.env"})

const port = process.env.PORT;

await bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));




