const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = null;

app.use(express.json());

//database
let initialize = async () => {
  try {
    let dbPath = path.join(__dirname, "moviesData.db");
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => console.log("Server is Online"));
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initialize();

//API 1
app.get("/movies/", async (request, response) => {
  let query = `SELECT movie_name FROM movie`;

  let result = await db.all(query);

  function converter(obj) {
    return {
      movieName: obj.movie_name,
    };
  }

  response.send(result.map((obj) => converter(obj)));
});

//API 2
app.post("/movies/", async (request, response) => {
  let body = request.body;
  let { directorId, movieName, leadActor } = body;
  let query = `INSERT INTO movie ( director_id, movie_name, lead_actor )
    VALUES ( ${directorId}, '${movieName}', '${leadActor}' );`;

  await db.run(query);

  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  let query = `SELECT * FROM movie WHERE
      movie_id = ${movieId};`;

  let result = await db.all(query);

  console.log(movieId);
  console.log(result);

  function converter(obj) {
    return {
      movieId: obj.movie_id,
      directorId: obj.director_id,
      movieName: obj.movie_name,
      leadActor: obj.lead_actor,
    };
  }

  response.send(converter(result));
});

//API4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  let body = request.body;
  let { directorId, movieName, leadActor } = body;

  let query = `UPDATE movie SET
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId};`;

  await db.run(query);

  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;

  let query = `DELETE FROM movie WHERE movie_id = ${movieId}`;

  await db.run(query);

  response.send("Movie Removed");
});

//API 6
app.get("/directors/", async (request, response) => {
  let query = `SELECT * FROM director`;

  let result = await db.all(query);

  function converter(obj) {
    return {
      directorId: obj.director_id,
      directorName: obj.director_name,
    };
  }

  response.send(result.map((obj) => converter(obj)));
});

//API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;

  let query = `SELECT * FROM movie WHERE
      director_id=${directorId};`;

  let result = await db.all(query);

  function converter(obj) {
    return {
      movieName: obj.movie_name,
    };
  }

  response.send(result.map((obj) => converter(obj)));
});

//module export
module.exports = app;
