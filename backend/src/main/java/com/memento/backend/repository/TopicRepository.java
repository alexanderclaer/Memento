package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.memento.backend.model.Topic;

public interface TopicRepository extends MongoRepository<Topic, String> {
    
    //Topic findTopicById(String id);
    Topic findTopicByTitle(String title);

    @Query("{ 'bookId': ?0 }")
    List<Topic> findTopicByNotebookId(String notebookId);

    List<Topic> findTopicsByTitleContaining(String title);

    @Query(value = "{ 'bookId': ?0 }", delete = true)
    void deleteByNotebookId(String notebookId);
}
