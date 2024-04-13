package vttp.csf.backend.controller;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.json.JsonValue;
import vttp.csf.backend.model.Rating;
import vttp.csf.backend.model.User;
import vttp.csf.backend.model.UserLibrary;
import vttp.csf.backend.model.UserSocials;
import vttp.csf.backend.repo.UserRepo;
import vttp.csf.backend.service.UserLibraryService;

@Controller
@RequestMapping(path = "/api")
// @CrossOrigin
public class UserLibraryController {

    @Autowired
    private UserLibraryService userLibrarySvc;

    @Autowired
    private UserRepo userRepo;
    
    @PostMapping(path = "/saveLibrary")
    @ResponseBody
    public ResponseEntity<String> saveUserLibrary(@RequestBody String payload){
        
        System.out.println(payload);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonArray jsonArray = reader.readArray();


        List<UserLibrary> userLibrary = jsonArray.stream()
            .map(o -> o.asJsonObject())
            .map(game -> {
                String id = "";
                if(!game.getString("_id").isEmpty()){
                    id = game.getString("_id");
                } else {
                    id = UUID.randomUUID().toString().substring(0,8);
                }
                int gameId = game.getInt("gameId");
                String username = game.getString("username");
                String name = game.getString("name");
                List<String> platforms = new ArrayList<>();
                JsonArray platformArray = game.getJsonArray("platforms");
                for(JsonValue jsonValue : platformArray){
                    String platform = jsonValue.toString();
                    platforms.add(platform);
                }
                String backgroundImage = game.getString("backgroundImage");
                List<String> images = new ArrayList<>();
                JsonArray imageArray = game.getJsonArray("images");
                for(JsonValue jsonValue : imageArray){
                    String image = jsonValue.toString();
                    images.add(image);
                }
                List<String> genres = new ArrayList<>();
                JsonArray genreArray = game.getJsonArray("genres");
                for(JsonValue jsonValue : genreArray){
                    String genre = jsonValue.toString();
                    genres.add(genre);
                }
                String releaseDate = game.getString("released", "");
                List<Rating> ratings = new ArrayList<>();
                JsonArray ratingsArray = game.getJsonArray("ratings");
                for(JsonValue jsonValue : ratingsArray){
                    String title = jsonValue.asJsonObject().getString("title");
                    int count = jsonValue.asJsonObject().getInt("count");
                    double percent = jsonValue.asJsonObject().getJsonNumber("percent").doubleValue();
                    ratings.add(new Rating(title, count, percent));
                }
                Double rating = game.getJsonNumber("rating").doubleValue();
                String gameStatus = game.getString("gameStatus");
                String userRating = game.getString("userRating");

                return new UserLibrary(id,username, gameId, name, platforms, backgroundImage, images, genres, releaseDate, ratings, rating, gameStatus, userRating);
            })
            .toList();

        try {

            userLibrarySvc.saveUserLibraryList(userLibrary);

            JsonObject success = Json.createObjectBuilder()
                .add("success", "User library saved")
                .build();
            
            return ResponseEntity.ok(success.toString());

        } catch (Exception e) {

            JsonObject error = Json.createObjectBuilder()
            .add("error", "Fail to save user library")
            .build();
        
            return ResponseEntity.ok(error.toString());   

        }
    }

    @GetMapping(path = "/user/{username}/library")
    public ResponseEntity<List<Document>> getUserLibrary(@PathVariable String username){

        return ResponseEntity.ok(userLibrarySvc.getUserLibraryList(username));
    }



}

