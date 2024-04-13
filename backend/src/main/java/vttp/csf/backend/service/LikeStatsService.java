package vttp.csf.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.csf.backend.model.LikeStats;
import vttp.csf.backend.repo.LikeStatsRepo;

@Service
public class LikeStatsService {
    
    @Autowired
    private LikeStatsRepo likeStatsRepo;

    public void saveLikeStats(LikeStats likeStats) {
        try {

            likeStatsRepo.saveLikeStats(likeStats.toDocument());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Document> getLikeStatsByUser(String username){
        return likeStatsRepo.getLikeStatsByUser(username);
    }
}
