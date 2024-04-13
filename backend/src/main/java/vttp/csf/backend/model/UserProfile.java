package vttp.csf.backend.model;

import java.util.List;

import org.bson.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    
    private String id;
    private String username;
    private String name;
    private String profilePic;
    private String bio;

    public Document toDocument() {

        // List<String> serializedPlatforms = platforms.stream()
        // .map(platform -> platform.replace("\"", ""))
        // .collect(Collectors.toList());

        // List<String> serializedImages = images.stream()
        // .map(platform -> platform.replace("\"", ""))
        // .collect(Collectors.toList());

        Document doc = new Document();
        doc.put("_id", id);
        doc.put("username", username);
        doc.put("name", name);
        doc.put("profilePic", profilePic);
        doc.put("bio", bio);

        return doc;
    }

}
