package com.Devchat.projectmodule.mapper;

import com.Devchat.projectmodule.Entity.Role;
import com.Devchat.projectmodule.dto.RoleDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper class for converting between Role entity and RoleDTO.
 * This class handles the conversion of data between the persistence layer and the API layer.
 */
@Component
public class RoleMapper {

    /**
     * Converts a Role entity to a RoleDTO.
     *
     * @param role The Role entity to convert
     * @return The converted RoleDTO, or null if the input is null
     */
    public RoleDTO toDTO(Role role) {
        if (role == null) {
            return null;
        }

        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        return dto;
    }

    /**
     * Converts a RoleDTO to a Role entity.
     *
     * @param dto The RoleDTO to convert
     * @return The converted Role entity, or null if the input is null
     */
    public Role toEntity(RoleDTO dto) {
        if (dto == null) {
            return null;
        }

        Role role = new Role();
        role.setId(dto.getId());
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());
        return role;
    }

    /**
     * Converts a list of Role entities to a list of RoleDTOs.
     *
     * @param roles The list of Role entities to convert
     * @return The converted list of RoleDTOs, or null if the input is null
     */
    public List<RoleDTO> toDTOList(List<Role> roles) {
        if (roles == null) {
            return null;
        }

        return roles.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Converts a list of RoleDTOs to a list of Role entities.
     *
     * @param dtos The list of RoleDTOs to convert
     * @return The converted list of Role entities, or null if the input is null
     */
    public List<Role> toEntityList(List<RoleDTO> dtos) {
        if (dtos == null) {
            return null;
        }

        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}