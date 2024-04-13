package vttp.csf.backend.model;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LikeStats {
    private String id;
    private String username;
    private Boolean liked;
    private Boolean disliked;
    private int reviewId;

    public Document toDocument() {

        Document doc = new Document();
        doc.put("_id", id);
        doc.put("username", username);
        doc.put("liked", liked);
        doc.put("disliked", disliked);
        doc.put("reviewId", reviewId);

        return doc;
    }
}
