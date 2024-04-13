package vttp.csf.backend.model;

import java.util.List;

import org.bson.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSocials {
    
    private String id;
    private String username;
    private List<String> following;
    private List<String> followers;

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
        doc.put("following", following);
        doc.put("followers", followers);



        return doc;
    }
}
