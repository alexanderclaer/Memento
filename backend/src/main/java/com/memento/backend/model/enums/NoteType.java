package com.memento.backend.model.enums;

/**
 * NoteType
 */
public enum NoteType {
    EQUATION("Equation"),
    HISTORICAL_FACT("Historical Fact"),
    TEXT("Text"),
    QUESTION("Question"),
    KEYWORD("Keyword"),
    EXAMPLE("Example"),
    CONCEPT("Concept");

    private final String displayName;

    NoteType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

