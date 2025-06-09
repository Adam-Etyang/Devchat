package com.Devchat.projectmodule.services;

import com.Devchat.projectmodule.Role;
import com.Devchat.projectmodule.dto.RoleDTO;
import com.Devchat.projectmodule.exceptions.RoleNotFoundException;
import com.Devchat.projectmodule.mapper.RoleMapper;
import com.Devchat.projectmodule.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service class for handling Role-related business logic.
 * This class manages all operations related to roles in the system.
 */
@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    /**
     * Constructor for dependency injection.
     *
     * @param roleRepository Repository for role data access
     * @param roleMapper Mapper for converting between Role and RoleDTO
     */
    @Autowired
    public RoleService(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    /**
     * Creates a new role in the system.
     *
     * @param roleDTO The role data to create
     * @return The created role as a DTO
     */
    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = roleMapper.toEntity(roleDTO);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }

    /**
     * Retrieves a role by its ID.
     *
     * @param id The ID of the role to retrieve
     * @return The role as a DTO
     * @throws RoleNotFoundException if the role doesn't exist
     */
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));
        return roleMapper.toDTO(role);
    }

    /**
     * Retrieves a role by its name.
     *
     * @param name The name of the role to retrieve
     * @return The role as a DTO
     * @throws RoleNotFoundException if the role doesn't exist
     */
    public RoleDTO getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new RoleNotFoundException("Role with name " + name + " not found"));
        return roleMapper.toDTO(role);
    }

    /**
     * Retrieves all roles in the system.
     *
     * @return List of all roles as DTOs
     */
    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.toDTOList(roles);
    }

    /**
     * Updates an existing role.
     *
     * @param id The ID of the role to update
     * @param roleDTO The updated role data
     * @return The updated role as a DTO
     * @throws RoleNotFoundException if the role doesn't exist
     */
    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        if (!roleRepository.existsById(id)) {
            throw new RoleNotFoundException(id);
        }

        Role role = roleMapper.toEntity(roleDTO);
        role.setId(id);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }

    /**
     * Deletes a role from the system.
     *
     * @param id The ID of the role to delete
     * @throws RoleNotFoundException if the role doesn't exist
     */
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RoleNotFoundException(id);
        }
        roleRepository.deleteById(id);
    }
}