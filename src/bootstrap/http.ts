import {Express} from "express";
import path from "path";
import cors from "cors";
import express from 'express';

export default function(app: Express)
{
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../public')));

    return app;
}
