package com.Devchat.service;

import com.Devchat.dto.ProjectDTO;
import com.Devchat.model.Project;
import com.Devchat.model.User;
import com.Devchat.repository.ProjectRepository;
import com.Devchat.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    //create a new project
    @Transactional
    public Project createProject(ProjectDTO projectDTO){
        User creator = userRepository.findById(projectDTO.getCreatorID()).orElseThrow(() -> new RuntimeException("User not found"));
        Project project  = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDecription());
        project.setCreator(creator);
        return projectRepository.save(project);
    }
    
    //get project
    public Project getProject (Long Id){
        return projectRepository.findById(Id).orElseThrow(() -> new RuntimeException("Project not found"));
    }


    //update project
    @Transactional
    public Project updateProject(Long Id, ProjectDTO projectDTO){
        Project project = projectRepository.findById(Id).orElseThrow(() -> new RuntimeException("Project not found")); 

        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDecription());
        return projectRepository.save(project);
    }


    //delete project
    @Transactional
    public void deleteproject(Long Id){
        Project project = projectRepository.findById(Id).orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    //search projects
    public List <Project> searchprojects(String query){
        return projectRepository.searchProjects(query);
    }
    //get projects by user
    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByCreatorId(userId);
    }
    //get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }


    
}