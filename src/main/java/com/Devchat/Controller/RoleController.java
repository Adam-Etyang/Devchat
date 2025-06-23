package com.Devchat.Controller;

import com.Devchat.DTO.RoleDTO;
import com.Devchat.Service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling Role-related HTTP requests.
 * This controller provides endpoints for managing roles in the system.
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    /**
     * Constructor for dependency injection.
     *
     * @param roleService Service for role business logic
     */
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * Creates a new role.
     *
     * @param roleDTO The role data to create
     * @return The created role with HTTP 201 status
     */
    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleDTO roleDTO) {
        RoleDTO createdRole = roleService.createRole(roleDTO);
        return new ResponseEntity<>(createdRole, HttpStatus.CREATED);
    }

    /**
     * Retrieves a role by ID.
     *
     * @param id The ID of the role to retrieve
     * @return The role with HTTP 200 status
     */
    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long id) {
        RoleDTO role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    /**
     * Retrieves a role by name.
     *
     * @param name The name of the role to retrieve
     * @return The role with HTTP 200 status
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<RoleDTO> getRoleByName(@PathVariable String name) {
        RoleDTO role = roleService.getRoleByName(name);
        return ResponseEntity.ok(role);
    }

    /**
     * Retrieves all roles.
     *
     * @return List of all roles with HTTP 200 status
     */
    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    /**
     * Updates an existing role.
     *
     * @param id The ID of the role to update
     * @param roleDTO The updated role data
     * @return The updated role with HTTP 200 status
     */
    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleDTO roleDTO) {
        RoleDTO updatedRole = roleService.updateRole(id, roleDTO);
        return ResponseEntity.ok(updatedRole);
    }

    /**
     * Deletes a role.
     *
     * @param id The ID of the role to delete
     * @return HTTP 204 status (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}