package vttp.csf.backend.repo;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;


@Repository
public class UserLibraryRepo {
    
    @Autowired
    private MongoTemplate template;

    public void saveUserLibraryList(List<Document> userLibrary){
        for (Document doc : userLibrary) {
            template.save(doc, "user_library");
        }
    }

    public List<Document> getUserLibraryList(String username){
        Query query = new Query();
        query.addCriteria(
            Criteria.where("username").is(username));
        
        List<Document> result = template.find(query, Document.class, "user_library");

        return result;

    }

}
