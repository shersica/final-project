package vttp.csf.backend.controller;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import vttp.csf.backend.dto.AuthenticationRequest;
import vttp.csf.backend.dto.AuthenticationResponse;
import vttp.csf.backend.dto.SignupRequest;
import vttp.csf.backend.dto.UserDTO;
import vttp.csf.backend.exceptions.UsernameExistsException;
import vttp.csf.backend.model.User;
import vttp.csf.backend.model.UserProfile;
import vttp.csf.backend.repo.UserProfileRepo;
import vttp.csf.backend.repo.UserRepo;
import vttp.csf.backend.service.AuthService;
import vttp.csf.backend.service.EmailService;
import vttp.csf.backend.service.UserDetailsServiceImp;
import vttp.csf.backend.utils.EmailMessage;
import vttp.csf.backend.utils.JwtUtil;

@RestController
@RequestMapping(path = "/api/auth")
// @CrossOrigin
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImp userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailSvc;

    @Autowired
    private UserProfileRepo userProfileRepo;

    
    @PostMapping(path = "/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest){
        try {
            UserDTO createdUser = authService.createUser(signupRequest);
            //Send email upon registration
            emailSvc.sendEmail(createdUser.getEmail(), EmailMessage.body, EmailMessage.Subject);
            //Create Userprofile
            String id = UUID.randomUUID().toString().substring(0, 8);
            UserProfile userProfile = new UserProfile(id,createdUser.getUsername(), "","https://pbs.twimg.com/media/FzEjZL4aYAU4Vzj.jpg" , "");
            userProfileRepo.saveUserProfile(userProfile);
            //Create Socials
            userProfileRepo.createUserSocials(createdUser.getUsername());

            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);

        } catch (UsernameExistsException e) {
            return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("User not created, try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/login")
    public AuthenticationResponse createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest, HttpServletResponse response) throws BadCredentialsException, DisabledException, UsernameNotFoundException, IOException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Incorrect Username or password");
        } catch (DisabledException disabledException){
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "User is not created. Register User first.");
            return null;
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        User user = userRepo.findFirstByUsername(userDetails.getUsername());
        return new AuthenticationResponse(jwt, userDetails.getUsername(), user.getId());
    }
}
