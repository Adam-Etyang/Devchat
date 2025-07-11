package com.Devchat.Service;

import com.Devchat.entity.Role;
import com.Devchat.DTO.RoleDTO;
import com.Devchat.exceptions.RoleNotFoundException;
import com.Devchat.mapper.RoleMapper;
import com.Devchat.repository.*;
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

     */
    public RoleService(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    /**
     * Creates a new role in the system.
     */
    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = roleMapper.toEntity(roleDTO);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }

    /**
     * Retrieves a role by its ID.
     *
     */
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException(id));
        return roleMapper.toDTO(role);
    }

    /**
     * Retrieves a role by its name.
     *
     */
    public RoleDTO getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new RoleNotFoundException("Role with name " + name + " not found"));
        return roleMapper.toDTO(role);
    }

    /**
     * Retrieves all roles in the system.
     *

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