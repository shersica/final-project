package vttp.csf.backend.service;

import java.util.List;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vttp.csf.backend.model.UserProfile;
import vttp.csf.backend.repo.S3Repo;
import vttp.csf.backend.repo.UserProfileRepo;

@Service
public class UserProfileService {
    
    @Autowired
    private S3Repo s3Repo;

    @Autowired
    private UserProfileRepo userProfileRepo;

    public void saveProfile(MultipartFile picture, String name, String bio, String username){

        try {
            String imageUrl = s3Repo.saveToS3(username, picture.getContentType(), picture.getInputStream(), picture.getSize());
            String id = UUID.randomUUID().toString().substring(0, 8);
            UserProfile userProfile = new UserProfile(id,username, name, imageUrl, bio);
            userProfileRepo.saveUserProfile(userProfile);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Document getUserProfile(String username){
        return userProfileRepo.getUserProfile(username);
    }

    //Socials

    public void followUser(String userToFollow, String currentUser){


        //update followers
        Document userToFollowDoc = userProfileRepo.getUserSocials(userToFollow);
        List<String> followers = userToFollowDoc.getList("followers", String.class);
        followers.add(currentUser);
        userToFollowDoc.put("followers", followers);
        userProfileRepo.updateUserSocials(userToFollowDoc);

        //update following
        Document currUserDoc = userProfileRepo.getUserSocials(currentUser);
        List<String> following = currUserDoc.getList("following", String.class);
        following.add(userToFollow);
        currUserDoc.put("following", following);
        userProfileRepo.updateUserSocials(currUserDoc);

    }

    public void unfollowUser(String userToUnfollow, String currentUser){


        //update followers
        Document userToUnfollowDoc = userProfileRepo.getUserSocials(userToUnfollow);
        List<String> followers = userToUnfollowDoc.getList("followers", String.class);
        followers.remove(currentUser);
        userToUnfollowDoc.put("followers", followers);
        userProfileRepo.updateUserSocials(userToUnfollowDoc);

        //update following
        Document currUserDoc = userProfileRepo.getUserSocials(currentUser);
        List<String> following = currUserDoc.getList("following", String.class);
        following.remove(userToUnfollow);
        currUserDoc.put("following", following);
        userProfileRepo.updateUserSocials(currUserDoc);

    }

    public Document getUserSocials(String username){
        return userProfileRepo.getUserSocials(username);
    }
}
