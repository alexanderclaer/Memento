package com.memento.backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.memento.backend.model.Workspace;
import com.memento.backend.repository.WorkspaceRepository;

@Service 
public class WorkspaceService {

    private WorkspaceRepository workspaceRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public Workspace createWorkspace(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }

    public void updateWorkspace(Workspace workspace) {
        workspace.setUpdatedAt(Instant.now());
        workspaceRepository.save(workspace);
    }

    public Workspace deleteWorkspace(Workspace workspace) {
        if (workspace == null) {
            return null;
        }
        workspaceRepository.delete(workspace);
        return workspace;
    }

    public Workspace deleteWorkspaceById(String id){
        return deleteWorkspace(getWorkspaceById(id));
    }

    public void updateWorkspaceById(String id, Workspace updatedWorkspace) {
        updatedWorkspace.setId(id);
        updateWorkspace(updatedWorkspace);
    }


    public String getWorkspaceName(String id){
        Workspace workspace = getWorkspaceById(id);
        return workspace != null ? workspace.getName(): null;
    }

    public String updateWorkspaceName(String id, String name){
        Workspace workspace = getWorkspaceById(id);
        if (workspace==null) {return null;}

        workspace.setName(name);
        return name;
    }

    public Workspace getWorkspaceById(String id) {
        return workspaceRepository.findById(id).orElse(null);
    }

    public Workspace getWorkspaceByName(String name) {
        return workspaceRepository.findByName(name);
    }

    public List<Workspace> getWorkspaceByNameContaining(String name) {
        return workspaceRepository.findByNameContaining(name);
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public List<Workspace> getWorkspacesByUserId(String userId) {
        return workspaceRepository.findByUserId(userId);
    }

    public List<Workspace> getWorkspacesByUserIdContaining(String userId) {
        return workspaceRepository.findByUserIdContaining(userId);
    }
}
