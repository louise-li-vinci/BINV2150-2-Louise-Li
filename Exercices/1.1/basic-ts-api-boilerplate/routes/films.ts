import express from "express";
import { Films } from "../types";


const router = express.Router();
const films: Films[] = [
    {id : 1,
    title : "1111aa",
    director : "string",
    duration :100,
    }
];


router.get("/", (_req, res) => {
  return res.json(films);
});


export default router;