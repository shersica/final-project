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
public class GameDetails {
    private int gameId;
    private String name;
    private List<String> platforms;
    private String backgroundImage;
    private List<String> images;   
    private List<String> genres; 
    private String releaseDate;
    private String description;
    private List<String> developers;
    private String website;
    private List<String> tags;
    private List<Rating> ratings;
    private List<String> stores;
    private Double rating;

    public static JsonObject toJson(GameDetails gameDetails) {
        JsonArrayBuilder platformsArrayBuilder = Json.createArrayBuilder();
        gameDetails.getPlatforms().forEach(platformsArrayBuilder::add);
        JsonArray platformsArray = platformsArrayBuilder.build();

        JsonArrayBuilder imagesArrayBuilder = Json.createArrayBuilder();
        gameDetails.getImages().forEach(imagesArrayBuilder::add);
        JsonArray imagesArray = imagesArrayBuilder.build();

        JsonArrayBuilder genresArrayBuilder = Json.createArrayBuilder();
        gameDetails.getGenres().forEach(genresArrayBuilder::add);
        JsonArray genresArray = genresArrayBuilder.build();

        JsonArrayBuilder storesArrayBuilder = Json.createArrayBuilder();
        gameDetails.getStores().forEach(storesArrayBuilder::add);
        JsonArray storesArray = storesArrayBuilder.build();

        JsonArrayBuilder developersArrayBuilder = Json.createArrayBuilder();
        gameDetails.getDevelopers().forEach(developersArrayBuilder::add);
        JsonArray developersArray = developersArrayBuilder.build();

        JsonArrayBuilder tagsArrayBuilder = Json.createArrayBuilder();
        gameDetails.getTags().forEach(tagsArrayBuilder::add);
        JsonArray tagsArray = tagsArrayBuilder.build();

        JsonArrayBuilder ratingsArrayBuilder = Json.createArrayBuilder();
        gameDetails.getRatings().forEach(rating -> { 
            ratingsArrayBuilder.add(Rating.toJson(rating));
        });
        JsonArray ratingsArray = ratingsArrayBuilder.build();

        return Json.createObjectBuilder()
                .add("gameId", gameDetails.getGameId())
                .add("name", gameDetails.getName())
                .add("platforms", platformsArray)
                .add("backgroundImage", gameDetails.getBackgroundImage())
                .add("images", imagesArray)
                .add("genres", genresArray)
                .add("releaseDate", gameDetails.getReleaseDate())
                .add("description", gameDetails.getDescription())
                .add("developers", developersArray)
                .add("website", gameDetails.getWebsite())
                .add("tags", tagsArray)
                .add("ratings", ratingsArray)
                .add("stores", storesArray)
                .add("rating", gameDetails.getRating())
                .build();
    }

}
