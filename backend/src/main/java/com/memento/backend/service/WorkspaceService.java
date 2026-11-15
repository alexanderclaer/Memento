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

    public void deleteWorkspace(Workspace workspace) {
        workspaceRepository.deleteById(workspace.getId());
    }

    public void updateWorkspaceById(String id, Workspace updatedWorkspace) {
        updatedWorkspace.setId(id);
        updateWorkspace(updatedWorkspace);
    }

    public void deleteWorkspaceById(String workspaceId) {
        workspaceRepository.deleteById(workspaceId);
    }

    public Workspace getWorkspaceById(String id) {
        return workspaceRepository.findById(id).orElse(null);
    }

    public Workspace getWorkspaceByName(String name) {
        return workspaceRepository.findByName(name);
    }

    public Workspace getWorkspaceByNameContaining(String name) {
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
