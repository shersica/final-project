package vttp.csf.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vttp.csf.backend.model.User;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    
    User findFirstByUsername(String username);

    boolean existsByUsername(String username);



}
