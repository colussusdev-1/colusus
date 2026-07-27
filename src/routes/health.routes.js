import express from "express";

const router = express.Router();


router.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message: "Colusus API is running.",

        environment: process.env.NODE_ENV,

        version: "1.0.0",

        timestamp: new Date().toISOString(),

    });

});


export default router;