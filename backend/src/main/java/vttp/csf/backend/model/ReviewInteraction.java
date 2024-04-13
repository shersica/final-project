package vttp.csf.backend.model;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewInteraction {
    
    private Long id;
    private int likes;
    private int dislikes;
    private Long reviewId;

    public static JsonObject toJson(ReviewInteraction review){
        return Json.createObjectBuilder()
            .add("id", review.getId())
            .add("likes", review.getLikes())
            .add("dislikes", review.getDislikes())
            .add("reviewId", review.getReviewId())
            .build();
    }

    public ReviewInteraction(int likes, int dislikes, Long reviewId) {
        this.likes = likes;
        this.dislikes = dislikes;
        this.reviewId = reviewId;
    }

    

}
