package vttp.csf.backend.model;

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

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rating {
    private String title;
    private int count;
    private double percent;

    public static JsonObject toJson(Rating rating){
        return Json.createObjectBuilder()
            .add("title", rating.getTitle())
            .add("count", rating.getCount())
            .add("percent", rating.getPercent())
            .build();
    }

}

// @Entity
// @Table(name = "rating")
// @Data
// @AllArgsConstructor
// @NoArgsConstructor
// public class Rating {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String title;
//     private int count;
//     private double percent;

//     // Define the relationship with UserLibrary
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "user_library_id", nullable = false)
//     private UserLibrary userLibrary;

//     public static JsonObject toJson(Rating rating){
//         return Json.createObjectBuilder()
//             .add("title", rating.getTitle())
//             .add("count", rating.getCount())
//             .add("percent", rating.getPercent())
//             .build();
//     }

//     public Rating(String title, int count, double percent) {
//         this.title = title;
//         this.count = count;
//         this.percent = percent;
//     }

    
// }

