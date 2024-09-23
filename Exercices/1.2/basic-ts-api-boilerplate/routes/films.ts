import express from "express";
import { Films } from "../types";


const router = express.Router();
const films: Films[] = [
    {id : 1,
    title : "1111aa",
    director : "aa",
    duration :100,
    },

    {id : 2,
      title : "2222aa",
      director : "bb",
      duration :100,
    },

    {id : 3,
        title : "3333aa",
        director : "cc",
        duration :100,
    }
];

router.get("/", (_req, res) => {
  return res.json(films);
});


export default router;