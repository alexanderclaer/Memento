package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.memento.backend.model.Notebook;

public interface NotebookRepository extends MongoRepository<Notebook, String> {
    
    List<Notebook> findByWorkspaceId(String workspaceId);
    List<Notebook> findAll();
    List<Notebook> findByTitleContaining(String title);
    Notebook findByTitle(String title);
    void deleteByWorkspaceId(String workspaceId);
}
