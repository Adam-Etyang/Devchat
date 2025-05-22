/*
 * package com.Devchat.service;
 * 
 * import com.Devchat.model.*;
 * import com.Devchat.repository.*;
 * import org.springframework.beans.factory.annotation.Autowired;
 * import org.springframework.stereotype.Service;
 * import com.Devchat.entity.Role;
 * 
 * 
 * @Service
 * public class PermissionService {
 * 
 * @Autowired
 * private ProjectmemberRepository projectMemberRepository;
 * 
 * @Autowired
 * public boolean canPerformAction(Long projectId, Long userID, String action) {
 * ProjectMember member =
 * projectMemberRepository.findProjectIDAndUserID(projectId, userID)
 * .orElseThrow(
 * () -> new RuntimeException("Project member not found"));
 * 
 * Role role = member.getRole();
 * 
 * switch (action) {
 * case "CREATE_ISSUE":
 * case "EDIT_ISSUE":
 * return role == Role.ADMIN || role == Role.CONTRIBUTOR;
 * case "VIEW_PROJECT":
 * return role == Role.ADMIN || role == Role.CONTRIBUTOR || role == Role.VIEWER;
 * case "DELETE_PROJECT":
 * return role == Role.ADMIN;
 * default:
 * return false;
 * }
 * }
 * }
 */
// TODO: get to know why we need a permision service,
// TODO: understand the rest of the codebase
