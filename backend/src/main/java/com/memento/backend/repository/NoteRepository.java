package com.memento.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.memento.backend.model.Note;

public interface NoteRepository extends MongoRepository<Note, String> {

    List<Note> findByContentContentType(String contentType);

    List<Note> findByTopicId(String topicId);
    void deleteByTopicId(String topicId);
}
