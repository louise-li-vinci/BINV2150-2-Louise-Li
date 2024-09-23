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
    !("image" in body) ||
    !("volume" in body) ||
    !("price" in body) ||
    typeof body.title !== "string" ||
    typeof body.image !== "string" ||
    typeof body.volume !== "number" ||
    typeof body.price !== "number" ||
    !body.title.trim() ||
    !body.image.trim() ||
    body.volume <= 0 ||
    body.price <= 0
  ) {
    return res.sendStatus(400);
  }    
  const {title, director, duration}= body as NewFilm;
  const nextId =
    films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) +
    1;
  const newDrink: Film = {
    id: nextId,
    title,
    director,
    duration,
  };

  films.push(newDrink);
  return res.json(newDrink);

});
export default router;