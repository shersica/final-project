package vttp.csf.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.csf.backend.model.Review;
import vttp.csf.backend.model.ReviewInteraction;
// import vttp.csf.backend.repo.ReviewJPARepository;
import vttp.csf.backend.repo.ReviewRepo;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    // @Autowired
    // private ReviewJPARepository reviewJPARepo;

    @Autowired
    private ReviewRepo reviewRepo;


    // public Review saveReview(Review review) {
    //     return reviewJPARepo.save(review);
    // }

    // public void deleteReviewById(Long id) {
    //     reviewJPARepo.deleteById(id);
    // }

    // public Optional<Review> findReviewById(Long id) {
    //     return reviewRepo.findById(id);
    // }

    public List<Review> findReviewsByUsername(String username){
        return reviewRepo.findReviewsByUsername(username);
    }

    public List<Review> findReviewsByGameId(int gameId){
        return reviewRepo.findReviewsByGameId(gameId);
    }

    public Long saveReview(Review review){
        return reviewRepo.insertReview(review);
    }

    public Review getUserGameReview(int gameId, String username){
        return reviewRepo.getUserGameReview(gameId, username);
    }

    public boolean updateReview(Review review){
        return reviewRepo.updateReview(review);
    }

    //Review Interactions
    public boolean saveReviewInteractions(ReviewInteraction interaction){
        return reviewRepo.insertReviewInteraction(interaction);
    }

    public boolean updateReviewInteractions(ReviewInteraction interaction){
        return reviewRepo.updateReviewInteractions(interaction);
    }

    public ReviewInteraction getInteractionsByReviewId(Long reviewId){
        return reviewRepo.getInteractionsByReviewId(reviewId);
    }

    public boolean deleteReview(Long reviewId){
        boolean reviewInteractionDeleted = reviewRepo.deleteReviewInteraction(reviewId);
        boolean reviewDeleted = reviewRepo.deleteReview(reviewId);
        
        return reviewInteractionDeleted && reviewDeleted;
    }

}