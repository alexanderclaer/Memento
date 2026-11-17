package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.memento.backend.model.Note;

public interface NoteRepository extends MongoRepository<Note, String> {

    @Query("{ 'content.format': ?0 }")
    List<Note> findByContentContentType(String format);

    List<Note> findByTopicId(String topicId);
    void deleteByTopicId(String topicId);
}
