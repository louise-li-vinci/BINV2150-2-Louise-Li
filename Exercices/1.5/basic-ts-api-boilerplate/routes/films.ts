import express from "express";
import { Film, NewFilm } from "../types";


const router = express.Router();
const films: Film[] = [
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
        budget: 123
    }
];

router.get("/", (req, res) => {
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
    typeof body.title !== "string" ||
    typeof body.director !== "string" ||
    typeof body.duration !== "number" ||
    !body.title.trim() ||
    !body.director.trim() ||
    body.duration <= 0
  ){
    return res.sendStatus(400);
  }    
  if(
    films.find((film) => film.title ===body.title)&&
    films.find((film) => film.director ===body.director)
    ){
    return res.sendStatus(409);
  }
  
  const {title, director, duration}= body as NewFilm;
  const nextId =
    films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;
  const newFilm: Film = {
    id: nextId,
    title,
    director,
    duration
  };

  films.push(newFilm);
  return res.json(newFilm);

});

router.delete("/:id", (req, res) => {
  const idInRequest = parseInt(req.params.id, 10);
  const foundIndex = films.findIndex((film) => film.id === idInRequest);

  if (foundIndex < 0){return res.sendStatus(404);}

  const itemsRemovedFromList = films.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromList[0];


  return res.json(itemRemoved);
});
export default router;