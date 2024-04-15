package vttp.csf.backend.service;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonReader;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import vttp.csf.backend.model.Game;
import vttp.csf.backend.model.GameDetails;
import vttp.csf.backend.model.Rating;


@Service
public class GameService {

    @Value("${rawg.api.key}")
    private String apiKey;

    String gamesUrl = "https://api.rawg.io/api/games";

    public List<Game> searchGames(String query){
        RestTemplate template = new RestTemplate();

        String url = UriComponentsBuilder
            .fromUriString(gamesUrl)
            .queryParam("search", query)
            // .queryParam("page_size", 7)
            .queryParam("key", apiKey)
            .toUriString();

        ResponseEntity<String> resp = template.getForEntity(url, String.class);
        String payload = resp.getBody();

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonArray jsonArray = reader.readObject().getJsonArray("results");

        List<Game> games = jsonArray.stream()
            .map(game -> game.asJsonObject())
            .map(game -> {
                int gameId = game.getInt("id");
                String name = game.getString("name", "");
                List<String> platforms = new ArrayList<>();
                JsonArray platformArray = game.getJsonArray("platforms");
                for(JsonValue jsonValue : platformArray){
                    String platform = jsonValue.asJsonObject().getJsonObject("platform").getString("name");
                    platforms.add(platform);
                }
                List<String> images = new ArrayList<>();
                JsonArray imageArray = game.getJsonArray("short_screenshots");
                for(JsonValue jsonValue : imageArray){
                    String image = jsonValue.asJsonObject().getString("image");
                    images.add(image);
                }
                List<String> genres = new ArrayList<>();
                JsonArray genreArray = game.getJsonArray("genres");
                for(JsonValue jsonValue : genreArray){
                    String genre = jsonValue.asJsonObject().getString("name");
                    genres.add(genre);
                }
                String releaseDate = game.getString("released", "");
                Double rating = game.getJsonNumber("rating").doubleValue();
                
                List<String> stores = new ArrayList<>();
                JsonValue storesValue = game.get("stores");
                if (storesValue != null && storesValue instanceof JsonArray) {
                    JsonArray storeArray = (JsonArray) storesValue;
                    for (JsonValue jsonValue : storeArray) {
                        String store = jsonValue.asJsonObject().getJsonObject("store").getString("name");
                        stores.add(store);
                    }
                } 

                return new Game(gameId, name, platforms, images, genres,releaseDate,rating, stores);
            })
            .toList();

            return games;
    }

    public GameDetails getGameById(int gameId){
        RestTemplate template = new RestTemplate();

        String url = UriComponentsBuilder
            .fromUriString(gamesUrl + "/{gameId}")
            .queryParam("key", apiKey)
            .buildAndExpand(gameId)
            .toUriString();

        ResponseEntity<String> resp = template.getForEntity(url, String.class);
        String payload = resp.getBody();

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject game = reader.readObject();

        String name = game.getString("name", "");
        List<String> platforms = new ArrayList<>();
        JsonArray platformArray = game.getJsonArray("platforms");
        for(JsonValue jsonValue : platformArray){
            String platform = jsonValue.asJsonObject().getJsonObject("platform").getString("name");
            platforms.add(platform);
        }
        String backgroundImage = game.getString("background_image");
        List<String> images = getGameScreenshots(gameId);

        List<String> genres = new ArrayList<>();
        JsonArray genreArray = game.getJsonArray("genres");
        for(JsonValue jsonValue : genreArray){
            String genre = jsonValue.asJsonObject().getString("name");
            genres.add(genre);
        }

        String releaseDate = "";
        if(game.getBoolean("tba") == true){
            releaseDate = "TBA";
        } else {
            releaseDate = game.getString("released", "");
        }

        String description = game.getString("description_raw", "");
        List<String> developers = new ArrayList<>();
        JsonArray developerArray = game.getJsonArray("developers");
        for(JsonValue jsonValue : developerArray){
            String developer = jsonValue.asJsonObject().getString("name");
            developers.add(developer);
        }
        String website = game.getString("website", "");

        List<String> tags = new ArrayList<>();
        JsonArray tagsArray = game.getJsonArray("tags");
        for(JsonValue jsonValue : tagsArray){
            if(jsonValue.asJsonObject().getString("language").equals("eng")){
                String tag = jsonValue.asJsonObject().getString("name");
                tags.add(tag);
            }
        }

        List<Rating> ratings = new ArrayList<>();
        JsonArray ratingsArray = game.getJsonArray("ratings");
        for(JsonValue jsonValue : ratingsArray){
            String title = jsonValue.asJsonObject().getString("title");
            int count = jsonValue.asJsonObject().getInt("count");
            double percent = jsonValue.asJsonObject().getJsonNumber("percent").doubleValue();
            ratings.add(new Rating(title, count, percent));
        }

        List<String> stores = new ArrayList<>();
        JsonValue storesValue = game.get("stores");
        if (storesValue != null && storesValue instanceof JsonArray) {
            JsonArray storeArray = (JsonArray) storesValue;
            for (JsonValue jsonValue : storeArray) {
                String store = jsonValue.asJsonObject().getJsonObject("store").getString("name");
                stores.add(store);
            }
        } 

        Double rating = game.getJsonNumber("rating").doubleValue();


        return new GameDetails(gameId, name, platforms, backgroundImage, images, genres, releaseDate, description, developers, website, tags, ratings, stores, rating);
    }

