package vttp.csf.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.csf.backend.model.Game;
import vttp.csf.backend.model.GameDetails;
import vttp.csf.backend.service.GameService;


@Controller
@RequestMapping(path = "/api")
// @CrossOrigin
public class GameController {

    @Autowired
    private GameService gameSvc;
    
    @GetMapping(path = "/games")
    public ResponseEntity<String> searchGames(@RequestParam String query){
        try {
            List<Game> games = gameSvc.searchGames(query);
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
    
            for(Game game : games){
                JsonObject jsonObject = Game.toJson(game);
                arrayBuilder.add(jsonObject);
            }
    
            JsonArray jsonArray = arrayBuilder.build();            
            
            return ResponseEntity.ok(jsonArray.toString());
        } catch (Exception e) {

            JsonObject error = Json.createObjectBuilder()
                .add("error", "No games found")
                .build();

            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(error.toString());
        }
    }


    @GetMapping(path = "/games/{gameId}")
    public ResponseEntity<String> getGameById(@PathVariable int gameId, Game game1){
        try {
            GameDetails game = gameSvc.getGameById(gameId);
            return ResponseEntity.ok(GameDetails.toJson(game).toString());

        } catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "Invalid game Id")
            .build();

        return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(error.toString());
        }

    }

    @GetMapping(path = "/games/discover")
    public ResponseEntity<String> discoverGames(@RequestParam(defaultValue = "-relevance") String orderBy){

        try {
            List<Game> games = gameSvc.discoverGames(orderBy);
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
    
            for(Game game : games){
                JsonObject jsonObject = Game.toJson(game);
                arrayBuilder.add(jsonObject);
            }
    
            JsonArray jsonArray = arrayBuilder.build();            
            
            return ResponseEntity.ok(jsonArray.toString());

        } catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "Error getting game list")
            .build();

            return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(error.toString());
        }
    }

}

