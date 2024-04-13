package vttp.csf.backend.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import vttp.csf.backend.model.UserProfile;
import vttp.csf.backend.model.UserSocials;

@Repository
public class UserProfileRepo {

    @Autowired
    private MongoTemplate template;

    public void saveUserProfile(UserProfile userProfile){

        Document doc = userProfile.toDocument();
        System.out.println("saving user profile..." + doc);
        template.save(doc, "user_profile");
    }

    public Document getUserProfile(String username){
        Query query = new Query();
        query.addCriteria(
            Criteria.where("username").is(username));
        
        Document result = template.findOne(query, Document.class, "user_profile");

        return result;
    }
    
    //Socials
    public void createUserSocials(String username){
        String id = UUID.randomUUID().toString().substring(0,8);
        UserSocials userSocials = new UserSocials(id, username, new ArrayList<>(), new ArrayList<>());

        template.save(userSocials.toDocument(), "user_socials");
    }

    public void updateUserSocials(Document doc){
        template.save(doc, "user_socials");
    }

    public Document getUserSocials(String username){
        Query query = new Query();
        query.addCriteria(
            Criteria.where("username").is(username));

        Document result = template.findOne(query, Document.class, "user_socials");
        
        
        return result;
    }


}
