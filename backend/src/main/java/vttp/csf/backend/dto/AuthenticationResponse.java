package vttp.csf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    
    private String jwt;
    private String username;
    private Long id;

}
