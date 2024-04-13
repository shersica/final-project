package vttp.csf.backend.model;

import java.util.List;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    private int gameId;
    private String name;
    private List<String> platforms;
    private List<String> images;   
    private List<String> genres; 
    private String releaseDate;
    private double rating;
    private List<String> stores;

    public static JsonObject toJson(Game game) {
        JsonArrayBuilder platformsArrayBuilder = Json.createArrayBuilder();
        for (String platform : game.getPlatforms()) {
            platformsArrayBuilder.add(platform);
        }
        JsonArray platformsArray = platformsArrayBuilder.build();

        JsonArrayBuilder imagesArrayBuilder = Json.createArrayBuilder();
        for (String image : game.getImages()) {
            imagesArrayBuilder.add(image);
        }
        JsonArray imagesArray = imagesArrayBuilder.build();

        JsonArrayBuilder genresArrayBuilder = Json.createArrayBuilder();
        for (String genre : game.getGenres()) {
            genresArrayBuilder.add(genre);
        }
        JsonArray genresArray = genresArrayBuilder.build();

        JsonArrayBuilder storesArrayBuilder = Json.createArrayBuilder();
        for (String store : game.getStores()) {
            storesArrayBuilder.add(store);
        }
        JsonArray storesArray = storesArrayBuilder.build();

        return Json.createObjectBuilder()
                .add("gameId", game.getGameId())
                .add("name", game.getName())
                .add("platforms", platformsArray)
                .add("images", imagesArray)
                .add("genres", genresArray)
                .add("releaseDate", game.getReleaseDate())
                .add("rating", game.getRating())
                .add("stores", storesArray)
                .build();
    }

}
