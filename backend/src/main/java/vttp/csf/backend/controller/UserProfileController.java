package vttp.csf.backend.controller;

import java.io.StringReader;

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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.Response;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.csf.backend.service.UserProfileService;

@Controller
@RequestMapping(path = "/api")
// @CrossOrigin
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileSvc;
    
    @PostMapping(path = "/user/profile/save")
    @ResponseBody
    public ResponseEntity<String> saveProfile(@RequestPart MultipartFile picture, @RequestPart String name, @RequestPart String bio, @RequestPart String username, @RequestPart String id ){

        System.out.println("Picture: " + picture);
        System.out.println("Name: " + name);
        System.out.println("Bio: " + bio);
        System.out.println("Username: " + username);        
        System.out.println("Id: " + id);


        userProfileSvc.saveProfile(picture, name, bio, username, id);

        JsonObject success = Json.createObjectBuilder()
        .add("success", "User profile saved")
        .build();
    
        return ResponseEntity.ok(success.toString());
    }

    @GetMapping(path = "/user/profile/{username}")
    public ResponseEntity<Document> getUserProfile(@PathVariable String username){

        Document doc = userProfileSvc.getUserProfile(username);

        return ResponseEntity.ok(doc);
    }

    //User Socials

    @PostMapping(path = "/user/follow")
    @ResponseBody
    public ResponseEntity<String> followUser(@RequestBody String payload){

        System.out.println("Save following:" + payload);

        
        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();

        String userToFollow = jsonObject.getString("userToFollow");
        String currentUser = jsonObject.getString("currentUser");

        // UserSocials 
        userProfileSvc.followUser(userToFollow, currentUser);

        JsonObject success = Json.createObjectBuilder()
        .add("success", "Followed user")
        .build();
    
        return ResponseEntity.ok(success.toString());    
    }

    @PostMapping(path = "/user/unfollow")
    @ResponseBody
    public ResponseEntity<String> unfollowUser(@RequestBody String payload){

        System.out.println("Save following:" + payload);

        
        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject jsonObject = reader.readObject();

        String userToUnfollow = jsonObject.getString("userToUnfollow");
        String currentUser = jsonObject.getString("currentUser");

        // UserSocials 
        userProfileSvc.unfollowUser(userToUnfollow, currentUser);

        JsonObject success = Json.createObjectBuilder()
        .add("success", "Unfollowed user")
        .build();
    
        return ResponseEntity.ok(success.toString());    
    }

    @GetMapping(path = "/user/{username}/socials")
    public ResponseEntity<Document> getUserSocials(@PathVariable String username){

        Document doc = userProfileSvc.getUserSocials(username);

        return ResponseEntity.ok(doc);
    }
}
