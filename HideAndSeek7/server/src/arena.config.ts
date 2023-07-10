import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import express from "express";
import basicAuth from "express-basic-auth";
import path from "path";

/**
 * Import your Room files
 */
import {GameRoom} from "./rooms/GameRoom";

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer
            .define('my_room', GameRoom)
            .filterBy(['realm']);

    },

    initializeExpress: (app) => {
        app.use(express.static(path.join(__dirname, "static")));

        const basicAuthMiddleware = basicAuth({
            // list of users and passwords
            users: {
                admin: process.env.ACL_ADMIN_PW !== undefined ? process.env.ACL_ADMIN_PW : "admin", //YWRtaW46YWRtaW4=
                vroomway: "admin" //
            },
            // sends WWW-Authenticate header, which will prompt the user to fill
            // credentials in
            challenge: true
        });
        
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        // (optional) attach web monitoring panel
        app.use("/colyseus", basicAuthMiddleware, monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});