package vttp.csf.backend.model;

import java.sql.Date;
import java.time.LocalDate;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Entity
// @Table(name = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int gameId;
    // private String reviewer;
    private String comment;
    private LocalDate date;

    // @ManyToOne
    // @JoinColumn(name = "reviewer_username", referencedColumnName = "username")
    private User reviewer;
    private String rating;

    public Review(int gameId, String comment, LocalDate date, User reviewer, String rating) {
        this.gameId = gameId;
        this.comment = comment;
        this.date = date;
        this.reviewer = reviewer;
        this.rating = rating;
    }

    public static JsonObject toJson(Review review){
        return Json.createObjectBuilder()
            .add("id", review.getId())
            .add("gameId", review.getGameId())
            .add("comment", review.getComment())
            .add("date", review.getDate().toString())
            .add("reviewer", review.getReviewer().getUsername())
            .add("rating", review.getRating())
            .build();
    }

    
}
