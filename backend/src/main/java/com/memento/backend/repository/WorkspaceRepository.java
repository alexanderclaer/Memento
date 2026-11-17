package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.memento.backend.model.Workspace;

public interface WorkspaceRepository extends MongoRepository<Workspace, String> {

    List<Workspace> findByNameContaining(String name);

    Workspace findByName(String name);

    @Query("{ 'usersId': ?0 }")
    List<Workspace> findByUserId(String userId);

    @Query("{ 'usersId': { '$in': [?0] } }")
    List<Workspace> findByUserIdContaining(String userId);
}
