package vttp.csf.backend.service;

import org.springframework.stereotype.Service;

import vttp.csf.backend.dto.SignupRequest;
import vttp.csf.backend.dto.UserDTO;
import vttp.csf.backend.exceptions.UsernameExistsException;


@Service
public interface AuthService {

    public UserDTO createUser(SignupRequest signupRequest) throws UsernameExistsException;
    
}
