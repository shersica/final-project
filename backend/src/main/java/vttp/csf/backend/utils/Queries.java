package vttp.csf.backend.utils;

public class Queries {
    
    public static final String SQL_GETREVIEWSBYGAMEID = """
        select * from reviews where game_id = ?
    """;

    public static final String SQL_GETREVIEWSBYUSER = """
        select * from reviews where reviewer_username = ?
    """;

    public static final String SQL_INSERT_REVIEW = """
        insert into reviews(game_id,comment,date, reviewer_username, rating)
        values(?, ?, ?, ?, ?)
    """;

    public static final String SQL_GAME_REVIEW_EXISTS = """
        select * from reviews where game_id = ? and reviewer_username= ?
    """;

    public static final String SQL_UPDATE_REVIEW = """
        update reviews set
	        rating = ?,
	        comment = ?,
            date = ?
	        where id = ?;        
    """;

    public static final String SQL_DELETE_REVIEW = """
        delete from reviews where id = ?        
    """;

    //Review Interactions

    public static final String SQL_GETINTERACTIONSBYREVIEWID = """
        select * from review_interactions where review_id = ?
    """;

    public static final String SQL_INSERT_REVIEWINTERACTIONS = """
        insert into review_interactions(likes, dislikes, review_id)
        values(?, ?, ?)
    """;

    public static final String SQL_DELETE_REVIEWINTERACTION = """
        delete from review_interactions where review_id = ?        
    """;

    public static final String SQL_UPDATE_LIKES_AND_DISLIKES = """
        update review_interactions set
	        likes = ?,
            dislikes = ?
	        where review_id = ?;        
    """;

    // public static final String SQL_UPDATE_DISLIKES = """
    //     update review_interactions set
	//         dislikes = ?
	//         where review_id = ?;        
    // """;
}
