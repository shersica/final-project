package vttp.csf.backend.controller;

import java.io.StringReader;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.csf.backend.model.Review;
import vttp.csf.backend.model.ReviewInteraction;
import vttp.csf.backend.model.User;
import vttp.csf.backend.repo.UserRepo;
import vttp.csf.backend.service.ReviewService;

@Controller
@RequestMapping(path = "/api")
// @CrossOrigin
public class ReviewsController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ReviewService reviewSvc;
    
    @PostMapping(path = "/postreview")
    @ResponseBody
    public ResponseEntity<String> postReview(@RequestBody String payload){
        System.out.println(payload);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();
        int gameId = jsonObject.getInt("gameId");
        User reviewer = userRepo.findFirstByUsername(jsonObject.getString("reviewer"));
        String comment = jsonObject.getString("comment");
        LocalDate date = LocalDate.now();
        String rating = jsonObject.getString("rating");

        try {

            Long reviewId = reviewSvc.saveReview(new Review(gameId, comment, date, reviewer, rating));
            reviewSvc.saveReviewInteractions(new ReviewInteraction(0,0 ,reviewId));

            JsonObject success = Json.createObjectBuilder()
                    .add("success", "User Review saved")
                    .build();
                
            return ResponseEntity.ok(success.toString());    
        }
            
        catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "Fail to save user review")
            .build();
        
            return ResponseEntity.ok(error.toString());           
        }

    }

    @PutMapping(path = "/updatereview")
    @ResponseBody
    public ResponseEntity<String> updateReview(@RequestBody String payload){

        System.out.println("Review to update:"+ payload);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();
        Long id = jsonObject.getJsonNumber("id").longValue();
        int gameId = jsonObject.getInt("gameId");
        User reviewer = userRepo.findFirstByUsername(jsonObject.getString("reviewer"));
        String comment = jsonObject.getString("comment");
        LocalDate date = LocalDate.now();
        String rating = jsonObject.getString("rating");

        try {

            System.out.println(reviewSvc.updateReview(new Review(id, gameId, comment, date, reviewer, rating)));

            JsonObject success = Json.createObjectBuilder()
                    .add("success", "User Review saved")
                    .build();
                
            return ResponseEntity.ok(success.toString());    
        }
            
        catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "Fail to update user review")
            .build();
        
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.toString());
        }

    }


    @DeleteMapping(path = "/deletereview")
    @ResponseBody
    public ResponseEntity<String> deleteReview(@RequestBody String payload){

        System.out.println("Review to delete:"+ payload);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();
        Long id = jsonObject.getJsonNumber("id").longValue();

        try {

            System.out.println(reviewSvc.deleteReview(id));

            JsonObject success = Json.createObjectBuilder()
                    .add("success", "User Review saved")
                    .build();
                
            return ResponseEntity.ok(success.toString());    
        }
            
        catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "Fail to update user review")
            .build();
        
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.toString());
        }

    }

    @GetMapping(path = "/reviews/game/{gameId}")
    public ResponseEntity<String> getReviewsByGameId(@PathVariable int gameId){
        List<Review> reviews = reviewSvc.findReviewsByGameId(gameId);
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();

        for(Review r : reviews){
            arrayBuilder.add(Review.toJson(r));      
        }
        JsonArray jsonArray = arrayBuilder.build();      
        System.out.println(jsonArray);      
            
        return ResponseEntity.ok(jsonArray.toString());
    }

    @GetMapping(path = "/reviews/user/{username}")
    public ResponseEntity<String> getReviewsByUsername(@PathVariable String username){
        List<Review> reviews = reviewSvc.findReviewsByUsername(username);
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();

        for(Review r : reviews){
            arrayBuilder.add(Review.toJson(r));      
        }
        JsonArray jsonArray = arrayBuilder.build();      
        System.out.println(jsonArray);      
            
        return ResponseEntity.ok(jsonArray.toString());
    }

    @GetMapping("/reviews/game/{gameId}/user/{username}")
    public ResponseEntity<String> getUserGameReview(@PathVariable int gameId, @PathVariable String username) {
        
        try {
            Review review = reviewSvc.getUserGameReview(gameId, username);
    
            JsonObject reviewObject = Review.toJson(review);
    
            return ResponseEntity.ok(reviewObject.toString());
        } catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "No reviews")
            .build();
        
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.toString());
        }

        
    }

    //Review interactions

    @GetMapping(path = "/reviews/{reviewId}/interactions")
    public ResponseEntity<String> getReviewInteractions(@PathVariable Long reviewId){

        ReviewInteraction interaction = reviewSvc.getInteractionsByReviewId(reviewId);
        JsonObject interactionObject = ReviewInteraction.toJson(interaction);

        return ResponseEntity.ok(interactionObject.toString());
    }

    // @PostMapping(path = "/reviews/postinteractions")
    // @ResponseBody
    // public ResponseEntity<String> saveReviewInteractions(@RequestBody String payload){
        
    //     System.out.println("Interaction payload:" + payload);

    //     return ResponseEntity.ok(null);
    // }

    @PutMapping(path = "/reviewinteractions/update")
    @ResponseBody
    public ResponseEntity<String> updateReviewInteractions(@RequestBody String payload){

        System.out.println("Review Interaction to update:"+ payload);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();
        Long id = jsonObject.getJsonNumber("id").longValue();
        int likes = jsonObject.getInt("likes");
        int dislikes = jsonObject.getInt("dislikes");
        Long reviewId = jsonObject.getJsonNumber("reviewId").longValue();

        try {
            reviewSvc.updateReviewInteractions(new ReviewInteraction(id, likes, dislikes, reviewId));

            JsonObject success = Json.createObjectBuilder()
                    .add("success", "Review Interaction updated")
                    .build();
                
            return ResponseEntity.ok(success.toString());    
        }
            
        catch (Exception e) {
            JsonObject error = Json.createObjectBuilder()
            .add("error", "Fail to update review interaction")
            .build();
        
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error.toString());
        }

    }

}
