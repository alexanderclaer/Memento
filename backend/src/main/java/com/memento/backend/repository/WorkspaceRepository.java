package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.memento.backend.model.Workspace;

public interface WorkspaceRepository extends MongoRepository<Workspace, String> {

    List<Workspace> findByNameContaining(String name);

    Workspace findByName(String name);

    List<Workspace> findByUserId(String userId);

    List<Workspace> findByUserIdContaining(String userId);
}
