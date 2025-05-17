package com.Devchat.controller;

import com.Devchat.dto.ProjectDTO;
import com.Devchat.model.Project;
import com.Devchat.service.ProjectService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/projects")
public class ProjectController{

    @Autowired
    private ProjectService projectService;

    //create a new project(post request)
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectDTO projectDTO) {

        Project project = projectService.createProject(projectDTO);
        return ResponseEntity.ok(project);
    }

    //get project(get request)
    @GetMapping("/{Id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id){
        Project project = projectService.getProject(id);
        return ResponseEntity.ok(project);
    }

    //update project (put request)
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO){
        Project project = projectService.updateProject(id, projectDTO);
        return ResponseEntity.ok(project);
    }
    //delete project(delete request)
    @DeleteMapping("/{Id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id ){
        projectService.deleteproject(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


    //get all projects(get request)
    @GetMapping
    public ResponseEntity <List<Project>> getAllProjects(){
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    //search projects(get request)
    @GetMapping("/search")
    public ResponseEntity <List<Project>> searchProjects(@RequestParam String query) {
        List<Project> projects = projectService.searchprojects(query);
        return ResponseEntity.ok(projects);
    } 
    
    

}