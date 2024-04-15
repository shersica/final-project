package vttp.csf.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.csf.backend.model.UserLibrary;
import vttp.csf.backend.repo.UserLibraryRepo;

@Service
public class UserLibraryService {
    
    @Autowired
    private UserLibraryRepo userLibraryRepo;

    List<UserLibrary> userLibraryList = new ArrayList<>();

    public void saveUserLibraryList(List<UserLibrary> userLibraryList) {
        try {

            List<Document> userLibraryDoc = new ArrayList<>();
            for(UserLibrary ul : userLibraryList){
                userLibraryDoc.add(ul.toDocument());
            }

            userLibraryRepo.saveUserLibraryList(userLibraryDoc);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Document> getUserLibraryList(String username){
        return userLibraryRepo.getUserLibraryList(username);
    }


    public void deleteFromUserLibraryById(String id){
        userLibraryRepo.deleteFromUserLibraryById(id);
    }
}
