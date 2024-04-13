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
import vttp.csf.backend.model.LikeStats;
import vttp.csf.backend.model.Rating;
import vttp.csf.backend.model.UserLibrary;
import vttp.csf.backend.service.LikeStatsService;

@Controller
@RequestMapping("/api/stats")
// @CrossOrigin
public class LikeStatsController {
    
    @Autowired
    private LikeStatsService likeStatsSvc;

    @GetMapping(path = "/{username}")
    public ResponseEntity<List<Document>> getUserLibrary(@PathVariable String username){

        return ResponseEntity.ok(likeStatsSvc.getLikeStatsByUser(username));
    }

    @PostMapping(path = "/save")
    @ResponseBody
    public ResponseEntity<String> saveStats(@RequestBody String payload){
        // from save stats: {"_id":"12345","username":"test","liked":false,"disliked":false,"reviewId":1}

        
        System.out.println("from save stats: " + payload);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();

        String id = "";
        if(!jsonObject.getString("_id").isEmpty()){
            id = jsonObject.getString("_id");
        } else {
            id = UUID.randomUUID().toString().substring(0,8);
        }
        String username = jsonObject.getString("username");
        Boolean liked = jsonObject.getBoolean("liked");
        Boolean disliked = jsonObject.getBoolean("disliked");
        int reviewId = jsonObject.getInt("reviewId");

        try {

            likeStatsSvc.saveLikeStats(new LikeStats(id, username, liked, disliked, reviewId));

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

}
