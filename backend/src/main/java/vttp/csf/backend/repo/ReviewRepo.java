package vttp.csf.backend.repo;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import vttp.csf.backend.model.Review;
import vttp.csf.backend.model.ReviewInteraction;
import vttp.csf.backend.model.User;
import vttp.csf.backend.utils.Queries;

@Repository
public class ReviewRepo {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JdbcTemplate template;


    public List<Review> findReviewsByUsername(String username){
        SqlRowSet rs = template.queryForRowSet(Queries.SQL_GETREVIEWSBYUSER, username);

        List<Review> reviews = new LinkedList<>();
        while(rs.next()){
            Long id = rs.getLong("id");
            User reviewer = userRepo.findFirstByUsername(username);
            String comment = rs.getString("comment");
            int gameId = rs.getInt("game_id");
            LocalDate date = rs.getDate("date").toLocalDate();
            String rating = rs.getString("rating");
            // System.out.printf("Reviewer: %s, Comment: %s, GameID: %d\n", reviewer,comment,gameId);
            reviews.add(new Review(id, gameId, comment, date, reviewer, rating));
        }

        return reviews;
    }

    public List<Review> findReviewsByGameId(int gameId){
        SqlRowSet rs = template.queryForRowSet(Queries.SQL_GETREVIEWSBYGAMEID, gameId);

        List<Review> reviews = new LinkedList<>();
        while(rs.next()){
            Long id = rs.getLong("id");
            User reviewer = userRepo.findFirstByUsername(rs.getString("reviewer_username"));
            String comment = rs.getString("comment");
            int game_Id = rs.getInt("game_id");
            LocalDate date = rs.getDate("date").toLocalDate();
            String rating = rs.getString("rating");
            // System.out.printf("Reviewer: %s, Comment: %s, GameID: %d\n", reviewer,comment,game_Id);
            reviews.add(new Review(id, gameId, comment, date, reviewer, rating));
        }

        return reviews;
    }

    public Long insertReview(Review review){
        KeyHolder keyHolder = new GeneratedKeyHolder();
        template.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(Queries.SQL_INSERT_REVIEW, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, review.getGameId());
            ps.setString(2, review.getComment());
            ps.setDate(3, Date.valueOf(review.getDate()));
            ps.setString(4, review.getReviewer().getUsername());
            ps.setString(5, review.getRating());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public boolean updateReview(Review review){
        return template.update(Queries.SQL_UPDATE_REVIEW, review.getRating(), review.getComment(), review.getDate(), review.getId()
                )>= 1;
    }

    public Review getUserGameReview(int gameId, String username){
        SqlRowSet rs = template.queryForRowSet(Queries.SQL_GAME_REVIEW_EXISTS, gameId, username);
        rs.next();        
        Long id = rs.getLong("id");
        User reviewer = userRepo.findFirstByUsername(username);
        String comment = rs.getString("comment");
        LocalDate date = rs.getDate("date").toLocalDate();
        String rating = rs.getString("rating");

        return new Review(id, gameId, comment, date, reviewer, rating);
    }

    public boolean deleteReview(Long reviewId){
        int rowsAffected = template.update(Queries.SQL_DELETE_REVIEW, reviewId);
        return rowsAffected > 0;    
    }

    //Review Interactions

    public ReviewInteraction getInteractionsByReviewId(Long reviewId){
        SqlRowSet rs = template.queryForRowSet(Queries.SQL_GETINTERACTIONSBYREVIEWID, reviewId);
        rs.next();
        Long id = rs.getLong("id");
        int likes = rs.getInt("likes");
        int dislikes = rs.getInt("dislikes");
        
        return new ReviewInteraction(id, likes, dislikes, reviewId);
    }

    public boolean insertReviewInteraction(ReviewInteraction interaction){
        return template.update(Queries.SQL_INSERT_REVIEWINTERACTIONS, 
        interaction.getLikes(), interaction.getDislikes(),interaction.getReviewId()
        ) >= 1;
    }

    public boolean deleteReviewInteraction(Long reviewId){
        int rowsAffected = template.update(Queries.SQL_DELETE_REVIEWINTERACTION, reviewId);
        return rowsAffected > 0;    
    }

    public boolean updateReviewInteractions(ReviewInteraction interaction){
        return template.update(Queries.SQL_UPDATE_LIKES_AND_DISLIKES, 
        interaction.getLikes(), interaction.getDislikes(), interaction.getReviewId()
        ) >= 1;
    }
}
