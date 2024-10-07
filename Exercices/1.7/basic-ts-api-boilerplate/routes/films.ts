import express from "express";
import { Film, NewFilm } from "../types";
import path from "node:path";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/drinks.json");

const router = express.Router();
const defaultFilms: Film[] = [
    {id : 1,
    title : "1111aa",
    director : "aa",
    duration :100,
    },

    {id : 2,
      title : "2222aa",
      director : "bb",
      duration :10,
    },

    {id : 3,
        title : "3333aa",
        director : "cc",
        duration :100,
    }
];

router.get("/", (req, res) => {
  const films = parse(jsonDbPath, defaultFilms);
  if(!req.query["minimum-duration"]){
    return res.json(films);
  }
  const minDuration = Number(req.query["minimum-duration"]);
  const filteredfilm = films.filter((film) => {
    return film.duration >= minDuration;
  });
  return res.json(filteredfilm);
});

router.get("/:id",(req, res)=>{
  const films = parse(jsonDbPath, defaultFilms);
  const id = Number(req.params.id);
  const film = films.find((film) => film.id ===id);
  if (!film) {
    return res.sendStatus(404);
  }

  return res.json(film);
});

router.post("/",(req,res)=>{
  const body: unknown = req.body;
  if (
    !body ||
    typeof body !== "object" ||
    !("title" in body) ||
    !("director" in body) ||
    !("duration" in body) ||
    typeof body.title !== "string" || !body.title.trim() ||
    typeof body.director !== "string" ||!body.director.trim() ||
    typeof body.duration !== "number" ||  body.duration <= 0

   
  ){
    return res.sendStatus(400);
  }    
  const films = parse(jsonDbPath, defaultFilms);
  if(
    films.find((film) => film.title ===body.title)&&
    films.find((film) => film.director ===body.director)
    ){
    return res.sendStatus(409);
  }
});
   

router.delete("/:id", (req, res) => {
  const films = parse(jsonDbPath, defaultFilms);
  const idInRequest = parseInt(req.params.id, 10);
  const foundIndex = films.findIndex((film) => film.id === idInRequest);

  if (foundIndex < 0){return res.sendStatus(404);}

  const itemsRemovedFromList = films.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromList[0];

  serialize(jsonDbPath, films);
  return res.json(itemRemoved);
});


router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const films = parse(jsonDbPath, defaultFilms);
  const film = films.find((film) => film.id === id);
  if (!film) {
    return res.sendStatus(404);
  }

  const body: unknown = req.body;
  if (
    !body ||
    typeof body !== "object" ||
    ("title" in body &&
      (typeof body.title !== "string" || !body.title.trim())) ||
    ("director" in body &&
      (typeof body.director !== "string" || !body.director.trim())) ||
    ("duration" in body &&
      (typeof body.duration !== "number" || body.duration <= 0))
  ){
    return res.sendStatus(400);
  }

  const {title, director, duration}: Partial<NewFilm> = body;

  if (title) {
    film.title = title;
  }
  if (director) {
    film.director = director;
  }
  if (duration) {
    film.duration = duration;
  }

  serialize(jsonDbPath, films);
  return res.json(film);
});

export default router;