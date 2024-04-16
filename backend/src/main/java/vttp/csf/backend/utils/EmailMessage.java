package vttp.csf.backend.utils;

public class EmailMessage {
    
    public static final String body = """
        <head> 
        <style type=\"text/css\"> 
            .body { 
                text-align: center; 
                color: black
            } 

            img { 
                width: 300px; 
            } 
        </style> 
    </head> 
    <div class=\"body\"> 
        <h1> Welcome to PlayPal </h1> 
        <img src=\"https://vttp.sgp1.cdn.digitaloceanspaces.com/images/PlayPal.png\"/> 
        <p> Discover new games and keep track of them in your Library! </p> 
        <br><br>
        <p>Cheers,</p>
        <p>PlayPal</p>
    </div>  
    """;




    public static final String Subject = "PlayPal Registration Success";
}
