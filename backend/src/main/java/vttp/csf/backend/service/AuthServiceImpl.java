package vttp.csf.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import vttp.csf.backend.dto.SignupRequest;
import vttp.csf.backend.dto.UserDTO;
import vttp.csf.backend.exceptions.UsernameExistsException;
import vttp.csf.backend.model.User;
import vttp.csf.backend.repo.UserRepo;


@Service
public class AuthServiceImpl implements AuthService  {
    
    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDTO createUser(SignupRequest signupRequest) throws UsernameExistsException {

        if (userRepo.existsByUsername(signupRequest.getUsername())) {
            throw new UsernameExistsException("Username already exists");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        User createdUser = userRepo.save(user);
        UserDTO userDTO = new UserDTO();
        userDTO.setId(createdUser.getId());
        userDTO.setUsername(createdUser.getUsername());
        userDTO.setEmail(createdUser.getEmail());
        userDTO.setPassword(createdUser.getPassword());
        return userDTO;
    }
}