    public List<String> getGameScreenshots(int gameId){

        RestTemplate template = new RestTemplate();

        String url = UriComponentsBuilder
            .fromUriString(gamesUrl + "/{gameId}/screenshots")
            .queryParam("key", apiKey)
            .buildAndExpand(gameId)
            .toUriString();

        ResponseEntity<String> resp = template.getForEntity(url, String.class);
        String payload = resp.getBody();

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();
        JsonArray imageArray = jsonObject.getJsonArray("results");

        List<String> images = new ArrayList<>();
        for(JsonValue jsonValue : imageArray){
            String image = jsonValue.asJsonObject().getString("image");
            images.add(image);
        }

        return images;
        
    }

    public List<Game> discoverGames(String orderBy, int page){
        RestTemplate template = new RestTemplate();

        String url = UriComponentsBuilder
            .fromUriString(gamesUrl + "/lists/main")
            .queryParam("discover", true)
            .queryParam("ordering", orderBy)
            .queryParam("page", page)
            .queryParam("page_size", 20)
            .queryParam("key", apiKey)
            .toUriString();

        ResponseEntity<String> resp = template.getForEntity(url, String.class);
        String payload = resp.getBody();

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonArray jsonArray = reader.readObject().getJsonArray("results");

        List<Game> games = jsonArray.stream()
            .map(game -> game.asJsonObject())
            .map(game -> {
                int gameId = game.getInt("id");
                String name = game.getString("name", "");
                List<String> platforms = new ArrayList<>();
                JsonArray platformArray = game.getJsonArray("platforms");
                for(JsonValue jsonValue : platformArray){
                    String platform = jsonValue.asJsonObject().getJsonObject("platform").getString("name");
                    platforms.add(platform);
                }
                List<String> images = new ArrayList<>();
                JsonArray imageArray = game.getJsonArray("short_screenshots");
                for(JsonValue jsonValue : imageArray){
                    String image = jsonValue.asJsonObject().getString("image");
                    images.add(image);
                }
                List<String> genres = new ArrayList<>();
                JsonArray genreArray = game.getJsonArray("genres");
                for(JsonValue jsonValue : genreArray){
                    String genre = jsonValue.asJsonObject().getString("name");
                    genres.add(genre);
                }
                String releaseDate = game.getString("released", "");
                Double rating = game.getJsonNumber("rating").doubleValue();
                
                List<String> stores = new ArrayList<>();
                JsonValue storesValue = game.get("stores");
                if (storesValue != null && storesValue instanceof JsonArray) {
                    JsonArray storeArray = (JsonArray) storesValue;
                    for (JsonValue jsonValue : storeArray) {
                        String store = jsonValue.asJsonObject().getJsonObject("store").getString("name");
                        stores.add(store);
                    }
                } 

                return new Game(gameId, name, platforms, images, genres,releaseDate,rating, stores);
            })
            .toList();

            return games;
    }
    
}
