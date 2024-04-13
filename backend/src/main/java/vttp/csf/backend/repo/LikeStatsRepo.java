package vttp.csf.backend.repo;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class LikeStatsRepo {
    
    @Autowired
    private MongoTemplate template;

    public void saveLikeStats(Document likeStats){
        template.save(likeStats, "likestats");
    }

    public List<Document> getLikeStatsByUser(String username){
        Query query = new Query();
        query.addCriteria(
            Criteria.where("username").is(username));
        
        List<Document> result = template.find(query, Document.class, "likestats");
        // for (Document d : result) {
        //     System.out.printf("Liked: %b%n, Disliked: %b%n, ReviewId: %d\n",
        //             d.getBoolean("liked"),
        //             d.getBoolean("disliked"),
        //             d.getInteger("reviewId"));
        // }
        return result;

    }
}
