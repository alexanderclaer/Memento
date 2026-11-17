package com.memento.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.memento.backend.model.Workspace;
import com.memento.backend.service.WorkspaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController 
@RequestMapping("api/workspaces") 
@CrossOrigin(origins = "*")
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(@RequestBody Workspace workspace) {
        workspaceService.createWorkspace(workspace);
        return ResponseEntity.status(HttpStatus.CREATED).body(workspace);
    }
    

    @GetMapping("{id}")
    public ResponseEntity<Workspace> getWorkspaceById(@PathVariable("id") String id) {
        Workspace workspace = workspaceService.getWorkspaceById(id);
        return workspace != null ? ResponseEntity.ok(workspace): ResponseEntity.notFound().build();
    }

    @PatchMapping("{id}/name")
    public ResponseEntity<Void> updateWorkspaceName(@PathVariable("id") String id, @RequestBody String name){
        if (workspaceService.updateWorkspaceName(id, name) == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/name")
    public ResponseEntity<Workspace> getWorkspaceByName(@RequestParam("name") String name) {
        Workspace workspace = workspaceService.getWorkspaceByName(name);
        return workspace != null ? ResponseEntity.ok(workspace): ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Workspace>> getWorkspaceByNameContaining(@RequestParam("name") String name){
        return ResponseEntity.ok(workspaceService.getWorkspaceByNameContaining(name)) ;
        
    }

    //Returns all the workspaces of an user
    @GetMapping("user/{userId}")
    public ResponseEntity<List<Workspace>> getWorkspacesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(workspaceService.getWorkspacesByUserId(userId));
    }
    
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable("id") String id){
        Workspace workspace = workspaceService.deleteWorkspaceById(id);
        return workspace != null ? ResponseEntity.noContent().build(): ResponseEntity.notFound().build();
    }
    
}
