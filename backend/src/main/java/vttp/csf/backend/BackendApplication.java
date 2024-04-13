package vttp.csf.backend;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import vttp.csf.backend.model.LikeStats;
import vttp.csf.backend.model.Review;
import vttp.csf.backend.model.ReviewInteraction;
import vttp.csf.backend.model.UserProfile;
import vttp.csf.backend.repo.LikeStatsRepo;
import vttp.csf.backend.repo.ReviewRepo;
import vttp.csf.backend.repo.UserLibraryRepo;
import vttp.csf.backend.repo.UserProfileRepo;
import vttp.csf.backend.repo.UserRepo;
import vttp.csf.backend.service.GameService;
import vttp.csf.backend.service.LikeStatsService;
import vttp.csf.backend.service.ReviewService;
import vttp.csf.backend.service.UserProfileService;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	LikeStatsService likeStatsSvc;

	@Autowired
	GameService gameSvc;

	@Autowired
	ReviewService reviewSvc;

	@Autowired
	ReviewRepo reviewRepo;

	@Autowired
	UserLibraryRepo userLibraryRepo;

	@Autowired
	UserRepo userRepo;

	@Autowired
	UserProfileService userProfileService;

	@Autowired
	UserProfileRepo userProfileRepo;
	
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// System.out.println(gameSvc.getGameById(415171));
		// System.out.println(gameSvc.getGames("-relevance"));
		// userLibraryRepo.getUserLibraryList("test");

		// reviewSvc.deleteReviewById(4L);
		// Review rev = new Review(12345, "abc", LocalDate.now(), userRepo.findFirstByUsername("test"));
		// reviewRepo.insertReview(rev);
		// reviewRepo.findReviewsByUsername("test");
		// reviewRepo.findReviewsByGameId(303576);
		// System.out.println(reviewSvc.findReviewsByReviewer("test"));
		// System.out.println(reviewSvc.findReviewsByGameId(303576));
		// System.out.println(reviewSvc.getInteractionsByReviewId(1));
		// System.out.println(reviewRepo.getUserGameReview(303576, "testnew"));
		// System.out.println(reviewRepo.updateReviewInteractions(new ReviewInteraction(0, 0, 2L)));
		// likeStatsSvc.saveLikeStats(new LikeStats("12345", "test", true, false, 1));
		// likeStatsSvc.getLikeStatsByUser("test");
		// userProfileRepo.createUserSocials("testnew");
		// userProfileService.unfollowUser("testnew", "test");

	}

}
