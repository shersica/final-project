package vttp.csf.backend.model;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Entity
// @Table(name = "user_library")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLibrary {
    
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id", nullable = false)
    private String username;
    
    private int gameId;
    private String name;
    private List<String> platforms;
    private String backgroundImage;
    private List<String> images;   
    private List<String> genres; 
    private String releaseDate;
    
    // @OneToMany(mappedBy = "userLibrary")
    private List<Rating> ratings;
    
    private Double rating;
    private String gameStatus;
    private String userRating;
    
    // public UserLibrary(String username, int gameId, String name, List<String> platforms, String backgroundImage,
    //         List<String> images, List<String> genres, String releaseDate, List<Rating> ratings, Double rating,
    //         String gameStatus) {
    //     this.username = username;
    //     this.gameId = gameId;
    //     this.name = name;
    //     this.platforms = platforms;
    //     this.backgroundImage = backgroundImage;
    //     this.images = images;
    //     this.genres = genres;
    //     this.releaseDate = releaseDate;
    //     this.ratings = ratings;
    //     this.rating = rating;
    //     this.gameStatus = gameStatus;
    // }
    
    public Document toDocument() {

        List<String> serializedPlatforms = platforms.stream()
        .map(platform -> platform.replace("\"", ""))
        .collect(Collectors.toList());

        List<String> serializedImages = images.stream()
        .map(platform -> platform.replace("\"", ""))
        .collect(Collectors.toList());

        List<String> serializedGenres = genres.stream()
        .map(platform -> platform.replace("\"", ""))
        .collect(Collectors.toList());

        Document doc = new Document();
        doc.put("_id", id);
        doc.put("username", username);
        doc.put("gameId", gameId);
        doc.put("name", name);
        doc.put("platforms", serializedPlatforms);
        doc.put("backgroundImage", backgroundImage);
        doc.put("images", serializedImages);
        doc.put("genres", serializedGenres);
        doc.put("releaseDate", releaseDate);
        doc.put("ratings", ratings);
        doc.put("rating", rating);
        doc.put("gameStatus", gameStatus);
        doc.put("userRating", userRating);
        


        return doc;
    }
    
}

