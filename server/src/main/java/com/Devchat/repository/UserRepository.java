//part of the data access layer
// This is the repository interface for the User entity
//it provides data access methods to interacte with the users table in the database
package com.Devchat.repository;

import com.Devchat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>  //extends the JpaRepository interface to provide CRUD operations
{
    //findbyEmail and findbyUsername are custom query methods
    //they are automatically implemented by Spring Data JPA based on the method names
    //these methods return an Optional<User> which is a container object that may or may not contain a non-null value
    //this is useful for handling cases where the user is not found in the database

   
    //used for authentication and profile lookups
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email); //helps validate uniqueness during registration
}
